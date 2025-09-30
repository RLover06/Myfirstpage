# 🚀 Marketplace de Servicios - MI CHAMBA

Un marketplace completo para conectar clientes con proveedores de servicios profesionales, construido con Next.js 14, TypeScript, TailwindCSS y Prisma.

## ✨ Características Principales

- **Autenticación completa** con NextAuth.js y roles de usuario (Cliente/Proveedor)
- **Gestión de servicios** con formularios intuitivos y validación
- **Sistema de mensajería** básico entre clientes y proveedores
- **Diseño responsivo** con TailwindCSS
- **Base de datos** con Prisma ORM y PostgreSQL
- **TypeScript** en todo el código para mayor seguridad

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Next.js 14, React 18, TypeScript
- **Estilos**: TailwindCSS
- **Autenticación**: NextAuth.js
- **Base de datos**: Prisma ORM + PostgreSQL
- **Validación**: Zod + React Hook Form
- **Iconos**: Lucide React

## 📁 Estructura del Proyecto

```
MI CHAMBA/
├── app/                    # App Router de Next.js
│   ├── api/               # Endpoints API
│   ├── auth/              # Páginas de autenticación
│   ├── services/           # Páginas de servicios
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página de inicio
├── components/             # Componentes reutilizables
│   ├── cards/             # Tarjetas de servicios
│   ├── forms/              # Formularios
│   ├── layout/             # Navbar, Footer
│   └── ui/                 # Componentes base
├── lib/                    # Utilidades y configuración
│   ├── auth.ts            # Configuración NextAuth
│   ├── prisma.ts          # Cliente Prisma
│   └── utils.ts           # Funciones utilitarias
├── prisma/                 # Esquemas de base de datos
│   └── schema.prisma      # Modelos de datos
├── types/                  # Tipos TypeScript
│   ├── index.ts           # Tipos principales
│   └── next-auth.d.ts     # Tipos NextAuth
└── archivos de configuración
```

## 🚀 Instalación y Configuración

### 1. Instalar dependencias
```bash
cd "MI CHAMBA"
npm install
```

### 2. Configurar variables de entorno
Copia `env.example` a `.env.local` y configura:
```bash
cp env.example .env.local
```

Edita `.env.local`:
```env
# Base de datos
DATABASE_URL="postgresql://username:password@localhost:5432/marketplace_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-clave-secreta-aqui"
```

### 3. Configurar base de datos
```bash
# Generar cliente Prisma
npm run db:generate

# Aplicar migraciones
npm run db:push
```

### 4. Ejecutar en desarrollo
```bash
npm run dev
```

Visita `http://localhost:3000` para ver la aplicación.

## 📋 Funcionalidades Implementadas

### 🔐 Autenticación
- Registro de usuarios (Cliente/Proveedor)
- Login con credenciales
- Protección de rutas
- Gestión de sesiones

### 🛍️ Servicios
- Publicación de servicios por proveedores
- Listado público de servicios
- Filtrado por categoría
- Detalles de servicios
- Gestión de servicios activos/inactivos

### 💬 Mensajería
- Sistema básico de mensajes
- Historial de conversaciones
- Notificaciones de mensajes no leídos

### 👤 Perfiles
- Perfiles de proveedores
- Información de contacto
- Servicios publicados

## 🎨 Diseño y UX

- **Diseño moderno** con gradientes y sombras
- **Responsive** para móviles y desktop
- **Componentes reutilizables** con TailwindCSS
- **Animaciones suaves** y transiciones
- **Iconografía consistente** con Lucide React

## 🔧 Scripts Disponibles

```bash
npm run dev          # Desarrollo
npm run build        # Construcción para producción
npm run start        # Servidor de producción
npm run lint         # Linter
npm run db:push      # Aplicar cambios a BD
npm run db:generate  # Generar cliente Prisma
npm run db:studio    # Interfaz visual de BD
```

## 📚 Conceptos de Aprendizaje

Este proyecto te enseña:

1. **Next.js 14 App Router** - La nueva arquitectura de Next.js
2. **TypeScript** - Tipado estático en React
3. **Prisma ORM** - Gestión de base de datos moderna
4. **NextAuth.js** - Autenticación completa
5. **TailwindCSS** - Estilos utilitarios
6. **React Hook Form** - Manejo de formularios
7. **Zod** - Validación de esquemas
8. **Arquitectura de aplicaciones** - Organización de código

## 🚀 Próximos Pasos

Para expandir el proyecto puedes agregar:

- **Pagos** con Stripe
- **Chat en tiempo real** con Socket.io
- **Notificaciones push**
- **Sistema de reseñas**
- **Dashboard de analytics**
- **API REST completa**
- **Tests unitarios**

## 📞 Soporte

Si tienes preguntas sobre el código o necesitas ayuda:

1. Revisa la documentación de Next.js
2. Consulta los comentarios en el código
3. Explora los tipos TypeScript para entender las estructuras de datos

¡Disfruta construyendo tu marketplace! 🎉

