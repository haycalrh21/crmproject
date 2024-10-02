import { auth } from "./app/auth";

export default auth((req) => {
  // Jika tidak ada sesi
  if (!req.auth) {
    // Periksa apakah URL yang diminta adalah /dashboard atau dimulai dengan /dashboard/
    if (
      req.nextUrl.pathname === "/dashboard" ||
      req.nextUrl.pathname.startsWith("/dashboard/")
    ) {
      const newUrl = new URL("/login", req.nextUrl.origin);
      return Response.redirect(newUrl); // Redirect ke halaman login
    }
  }
});
