# JoabStudios

Sitio comercial, sistema de cotizaciones y CRM interno de **JoabStudios**, agencia digital especializada en hospitality.

Next.js 16 (App Router, Cache Components) · React 19 · TypeScript estricto · Tailwind CSS 4 · Motion · React Hook Form + Zod · Supabase (Postgres, Auth, RLS) · Resend.

## Estructura

```
app/
  (site)/            Sitio público: /, /work, /work/[slug], /services, /about, /contact, /quote
  admin/             CRM privado: /admin/login, /admin/leads, /admin/leads/[id]
  sitemap.ts · robots.ts · opengraph-image.tsx · icon.svg
components/          UI (botones, campos), secciones, home, trabajo, formularios, admin
lib/
  content/           Fuente única de proyectos, servicios, proceso, modalidades e imágenes
  leads/             Esquemas Zod, opciones del formulario, Server Actions públicas, consultas del CRM
  auth/admin.ts      Capa de acceso: verifica JWT (getClaims) + pertenencia a admin_users
  supabase/          Clientes (sesión del usuario / clave secreta solo en servidor) y tipos
  notifications/     Correo de nuevo prospecto (Resend)
proxy.ts             Refresca la sesión y redirige /admin sin sesión (no es la barrera de autorización)
supabase/migrations/ Esquema, RLS, triggers de historial
public/work/         Capturas reales de los proyectos
```

## Puesta en marcha

```bash
pnpm install
cp .env.example .env.local   # completa los valores
pnpm dev
```

### 1. Supabase

1. Crea un proyecto en Supabase.
2. Ejecuta `supabase/migrations/20261123012210_leads_crm.sql` (SQL Editor, o `supabase db push` con el proyecto enlazado).
3. Copia en `.env.local`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` y `SUPABASE_SECRET_KEY` (Project Settings → API Keys).
4. Desactiva el registro público de usuarios (Authentication → Sign In / Providers → *Allow new users to sign up*: off).
5. Crea tu usuario administrador (Authentication → Users → *Add user*) y dale acceso al CRM:

   ```sql
   insert into public.admin_users (user_id, role)
   select id, 'admin' from auth.users where email = 'tu-correo@dominio.com';
   ```

### 2. Notificaciones (Resend)

Verifica tu dominio en Resend y define `RESEND_API_KEY`, `RESEND_FROM_EMAIL` y `LEAD_NOTIFICATION_EMAIL`. Si faltan, las solicitudes se guardan igual y el aviso se registra en los logs.

### 3. Datos de contacto y analítica

`NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_WHATSAPP_NUMBER` y `NEXT_PUBLIC_GA_MEASUREMENT_ID` son opcionales: lo que no esté configurado no se muestra. Las redes sociales se editan en código, en `socialProfiles` (`lib/site-config.ts`): con `href: null` se muestran como etiqueta sin enlace. Define `NEXT_PUBLIC_SITE_URL` con el dominio final para canonical, sitemap y Open Graph.

## Seguridad

- El público nunca accede a las tablas: las solicitudes se validan en una Server Action y se insertan con la clave secreta.
- Antispam: honeypot, tiempo mínimo de llenado y límite de 5 envíos por hora por IP (hash con sal, nunca la IP).
- CRM: cada página y Server Action verifica sesión y rol en el servidor; RLS lo vuelve a exigir en la base de datos. Los administradores solo pueden modificar estado, seguimiento y cotización; el historial lo escribe un trigger.
- Si Supabase no está configurado, los formularios muestran un error real (no simulan éxito).

## Contenido

- Proyectos: `lib/content/projects.ts`. Solo información verificada; las capturas viven en `public/work/<slug>/`.
- Fotografía editorial (Unsplash): `lib/content/images.ts`, lista para reemplazar por fotos propias.

## Scripts

`pnpm dev` · `pnpm build` · `pnpm start` · `pnpm lint`
