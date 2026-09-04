import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getClient() {
  if (!url || !key) return null;

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

type Settings = {
  countdown: string;
  expiry: string;
  ads: boolean;
  maintenance: boolean;
  maintenanceMessage: string;
};

const defaults: Settings = {
  countdown: "5",
  expiry: "10",
  ads: true,
  maintenance: false,
  maintenanceMessage:
    "Website sedang dalam pemeliharaan. Silakan kembali beberapa saat lagi.",
};

function normalizeSettings(input: Partial<Settings>): Settings {
  const countdownNumber = Number(input.countdown);
  const expiryNumber = Number(input.expiry);

  return {
    countdown: String(
      Number.isFinite(countdownNumber)
        ? Math.min(30, Math.max(1, Math.round(countdownNumber)))
        : 5
    ),

    expiry: String(
      Number.isFinite(expiryNumber)
        ? Math.min(60, Math.max(1, Math.round(expiryNumber)))
        : 10
    ),

    ads: input.ads !== false,

    maintenance: input.maintenance === true,

    maintenanceMessage:
      typeof input.maintenanceMessage === "string" &&
      input.maintenanceMessage.trim()
        ? input.maintenanceMessage.trim().slice(0, 500)
        : defaults.maintenanceMessage,
  };
}

export async function GET() {
  const supabase = getClient();

  if (!supabase) {
    return NextResponse.json(
      { error: "Konfigurasi Supabase server belum tersedia." },
      { status: 500 }
    );
  }

  const { data, error } = await supabase
    .from("site_settings")
    .select("setting_key, setting_value")
    .in("setting_key", ["site", "download", "security"]);

  if (error) {
    console.error("GET /api/admin/settings:", error);

    return NextResponse.json(
      {
        error: "Gagal membaca pengaturan.",
        details: error.message,
      },
      { status: 500 }
    );
  }

  const rows = Object.fromEntries(
    (data ?? []).map((row) => [
      row.setting_key,
      row.setting_value ?? {},
    ])
  );

  const site = rows.site ?? {};
  const download = rows.download ?? {};
  const security = rows.security ?? {};

  const settings = normalizeSettings({
    countdown: String(
      download.countdown_seconds ?? defaults.countdown
    ),

    expiry: String(
      security.token_expiration_minutes ?? defaults.expiry
    ),

    ads: download.ad_enabled ?? defaults.ads,

    maintenance:
      site.maintenance ?? defaults.maintenance,

    maintenanceMessage:
      site.maintenance_message ??
      defaults.maintenanceMessage,
  });

  return NextResponse.json(
    { settings },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}

export async function POST(request: Request) {
  const supabase = getClient();

  if (!supabase) {
    return NextResponse.json(
      {
        error:
          "Konfigurasi Supabase server belum tersedia.",
      },
      { status: 500 }
    );
  }

  let body: Partial<Settings>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: "Data pengaturan tidak valid.",
      },
      { status: 400 }
    );
  }

  const settings = normalizeSettings(body);

  const { data: existing, error: existingError } =
    await supabase
      .from("site_settings")
      .select("setting_key, setting_value")
      .in("setting_key", [
        "site",
        "download",
        "security",
      ]);

  if (existingError) {
    console.error(
      "POST /api/admin/settings read:",
      existingError
    );

    return NextResponse.json(
      {
        error: "Gagal membaca konfigurasi lama.",
        details: existingError.message,
      },
      { status: 500 }
    );
  }

  const rows = Object.fromEntries(
    (existing ?? []).map((row) => [
      row.setting_key,
      row.setting_value ?? {},
    ])
  );

  const site = rows.site ?? {};
  const download = rows.download ?? {};
  const security = rows.security ?? {};

  const updates = [
    {
      setting_key: "site",

      setting_value: {
        ...site,

        maintenance: settings.maintenance,

        maintenance_message:
          settings.maintenanceMessage,
      },
    },

    {
      setting_key: "download",

      setting_value: {
        ...download,

        ad_enabled: settings.ads,

        countdown_seconds:
          Number(settings.countdown),

        require_active_file:
          download.require_active_file === undefined
            ? true
            : download.require_active_file,
      },
    },

    {
      setting_key: "security",

      setting_value: {
        ...security,

        token_expiration_minutes:
          Number(settings.expiry),
      },
    },
  ];

  const { error: upsertError } = await supabase
    .from("site_settings")
    .upsert(updates, {
      onConflict: "setting_key",
    });

  if (upsertError) {
    console.error(
      "POST /api/admin/settings write:",
      upsertError
    );

    return NextResponse.json(
      {
        error: "Gagal menyimpan pengaturan.",
        details: upsertError.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    settings,
  });
}
