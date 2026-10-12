# Class Council

A responsive council portal built with Next.js, TypeScript, and Supabase. The repository starts without real school names, term dates, notices, or decisions. Public lists stay empty until an authorized council member publishes real records.

## Requirements and local setup

- Node.js 20.9 or later and npm.
- A Supabase project for persistent records, account verification, and row-level security.
- An email provider configured in Supabase Auth for sign-in links.

```powershell
npm.cmd install
Copy-Item .env.example .env.local
# Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
# Run supabase/schema.sql in the Supabase SQL editor
npm.cmd run dev
```

Open <http://localhost:3000>. `npm.cmd run build`, `npm.cmd run lint`, and `npm.cmd test` run production compilation, linting, and governance rule tests. Do not put a Supabase service-role key in `.env.local` or browser code.

## Supabase configuration

1. Create a Supabase project and copy its project URL and publishable/anon key to `.env.local`.
2. Run `supabase/schema.sql` once in the SQL editor. It creates the tables, role helpers, audit triggers, vote uniqueness constraints, and RLS policies.
3. Configure Supabase Auth email sign-in and set the allowed redirect URL to `http://localhost:3000/auth/callback` plus the production callback URL.
4. Register classmates through the established class process. New accounts default to `classmate`. Using the SQL editor, an administrator must grant council roles in `profiles.role` (`delegate`, `deputy`, `representative`) and create/update the public `council_members` directory. Never grant a role based only on an email supplied by the user.
5. Set term dates and public records only after the class has confirmed them. Configure school-specific account eligibility and dates before formal votes.

## Features and security

- Public pages read published announcements/minutes, public decisions, approved petitions, and open polls from Supabase.
- Opinion submissions are private under RLS, including optional contact details. Anonymous submissions omit a public identity but can remain identifiable to operators or in technical logs.
- Petition creation and support require a signed-in account. A primary key prevents duplicate support; a trigger keeps the support count current.
- Poll votes require authentication, enforce one vote per account, and are accepted only while the poll is open and within its voting window. Ballot configuration is locked while open.
- Council member access is checked in PostgreSQL RLS. The frontend does not grant roles. Audit triggers record changes to announcements, minutes, and decisions.
- Council decisions, class-wide votes, and administrative matters have distinct decision types. The decision helper and automated tests represent ordinary majority, separate tie-break, and veto eligibility.

## Known limitations and required school configuration

The site does not verify that a registered email belongs to a particular class unless the school configures that eligibility process. Vote records are account-linked and therefore are not anonymous; the app must not describe them as secure or tamper-proof. Formal votes require a school-approved voter eligibility list, decision threshold, and ballot procedure. Poll result aggregation and ballot secrecy are not provided. Petition support is identity-unique per Supabase account, not proof of class membership.

The in-app council workspace can publish announcements, record proposals, review private opinions, moderate petitions, update progress, and inspect audit entries. It does not yet provide council minute drafting/publishing, poll creation/result reporting, roll-call vote recording, tie-break recording, member profile/term administration, or complete petition change-request handling. A representative veto endpoint enforces representative role, approved status, and a recorded reason, but a passed council proposal must currently be marked approved through a trusted administrator before it can be vetoed. These workflows need to be added before the site can serve as the complete official system of record. The school must also decide who may serve, how elections and term transitions are conducted, and how long private submissions are retained.

## Deployment

Deploy the Next.js app on a Node-compatible host such as Vercel. Add the same two public Supabase environment variables in the host settings, configure the production Auth callback URL, run the SQL schema against the production Supabase project, and deploy. Keep database credentials server-side; the included policies depend on the publishable key and authenticated user context.
