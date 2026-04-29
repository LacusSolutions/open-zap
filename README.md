# OpenZap

> Free WhatsApp click-to-chat link and QR code generator — polished, i18n-ready, privacy-first.

OpenZap is a small SSR single-page app that turns a phone number and a prefilled message into a ready-to-share WhatsApp link and downloadable QR code. Everything runs in your browser — we never see your data — and the app is built to be statically rendered so SEO is unaffected.

## Features

- Seven WhatsApp link variants in a single form:
  - Universal `wa.me/<phone>` chat link
  - `api.whatsapp.com/send` (with UTM tracking)
  - `whatsapp://` app deep link
  - `web.whatsapp.com/send` (force web client)
  - `wa.me/call/<phone>` (voice/video call)
  - `wa.me/?text=` (share without a number)
  - `wa.me/message/<SHORTCODE>` (WhatsApp Business short link)
- Country picker driven by `libphonenumber-js` with live validation
- WhatsApp-styled live chat bubble preview
- QR code generation with PNG/SVG download and size/margin/error-correction controls
- Copy-to-clipboard and "Open in WhatsApp" for any link
- Shareable form state via URL query string
- System-aware dark mode (persists to `localStorage`)
- Internationalization: English, Portuguese (Brazil), Spanish
- Per-locale metadata, `hreflang` alternates, dynamic OpenGraph image, `sitemap.xml`, `robots.txt`
- Privacy-friendly analytics via Vercel Web Analytics + Speed Insights
- Lightweight feedback dialog backed by Formspree (or mock mode if not configured)

## Stack

- [Next.js 16](https://nextjs.org/) (App Router, Turbopack) with [React 19.2](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/) and [TailwindCSS 4](https://tailwindcss.com/) (CSS-first `@theme`)
- [next-intl](https://next-intl.dev/) for i18n, [next-themes](https://github.com/pacocoursey/next-themes) for dark mode
- [react-hook-form](https://react-hook-form.com/) + [zod](https://zod.dev/) for forms
- [libphonenumber-js](https://github.com/catamphetamine/libphonenumber-js) + [qrcode](https://github.com/soldair/node-qrcode)
- [@vercel/analytics](https://vercel.com/docs/analytics) + [@vercel/speed-insights](https://vercel.com/docs/speed-insights)
- DX: ESLint 9 (via [`eslint-config-any`](https://github.com/LacusSolutions/eslint-config-any)), Husky, lint-staged, Commitlint, Commitizen, Vitest

## Getting started

Requires Node ≥ 20 or Bun ≥ 1.3.

```bash
bun install
cp .env.example .env.local
bun run dev
```

Open http://localhost:3000. The default locale (`en`) is served at `/`; other locales live at `/pt-BR` and `/es`.

### Scripts

| Script                | What it does                                |
| --------------------- | ------------------------------------------- |
| `dev`                 | Start the Next.js dev server (Turbopack)    |
| `build`               | Build for production                        |
| `start`               | Run the production build                    |
| `lint` / `lint:fix`   | Run ESLint (and auto-fix)                   |
| `format`              | Run Prettier over the repo                  |
| `typecheck`           | Run `tsc --noEmit`                          |
| `test` / `test:watch` | Run the Vitest suite (or watch it)          |
| `commit`              | Commitizen prompt for a Conventional Commit |

### Git hooks

Husky runs two hooks automatically after `bun install`:

- **`pre-commit`** → `lint-staged` (ESLint + Prettier on changed files only)
- **`commit-msg`** → `commitlint` (enforces Conventional Commits)

Use `bun run commit` if you want Commitizen's interactive prompt.

## Project structure

```
src/
  app/                   Next.js 16 App Router routes
    [locale]/            Localized shell (layout, page, not-found, opengraph-image)
    globals.css          Tailwind v4 @theme + WhatsApp palette + dark-mode tokens
    icon.svg             Favicon
    robots.ts
    sitemap.ts
  components/
    generator/           Form, preview, QR, copy, chat bubble
    layout/              Header, Footer, ThemeToggle, LocaleSwitcher, Logo, icons
    feedback/            Formspree-backed feedback dialog
    providers/           ThemeProvider
    ui/                  Button, Input, Textarea, Label, Select primitives
  i18n/
    config.ts            Locales + defineRouting
    request.ts           next-intl server config
    navigation.ts        Typed Link / useRouter / usePathname
    messages/            en.json, pt-BR.json, es.json
  lib/
    whatsapp.ts          Pure URL builder (unit-tested)
    phone.ts             libphonenumber helpers
    qrcode.ts            QR generation and file download helpers
    schema.ts            zod form schema
    formState.ts         Encode/decode form state to URL query
    utils.ts             cn() utility
  proxy.ts               Next.js 16 middleware (replaces middleware.ts)
```

Every component lives in its own directory with an `index.ts` barrel, so styles (`*.module.css`), tests (`*.test.tsx`), stories, hooks, or local types can be colocated later without restructuring.

## Deploying to Vercel

1. Push the repository to GitHub.
2. Import it on [vercel.com](https://vercel.com/new) — framework detection picks Next.js automatically.
3. Set environment variables:
   - `NEXT_PUBLIC_SITE_URL` → the production URL (e.g. `https://openzap.vercel.app`)
   - `NEXT_PUBLIC_FORMSPREE_ID` → your Formspree form id (optional)
4. In the Vercel dashboard, enable **Web Analytics** and **Speed Insights** for the project.

No server code needs to run long-term — every localized page is pre-rendered as static HTML at build time (`generateStaticParams`), and the proxy runs at the edge.

## Adding a language

1. Add the locale code to `LOCALES` in `src/i18n/config.ts` and include it in `LOCALE_LABELS`.
2. Create `src/i18n/messages/<locale>.json` copied from `en.json` and translate.
3. Rebuild — the new locale appears in the switcher, the sitemap, and the hreflang alternates.

## License

MIT — see [LICENSE](./LICENSE) (pending).

> WhatsApp is a trademark of Meta Platforms, Inc. OpenZap is not affiliated with WhatsApp or Meta.
