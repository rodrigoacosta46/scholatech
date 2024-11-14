package ratelimiter

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/go-chi/httprate"
	"github.com/nicolas-k-cmd/proj-redes/src/structs"
)

func GetRatelimiter(attempts int, timer time.Duration) func(http.Handler) http.Handler {
	return (httprate.Limit(
		attempts,
		timer,
		httprate.WithErrorHandler(func(w http.ResponseWriter, r *http.Request, err error) {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(structs.Response{Message: "Ha ocurrido un fallo en el limitador de solicitudes"})
		}),
		httprate.WithKeyFuncs(httprate.KeyByIP, httprate.KeyByEndpoint),
		httprate.WithResponseHeaders(httprate.ResponseHeaders{
			Limit:      "X-RateLimit-Limit",
			Remaining:  "X-RateLimit-Remaining",
			Reset:      "X-RateLimit-Reset",
			RetryAfter: "Retry-After",
		}),
		httprate.WithLimitHandler(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusTooManyRequests)
			json.NewEncoder(w).Encode(structs.Response{Message: "Has realizado demasiadas solicitudes, intenta mas tarde..."})
		})),
	))
}
