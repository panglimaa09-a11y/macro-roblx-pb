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

type AdsConfig = {
  network: string;
  placement: string;
  script: string;
  active: boolean;
};

const defaults: AdsConfig = {
  network: "Google AdSense",
  placement: "Banner",
  script: "",
  active: true,
};

function normalizeAds(input: Partial<AdsConfig>): AdsConfig {
  const allowedNetworks = [
    "Google AdSense",
    "Adsterra",
    "Custom Network",
  ];

  const allowedPlacements = [
    "Banner",
    "Native",
    "Interstitial",
    "Pop-under",
  ];

  const network = allowedNetworks.includes(String(input.network))
    ? String(input.network)
    : defaults.network;

  const placement = allowedPlacements.includes(String(input.placement))
    ? String(input.placement)
    : defaults.placement;

  const script =
    typeof input.script === "string"
      ? input.script.slice(0, 20000)
      : defaults.script;

  return {
    network,
    placement,
    script,
    active: input.active === false ? false : true,
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
    .eq("setting_key", "ads")
    .maybeSingle();

  if (error) {
    console.error("GET /api/admin/ads:", error);

    return NextResponse.json(
      {
        error: "Gagal membaca konfigurasi iklan.",
        details: error.message,
      },
      { status: 500 }
    );
  }

  const ads = normalizeAds(
    (data?.setting_value ?? {}) as Partial<AdsConfig>
  );

  return NextResponse.json(
    { ads },
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
        error: "Konfigurasi Supabase server belum tersedia.",
      },
      { status: 500 }
    );
  }

  let body: Partial<AdsConfig>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: "Data konfigurasi iklan tidak valid.",
      },
      { status: 400 }
    );
  }

  const ads = normalizeAds(body);

  const { error } = await supabase
    .from("site_settings")
    .upsert(
      {
        setting_key: "ads",
        setting_value: ads,
        description: "Advertisement network configuration",
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "setting_key",
      }
    );

  if (error) {
    console.error("POST /api/admin/ads:", error);

    return NextResponse.json(
      {
        error: "Gagal menyimpan konfigurasi iklan.",
        details: error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    ads,
  });
}
