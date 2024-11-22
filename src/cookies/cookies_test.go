package cookies

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

// Benchmark paralelo para CreateHandler
func BenchmarkCreateHandlerParallel(b *testing.B) {
	id := 123 // Usuario ficticio

	b.RunParallel(func(pb *testing.PB) {
		// Cada goroutine reutiliza la misma configuración de solicitud
		for pb.Next() {
			req := httptest.NewRequest(http.MethodPost, "/", nil)
			w := httptest.NewRecorder()

			// Ejecuta la función que queremos medir
			CreateHandler(w, req, id)
		}
	})
}

// Benchmark paralelo para DeleteHandler
func BenchmarkDeleteHandlerParallel(b *testing.B) {
	b.RunParallel(func(pb *testing.PB) {
		// Cada goroutine reutiliza la misma configuración de solicitud
		for pb.Next() {
			req := httptest.NewRequest(http.MethodPost, "/", nil)
			w := httptest.NewRecorder()

			// Ejecuta la función que queremos medir
			DeleteHandler(w, req)
		}
	})
}

// Benchmark paralelo para GenerateJWT
func BenchmarkGenerateJWTParallel(b *testing.B) {
	id := 123 // Usuario ficticio

	b.RunParallel(func(pb *testing.PB) {
		// Cada goroutine genera un JWT
		for pb.Next() {
			_, err := GenerateJWT(id)
			if err != nil {
				b.Fatalf("Error generando JWT: %v", err)
			}
		}
	})
}
