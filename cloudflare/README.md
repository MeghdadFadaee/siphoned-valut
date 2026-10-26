# سایفوند انرژی — انتشار روی Cloudflare رایگان

Domain: https://siphoned.oneup.megh.dad
Account: 1be1e22e71d56e01fe8fdbf449b341dc
Pages project: siphoned-energy

This is the user's chosen offline update workflow. It is a public, read-only deployment. It does not require a login, API token, Access/Zero Trust subscription, D1 binding or server-side image rendering. The existing D1 database `siphoned-vault` was created and seeded during migration preparation, but is not used by this offline deployment; it has not been deleted.

## Update

1. Save the Albion TSV export (including headers) to a UTF-8 file.
2. Run `node cloudflare/import-log.mjs /absolute/path/to/export.tsv` from the repository root. This validates all rows, merges by timestamp/player/reason/amount and preserves a backup of the previous ledger.
3. Run `node cloudflare/build.mjs`. This creates `cloudflare/siphoned.zip`, the JSON ledger, the Persian PNG preview, local fonts, icons and a minimal preview-metadata Worker.
4. In Cloudflare Pages → siphoned-energy → Create deployment, select Production, upload the ZIP and choose Save and deploy.
5. Verify balance/transaction count at `/ledger.json` and image `/share-image.png`.

`/` and `/@player_name` use a very small Worker only to propagate `?t=<Unix seconds>` into social metadata, so new Discord shares get a different image URL. Data, interface, fonts and PNG are static assets. `/ledger.json` and `/share-image.png` use `Cache-Control: no-store`. There is no import or write endpoint and no public admin panel. The source Sites deployment remains available as the pre-migration backup.

## Migration snapshot

The initial migration snapshot contains 1,243 transactions, 35 players and a net balance of -2,172. Latest game timestamp: 2026-10-12 19:53:45. The copied data includes the original baseline and all subsequent imported records.

## ابزار فارسی به‌روزرسانی

روی `cloudflare/Siphoned Manager.command` دوبار کلیک کنید (یا `node cloudflare/tool/server.mjs` را اجرا کنید). ابزار در مرورگر محلی باز می‌شود. لاگ را پیست کنید یا فایل انتخاب کنید، «بررسی لاگ» و سپس «ادغام و ساخت نسخهٔ جدید» را بزنید. فایل دادهٔ قبلی پشتیبان‌گیری می‌شود. خطای ساخت، دادهٔ قبلی را بازمی‌گرداند.

برای انتشار مستقیم، یک بار «اتصال حساب کلودفلیر» را بزنید و ورود و اجازهٔ Wrangler را شخصاً در مرورگر تأیید کنید. سپس «انتشار نسخهٔ آماده» را بزنید. این کار در همان پروژهٔ `siphoned-energy` و شاخهٔ `main` منتشر می‌کند. نیازی به Zero Trust یا واردکردن کلید در ابزار نیست. اطلاعات ورود را Wrangler در محل استاندارد خودش نگه می‌دارد. گزینهٔ دانلود ZIP و بارگذاری دستی نیز موجود است.

ابزار فقط روی `127.0.0.1` گوش می‌دهد، درخواست‌های تغییر را با نشست تصادفی و Origin بررسی می‌کند و هیچ پنل مدیریتی به سایت عمومی اضافه نمی‌کند. برای بستن آن پنجرهٔ اجرای میان‌بر را ببندید یا Ctrl+C بزنید.

## Player accounts and social previews

Click any member in the leaderboard or transaction history to open `/@player_name`. Names resolve without regard to case. Each account includes readiness advice, rank, a balance timeline, all transactions with running balances, filters/search, and a full CSV export. Unknown players return 404.

The normal `node cloudflare/build.mjs` command now regenerates player metadata and all player PNGs in `dist/player-images/`, then includes them recursively in `siphoned.zip`. No extra update step or database is required. Sharing an account copies its own URL with `?t=`; the Worker propagates this timestamp to its player image. Image URLs also include a ledger revision so new builds invalidate old preview URLs. Social platforms control caching of previously posted embeds. Images contain the five latest account transactions; the page contains the full history.
