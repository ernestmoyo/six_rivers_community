# Six Rivers M&E — Android APK

This directory builds the **Six Rivers M&E** Android APK as a Trusted Web Activity
(TWA) wrapping the deployed PWA at `app/`. The APK is what field officers, trainers,
and M&E staff install on their Android phones; all behaviour — forms, photo capture,
offline queue, SRATA Academy, dashboard — comes from the PWA.

The actual Bubblewrap output (`*.apk`, `*.aab`, `keystore.jks`, `twa-manifest.json`)
is **not committed** to git. See `.gitignore` in this folder.

## Prerequisites

- Node.js 20+
- Java 17 JDK (Bubblewrap shells out to `keytool` and Android build tools)
- Android SDK + Build Tools (Bubblewrap downloads the necessary components on first run)
- A deployed PWA URL with HTTPS (e.g. `https://six-rivers-me.vercel.app`)

## One-time setup

```bash
npm i -g @bubblewrap/cli
```

## Initialise the project

From the `apk/` directory:

```bash
bubblewrap init --manifest=https://<your-deployed-pwa>/manifest.webmanifest
```

Answer the prompts:

| Prompt                  | Answer                              |
| ----------------------- | ----------------------------------- |
| Package id              | `africa.sixrivers.me`               |
| Application name        | `Six Rivers M&E`                    |
| Launcher name           | `Six Rivers`                        |
| Theme color             | `#071637`                           |
| Background color        | `#FAF9F5`                           |
| Start URL               | `/dashboard`                        |
| Display mode            | `standalone`                        |
| Orientation             | `portrait`                          |
| Signing key location    | `./keystore.jks` (keep this safe!)  |

Bubblewrap will fetch icons and write `twa-manifest.json`.

## Build a release APK + AAB

```bash
bubblewrap build
```

Outputs:

- `app-release-bundle.aab` — upload to the Play Console.
- `app-release-signed.apk` — sideload to any Android device for field testing.

## Wire Digital Asset Links

After your first signed build, run:

```bash
bubblewrap fingerprint
```

Copy the SHA-256 fingerprint and paste it into
`../app/public/.well-known/assetlinks.json`, replacing
`REPLACE_WITH_RELEASE_KEYSTORE_SHA256_FINGERPRINT`. Redeploy the PWA so the
fingerprint is served at `https://<your-pwa>/.well-known/assetlinks.json`.
Android will then hide the browser URL bar in the TWA.

## Distributing without the Play Store

For internal field testing, host `app-release-signed.apk` somewhere the team can
download it (e.g. a public Vercel route or the Six Rivers website), and share
the link. Android may warn about "Install unknown apps" the first time — that
is expected for sideloaded APKs.

When ready for Play Store distribution, upload the `.aab` to the Play Console
as an internal-testing release first, then promote to closed → open → production.

## Updating

Whenever the PWA changes meaningfully (new pages, manifest tweaks, icon
updates), bump `appVersion` in `twa-manifest.json` and re-run `bubblewrap build`.
The TWA pulls fresh code from the PWA on launch, so most updates don't need an
APK rebuild — only manifest / icon / package changes do.

## Branding

All branding flows from the PWA — there is no separate brand asset pipeline for
the APK. The icons used are `/icons/icon-192.png`, `/icons/icon-512.png`, and
`/icons/maskable-512.png` from `app/public/icons/`.
