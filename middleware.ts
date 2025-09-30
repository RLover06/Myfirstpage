import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Aquí puedes agregar lógica adicional si es necesario
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Proteger todas las rutas que empiecen con /dashboard
        if (req.nextUrl.pathname.startsWith('/dashboard')) {
          return !!token
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
  ]
}

