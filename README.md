# Vastra Lakshnam

## Production Setup

The catalog is shared through Supabase. Configure these Vite variables before deployment:

```text
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Run `supabase_schema.sql` in the Supabase SQL editor. It creates the catalog tables and enables realtime updates for products and categories. Admin product saves, removals, stock changes, and customer catalog views then converge through the shared database across browsers and devices.

For production, replace the development admin password flow with Supabase Auth plus an admin role, and restrict product/category write policies to that role. The included public read policies are intended for the storefront; public write policies are only suitable for local development until replaced.

## Development

```bash
npm install
npm run dev
```

Build for deployment with `npm run build`.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
