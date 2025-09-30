# 🚀 Guía de Instalación - Marketplace MI CHAMBA

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior)
- **npm** o **yarn**
- **PostgreSQL** (base de datos)
- **Git** (opcional, para control de versiones)

## 🛠️ Pasos de Instalación

### 1. Instalar Dependencias

Abre una terminal en la carpeta `MI CHAMBA` y ejecuta:

```bash
npm install

```

### 2. Configurar Variables de Entorno

Copia el archivo de ejemplo y configura tus variables:

```bash
cp env.example .env.local
```

Edita el archivo `.env.local` con tus datos:

```env
# Base de datos PostgreSQL
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/marketplace_db"

# NextAuth (genera una clave secreta)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-clave-secreta-muy-larga-y-segura"

# Opcional: Proveedores OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

### 3. Configurar Base de Datos

#### Opción A: PostgreSQL Local
1. Instala PostgreSQL en tu sistema
2. Crea una base de datos llamada `marketplace_db`
3. Actualiza la URL en `.env.local`

#### Opción B: PostgreSQL en la Nube (Recomendado)
1. Usa servicios como:
   - **Supabase** (gratis hasta 500MB)
   - **Railway** (gratis con límites)
   - **Neon** (gratis hasta 3GB)
   - **PlanetScale** (gratis hasta 1GB)

2. Copia la URL de conexión y pégala en `DATABASE_URL`

### 4. Generar Cliente Prisma

```bash
npm run db:generate
```

### 5. Crear Tablas en la Base de Datos

```bash
npm run db:push
```

### 6. Ejecutar en Modo Desarrollo

```bash
npm run dev
```

¡Listo! 🎉 Tu marketplace estará disponible en `http://localhost:3000`

## 🔧 Scripts Disponibles

```bash
npm run dev          # Desarrollo (puerto 3000)
npm run build        # Construir para producción
npm run start        # Servidor de producción
npm run lint         # Verificar código
npm run db:push      # Aplicar cambios a BD
npm run db:generate  # Generar cliente Prisma
npm run db:studio    # Interfaz visual de BD
```

## 🧪 Probar la Aplicación

### 1. Crear Usuario Proveedor
1. Ve a `http://localhost:3000/auth/register`
2. Regístrate como "Proveedor"
3. Completa el formulario

### 2. Publicar un Servicio
1. Inicia sesión con tu cuenta de proveedor
2. Ve a "Publicar Servicio"
3. Completa el formulario con:
   - Título: "Desarrollo Web"
   - Descripción: "Creo sitios web modernos"
   - Precio: 25€/hora
   - Categoría: Tecnología
   - Ubicación: Madrid, España

### 3. Crear Usuario Cliente
1. Regístrate como "Cliente"
2. Ve a "Servicios" para ver el servicio publicado
3. Haz clic en "Contactar" para enviar un mensaje

### 4. Probar Mensajería
1. Inicia sesión como proveedor
2. Ve a "Mensajes"
3. Responde al mensaje del cliente

## 🐛 Solución de Problemas

### Error: "Cannot find module '@prisma/client'"
```bash
npm run db:generate
```

### Error: "Database connection failed"
- Verifica que PostgreSQL esté ejecutándose
- Revisa la URL en `.env.local`
- Asegúrate de que la base de datos existe

### Error: "NEXTAUTH_SECRET is not set"
- Genera una clave secreta: `openssl rand -base64 32`
- Agrégala a `.env.local`

### Error: "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📚 Recursos Adicionales

- **Documentación Next.js**: https://nextjs.org/docs
- **Documentación Prisma**: https://www.prisma.io/docs
- **Documentación NextAuth**: https://next-auth.js.org
- **Documentación TailwindCSS**: https://tailwindcss.com/docs

## 🚀 Despliegue en Producción

### Vercel (Recomendado)
1. Conecta tu repositorio GitHub con Vercel
2. Configura las variables de entorno
3. Despliega automáticamente

### Netlify
1. Conecta tu repositorio
2. Configura el build command: `npm run build`
3. Configura las variables de entorno

### Railway/Render
1. Conecta tu repositorio
2. Configura PostgreSQL
3. Despliega automáticamente

## 💡 Consejos para Desarrollo

1. **Usa Prisma Studio** para ver los datos:
   ```bash
   npm run db:studio
   ```

2. **Revisa los logs** en la consola del navegador

3. **Usa TypeScript** - aprovecha el tipado estático

4. **Organiza el código** - sigue la estructura de carpetas

5. **Prueba en diferentes dispositivos** - el diseño es responsive

¡Disfruta construyendo tu marketplace! 🎉







