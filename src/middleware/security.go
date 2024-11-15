package Middleware

import "net/http"

func CspAndSecurityMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		csp := `
			default-src 'self'; 
			script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com; 
			style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com;
			img-src 'self' http://localhost:8000;
			font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com https://cdnjs.cloudflare.com;
			connect-src 'self' http://localhost:8000;
			object-src 'none'; 
			form-action 'self'; 
			upgrade-insecure-requests""
		`
		csp = http.CanonicalHeaderKey(csp)
		w.Header().Set("Content-Security-Policy", csp)
		w.Header().Set("X-Content-Type-Options", "nosniff")
		next.ServeHTTP(w, r)
	})
}
