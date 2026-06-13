# My Medical Note

My Medical Note es una aplicacion web para gestionar notas medicas de forma mas ordenada, segura y rapida. Permite autenticacion de usuarios, creacion y busqueda de notas clinicas, carga de archivos PDF y procesamiento de contenido para flujos asistidos por IA.

## Para que sirve

La app esta pensada para centralizar informacion clinica dentro de una interfaz moderna enfocada en productividad.

- Crear, consultar, editar y eliminar notas medicas.
- Filtrar notas por titulo, fecha y nivel de urgencia.
- Subir documentos PDF asociados al trabajo clinico.
- Extraer y fragmentar texto de PDFs para almacenamiento vectorial.
- Usar contexto documental para funcionalidades de IA y prediccion.
- Mantener acceso autenticado con cuentas locales y Google.

## Funcionalidades principales

- Landing page de presentacion orientada a profesionales de la salud.
- Registro e inicio de sesion con credenciales y proveedor Google.
- Dashboard con resumen de notas recientes y PDFs cargados.
- CRUD de notas medicas con validacion en backend.
- Upload de PDF a Cloudinary.
- Indexacion del contenido de PDFs en ChromaDB usando embeddings de Cohere.
- Endpoint de IA para prediccion contextual usando Google Generative AI.

## Stack tecnologico

### Frontend

- Next.js 16 con App Router.
- React 19.
- Tailwind CSS v4.
- shadcn/ui + Radix UI.
- Heroicons.

### Backend y datos

- Next.js Route Handlers para la API.
- NextAuth para autenticacion.
- MongoDB + Mongoose para persistencia principal.
- Cloudinary para almacenamiento de PDFs.
- ChromaDB Cloud para almacenamiento vectorial.
- Cohere para embeddings.
- Google Generative AI a traves de AI SDK.
- Zod para validacion de datos.

## Requisitos

Antes de ejecutar el proyecto necesitas lo siguiente:

- Node.js 20 o superior.
- pnpm.
- Una base de datos MongoDB.
- Credenciales de Cloudinary.
- Credenciales de Google OAuth para NextAuth.
- Credenciales de Google Generative AI.
- Credenciales de ChromaDB Cloud.
- API key de Cohere.

## Variables de entorno

Crea un archivo `.env.local` en la raiz del proyecto con valores equivalentes a estos:

```env
MONGODB_URI=
NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_GENERATIVE_AI_API_KEY=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CHROMA_API_KEY=
CHROMA_TENANT=
CHROMA_DATABASE=
COHERE_API_KEY=
COLLECTION_NAME=
```

## Levantar el proyecto en local

### 1. Instalar dependencias

```bash
pnpm install
```

### 2. Levantar MongoDB opcionalmente con Docker

El proyecto incluye un `docker-compose.yml` para entorno local con MongoDB y Mongo Express:

```bash
docker compose up -d
```

Servicios disponibles:

- MongoDB en `localhost:27017`
- Mongo Express en `http://localhost:8081`

### 3. Configurar variables de entorno

Completa `.env.local` con tus credenciales reales.

### 4. Ejecutar la app

```bash
pnpm dev
```

La aplicacion quedara disponible en `http://localhost:3000`.

## Scripts disponibles

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
```

## Estructura general

```text
src/
  app/
    api/              # Endpoints para auth, notas, PDF e IA
    dashboard/        # Vistas autenticadas de trabajo
    (Login)/          # Pantallas de acceso y registro
  components/         # Componentes reutilizables y UI
  lib/                # Configuracion de auth, db e integraciones
  model/              # Modelos de Mongoose y acceso a contexto
  service/            # Logica de negocio
  utils/              # Utilidades y helpers
```

## Casos de uso del producto

- Gestionar notas medicas por paciente desde un panel centralizado.
- Consultar rapidamente historial reciente de documentacion.
- Procesar PDFs para enriquecer busquedas o flujos de soporte clinico.
- Preparar una base para asistentes de IA orientados a contexto medico.

## Estado actual

El proyecto ya cuenta con autenticacion, dashboard, CRUD de notas, carga de PDFs y endpoints de IA. Es una base solida para evolucionar hacia una plataforma clinica con mayor trazabilidad, automatizacion documental y soporte inteligente.
