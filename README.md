# Macrro Online

Starter implementation based on the supplied PRD and blueprint.

## Included

- Public landing page `/`
- User download UI `/download`
- Admin login UI `/admin/login`
- Admin dashboard `/admin/dashboard`
- Link manager `/admin/links`
- Ads manager `/admin/ads`
- Analytics `/admin/analytics`
- Settings `/admin/settings`
- API starter `/api/download/validate`
- Supabase schema in `supabase/schema.sql`
- Sci-Fi glassmorphism / antigravity UI

## Run locally

Requirements:
- Node.js 20+ recommended
- npm

```powershell
cd macrro-online
npm install
npm run dev
```

Open:
`http://localhost:3000`

## Important

The current frontend uses demo authentication and illustrative dashboard data. Before production:

1. Configure Supabase Auth.
2. Add `.env.local` from `.env.example`.
3. Run `supabase/schema.sql`.
4. Replace demo login with server-side Supabase Auth.
5. Add real temporary-token/session generation.
6. Add rate limiting and strict RLS.
7. Connect the download service appropriate to the content you are authorized to distribute.
8. Add approved ad-network scripts through the Ads Manager while following each network's policies.

Never expose a Supabase service-role key in client-side code.
