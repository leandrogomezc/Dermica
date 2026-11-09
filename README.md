This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## IndexNow

La clave está en `public/<clave>.txt`. El sitio la publica en `https://dermica.lat/<clave>.txt`.

Cuando ese archivo ya esté en producción, enviá las URLs del sitemap:

```bash
npm run indexnow
```

El comando lee la clave local, comprueba que producción la sirve, toma las URLs de `https://dermica.lat/sitemap.xml` y las manda a `https://api.indexnow.org/indexnow` para el host `dermica.lat`.

## Verificación de Google y Bing

Estas variables son opcionales. Si no están definidas, o quedan en blanco, el HTML no incluye la meta.

- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` genera `<meta name="google-site-verification">`.
- `NEXT_PUBLIC_BING_SITE_VERIFICATION` genera `<meta name="msvalidate.01">`.

Definilas en el entorno de build y volvé a desplegar: Next las incorpora al generar los metadatos.
