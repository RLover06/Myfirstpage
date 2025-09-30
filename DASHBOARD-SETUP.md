# 🚀 Configuración del Dashboard MI CHAMBA

## 📋 Resumen de Implementación

He implementado un sistema completo de dashboard privado que mantiene tu landing page intacta. El sistema incluye:

### ✅ Características Implementadas

1. **Dashboard Privado** (`/dashboard`)
   - Layout con sidebar y header responsivo
   - Navegación con menú lateral
   - Header con perfil de usuario y botón de cerrar sesión
   - Área de contenido dinámico

2. **Sistema de Autenticación Dual**
   - NextAuth (existente) + Supabase Auth (nuevo)
   - Páginas de login y registro actualizadas
   - Middleware para protección de rutas

3. **Rutas Protegidas**
   - `/dashboard/*` - Requiere autenticación
   - Redirección automática a `/login` si no está autenticado
   - Redirección a `/dashboard` si ya está autenticado

4. **Componentes del Dashboard**
   - `DashboardLayout` - Layout principal con sidebar
   - `DashboardStats` - Estadísticas del usuario
   - `RecentActivity` - Actividad reciente
   - Página principal del dashboard

## 🔧 Configuración Requerida

### 1. Variables de Entorno

Crea un archivo `.env.local` con las siguientes variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio_supabase

# NextAuth Configuration (mantener existente)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu_secreto_nextauth

# Database Configuration (si usas Prisma)
DATABASE_URL=tu_url_de_base_de_datos
```

### 2. Configuración de Supabase

1. **Crear proyecto en Supabase:**
   - Ve a [supabase.com](https://supabase.com)
   - Crea un nuevo proyecto
   - Obtén la URL y las claves de API

2. **Configurar tabla de perfiles:**
   ```sql
   -- Crear tabla de perfiles
   CREATE TABLE profiles (
     id UUID REFERENCES auth.users(id) PRIMARY KEY,
     name TEXT,
     email TEXT,
     user_type TEXT DEFAULT 'CLIENT',
     avatar_url TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Habilitar RLS (Row Level Security)
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

   -- Política para que los usuarios solo vean su propio perfil
   CREATE POLICY "Users can view own profile" ON profiles
     FOR SELECT USING (auth.uid() = id);

   CREATE POLICY "Users can update own profile" ON profiles
     FOR UPDATE USING (auth.uid() = id);

   CREATE POLICY "Users can insert own profile" ON profiles
     FOR INSERT WITH CHECK (auth.uid() = id);
   ```

3. **Configurar función de trigger para crear perfil:**
   ```sql
   -- Función para crear perfil automáticamente
   CREATE OR REPLACE FUNCTION public.handle_new_user()
   RETURNS TRIGGER AS $$
   BEGIN
     INSERT INTO public.profiles (id, name, email, user_type)
     VALUES (
       NEW.id,
       NEW.raw_user_meta_data->>'name',
       NEW.email,
       COALESCE(NEW.raw_user_meta_data->>'user_type', 'CLIENT')
     );
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;

   -- Trigger para ejecutar la función
   CREATE TRIGGER on_auth_user_created
     AFTER INSERT ON auth.users
     FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
   ```

### 3. Middleware de Protección

El sistema usa dos middlewares:

1. **`middleware.ts`** - Para NextAuth (existente)
2. **`middleware-supabase.ts`** - Para Supabase (nuevo)

Para usar Supabase, renombra los archivos:
```bash
mv middleware.ts middleware-nextauth.ts
mv middleware-supabase.ts middleware.ts
```

## 🎨 Estructura de Archivos Creados

```
MI-CHAMBA/
├── app/
│   ├── dashboard/
│   │   ├── layout.tsx          # Layout del dashboard
│   │   └── page.tsx            # Página principal del dashboard
│   └── auth/
│       ├── login/page.tsx      # Login con Supabase
│       └── register/page.tsx   # Registro con Supabase
├── components/
│   ├── auth/
│   │   └── SupabaseAuthProvider.tsx  # Provider de autenticación
│   └── dashboard/
│       ├── DashboardLayout.tsx       # Layout principal
│       ├── DashboardStats.tsx        # Estadísticas
│       └── RecentActivity.tsx        # Actividad reciente
├── lib/
│   ├── supabase.ts             # Cliente de Supabase
│   ├── supabase-client.ts     # Cliente del navegador
│   ├── supabase-server.ts     # Cliente del servidor
│   └── hooks/
│       └── useSupabaseAuth.ts # Hook personalizado
├── middleware.ts              # Middleware de protección
└── env.supabase.example      # Variables de entorno de ejemplo
```

## 🚀 Cómo Usar

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Configurar Variables de Entorno
Copia `env.supabase.example` a `.env.local` y completa las variables.

### 3. Ejecutar el Proyecto
```bash
npm run dev
```

### 4. Acceder al Dashboard
- Ve a `http://localhost:3000` (landing page)
- Haz clic en "Registrarse" o "Iniciar Sesión"
- Después del login, serás redirigido a `/dashboard`

## 🔄 Flujo de Navegación

1. **Usuario no autenticado:**
   - `/` → Landing page (tu HTML actual)
   - `/dashboard` → Redirige a `/auth/login`

2. **Usuario autenticado:**
   - `/` → Landing page con navegación actualizada
   - `/dashboard` → Dashboard privado
   - `/auth/login` → Redirige a `/dashboard`

## 🎯 Próximos Pasos

1. **Configurar Supabase** con las variables de entorno
2. **Crear la tabla de perfiles** en Supabase
3. **Probar el flujo de autenticación**
4. **Personalizar el dashboard** según tus necesidades
5. **Agregar más páginas** al dashboard (servicios, reservas, etc.)

## 🛠️ Personalización

### Cambiar Colores
Los colores están definidos en `tailwind.config.js`:
```javascript
colors: {
  primary: {
    // Tus colores personalizados
  }
}
```

### Agregar Nuevas Páginas al Dashboard
1. Crea la página en `app/dashboard/[nombre]/page.tsx`
2. Agrega el enlace en `components/dashboard/DashboardLayout.tsx`

### Modificar el Sidebar
Edita el array `navigation` en `DashboardLayout.tsx`:
```typescript
const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  // Agrega más elementos aquí
]
```

## 📞 Soporte

Si tienes problemas con la configuración:

1. **Verifica las variables de entorno**
2. **Revisa la consola del navegador** para errores
3. **Comprueba la configuración de Supabase**
4. **Asegúrate de que las tablas estén creadas correctamente**

¡El dashboard está listo para usar! 🎉

