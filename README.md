# Siphoned Guild Vault

Persian RTL Albion Online guild ledger. Public read access; ChatGPT-authenticated admin write access restricted by the server-side `ADMIN_EMAIL` runtime secret. The supplied 17 transactions are the initial immutable ledger baseline; subsequent imports are stored in D1 and merged with that baseline on every read.

## Run

`npm run dev` for local preview, `node --test lib/ledger.test.mjs` for ledger tests, `npm run db:generate` for schema migrations, `npm run build` for production.

Apply the generated SQL to local D1 before previewing the ledger API. Production migrations are deployed through Sites. Configure `ADMIN_EMAIL` in the hosted environment before deployment. The local starter simulates ChatGPT as `seedy@sites.test`; grant that email only in an ignored local environment file when testing the admin workflow locally. Never configure it as the production administrator.

## Data rules

Paste the tab-separated Albion export with Date, Player, Reason, Amount headers. Imports accept up to 2,000 records, reject the entire import if any row is invalid, and use an atomic D1 batch with INSERT OR IGNORE. Identity is the exact game timestamp, case-insensitive player name, reason, and integer amount. Genuine indistinguishable rows cannot be differentiated because the game export supplies no transaction ID. Different amounts, timestamps, players, or reasons remain distinct. No timezone conversion is applied to game timestamps.

Balances are net amounts in the supplied history, without any inferred opening balance. Minimum readiness balance is 10. Rank is net balance, not total deposits. Import writes require authenticated administrator identity and same-origin requests. Public responses have no cache so balances update on refresh.
