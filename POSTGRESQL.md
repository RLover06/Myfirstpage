# 🐘 MI CHAMBA - PostgreSQL con Docker

Esta guía te ayudará a ejecutar MI CHAMBA usando PostgreSQL en Docker y la aplicación Next.js localmente.

## 📋 Prerrequisitos

- Docker Desktop instalado y ejecutándose
- Node.js 18+ instalado
- npm o yarn instalado

## 🚀 Inicio Rápido

### 1. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
DATABASE_URL="postgresql://marketplace_user:marketplace_password@localhost:5432/marketplace_db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dev-secret-key-change-in-production"
NODE_ENV="development"
```

### 2. Ejecutar Desarrollo

#### Opción A: Script Automático (Recomendado)
```bash
npm run dev:docker
```

#### Opción B: Manual
```bash
# Iniciar PostgreSQL
npm run db:start

# En otra terminal, iniciar la aplicación
npm run dev
```

## 🛠️ Comandos Disponibles

### Scripts de Base de Datos
```bash
npm run db:start      # Iniciar PostgreSQL en Docker
npm run db:stop       # Detener PostgreSQL
npm run db:logs       # Ver logs de PostgreSQL
npm run db:migrate    # Ejecutar migraciones
npm run db:generate   # Generar cliente Prisma
npm run db:studio     # Abrir Prisma Studio
npm run db:seed       # Ejecutar seed de datos
```

### Scripts de Desarrollo
```bash
npm run dev           # Desarrollo local
npm run dev:docker   # Desarrollo con PostgreSQL en Docker
npm run build         # Construir para producción
npm run start         # Ejecutar en producción
```

## 🏗️ Arquitectura

### Servicios

- **PostgreSQL** (puerto 5432) - Base de datos en Docker
- **Next.js App** (puerto 3000) - Aplicación local

### Configuración de Base de Datos

- **Host**: localhost
- **Puerto**: 5432
- **Base de datos**: marketplace_db
- **Usuario**: marketplace_user
- **Contraseña**: marketplace_password

## 🔧 Configuración

### Variables de Entorno Requeridas

```env
DATABASE_URL="postgresql://marketplace_user:marketplace_password@localhost:5432/marketplace_db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-clave-secreta-aqui"
```

### Conexión a la Base de Datos

Puedes conectarte directamente a PostgreSQL usando:

```bash
# Desde Docker
docker exec -it mi-chamba-postgres psql -U marketplace_user -d marketplace_db

# Desde tu aplicación local
npm run db:studio
```

## 🐛 Solución de Problemas

### Problema: Puerto 5432 ya en uso
```bash
# Verificar qué está usando el puerto
netstat -ano | findstr :5432

# Detener PostgreSQL
npm run db:stop
```

### Problema: Base de datos no conecta
```bash
# Verificar logs
npm run db:logs

# Reiniciar PostgreSQL
npm run db:stop
npm run db:start
```

### Problema: Migraciones fallan
```bash
# Resetear base de datos
npm run db:stop
docker volume rm mi-chamba_postgres_data
npm run db:start
npm run db:migrate
```

## 📊 Monitoreo

### Ver estado de PostgreSQL
```bash
docker ps | grep postgres
```

### Ver logs en tiempo real
```bash
npm run db:logs
```

### Acceder a la base de datos
```bash
docker exec -it mi-chamba-postgres psql -U marketplace_user -d marketplace_db
```

## 🔄 Flujo de Desarrollo

1. **Iniciar PostgreSQL**: `npm run db:start`
2. **Ejecutar migraciones**: `npm run db:migrate`
3. **Iniciar aplicación**: `npm run dev`
4. **Desarrollar**: Hacer cambios en el código
5. **Ver cambios**: La aplicación se recarga automáticamente

## 🧹 Limpieza

### Detener servicios
```bash
npm run db:stop
```

### Limpiar datos de PostgreSQL
```bash
npm run db:stop
docker volume rm mi-chamba_postgres_data
```

## 💡 Ventajas de esta Configuración

- ✅ **Desarrollo rápido** - Hot reload de Next.js
- ✅ **Base de datos consistente** - PostgreSQL en Docker
- ✅ **Fácil de usar** - Un comando para todo
- ✅ **Datos persistentes** - Los datos se mantienen entre reinicios
- ✅ **Sin complejidad** - Solo PostgreSQL, sin Redis

¡Disfruta desarrollando con MI CHAMBA! 🎉
