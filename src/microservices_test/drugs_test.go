package microservices

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/nicolas-k-cmd/proj-redes/src/microservices"
)

func FuzzServeDrugs(f *testing.F) {
	f.Add(1, "searchTerm") // Caso inicial
	f.Fuzz(func(t *testing.T, page int, searchTerm string) {
		// Normaliza los valores aleatorios
		if page < 0 {
			page = -page
		}
		if page == 0 {
			page = 1
		}
		search := &searchTerm

		// Crea la estructura de prueba
		reqData := microservices.PaginationRequest{
			Page:   page,
			Search: search,
		}

		// Genera el cuerpo de la solicitud
		reqBody, err := json.Marshal(reqData)
		if err != nil {
			t.Fatalf("Error marshalling request data: %v", err)
		}

		req := httptest.NewRequest(http.MethodGet, "/drugs", bytes.NewBuffer(reqBody))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()

		// Llama a la función bajo prueba
		microservices.ServeDrugs(w, req)

		// Validaciones
		if w.Code != http.StatusOK && w.Code != http.StatusBadRequest {
			t.Errorf("Unexpected status code: %d", w.Code)
		} else {
			t.Logf(w.Body.String())
		}
	})
}

func BenchmarkServeDrugs(b *testing.B) {
	// Configuración de los datos de prueba
	reqData := microservices.PaginationRequest{
		Page: 1,
	}

	// Serializamos los datos
	reqBody, err := json.Marshal(reqData)
	if err != nil {
		b.Fatalf("Error marshalling request data: %v", err)
	}

	// Preparar la solicitud y la respuesta
	req := httptest.NewRequest(http.MethodGet, "/drugs", bytes.NewBuffer(reqBody))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	// Usamos b.RunParallel para ejecutar el benchmark en paralelo
	b.RunParallel(func(pb *testing.PB) {
		for pb.Next() {
			// Llamamos a la función bajo prueba
			microservices.ServeDrugs(w, req)

			// Validamos la respuesta
			if w.Code != http.StatusOK && w.Code != http.StatusBadRequest {
				b.Errorf("Unexpected status code: %d", w.Code)
			}
		}
	})
}
