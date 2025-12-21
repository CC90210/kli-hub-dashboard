# KLI Hub Dashboard

Enterprise RAG Dashboard for Merchant, Supplier & Customer Intelligence.

## 🚀 Deployment Instructions (Vercel)

### 1. Environment Variables
When deploying to Vercel, you **MUST** add the following Environment Variables in the **Settings > Environment Variables** section of your Vercel Project.

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `DATABASE_URL` | Connection string for PostgreSQL (Neondb/Supabase/etc) | `postgres://user:pass@host:5432/db` |
| `NEXTAUTH_SECRET` | Secret for encryption | Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your production URL (Vercel handles this automatically usually, but good to set if issues arise) | `https://your-project.vercel.app` |
| `N8N_CHAT_WEBHOOK_URL` | URL for your n8n Chat Workflow | `https://n8n.your-domain.com/webhook/...` |
| `N8N_DOCUMENT_WEBHOOK_URL` | URL for your n8n Document Indexing Workflow | `https://n8n.your-domain.com/webhook/...` |

### 2. Database
This project uses **Prisma**.
- During the build (`npm run build`), we run `npx prisma generate`.
- You need a valid PostgreSQL database for production.
- If you just want to test without a real DB, you can try setting `DATABASE_URL` to a dummy value, but the app might fail at runtime. For a quick demo, we recommend using a free PostgreSQL instance from **Neon.tech** or **Supabase**.

## 🛠️ Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up local environment:
   - Copy `.env.example` to `.env` (or create it)
   - Set `DATABASE_URL="file:./dev.db"` for local SQLite

3. Run migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

4. Start server:
   ```bash
   npm run dev
   ```
