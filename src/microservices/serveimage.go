package microservices

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/nicolas-k-cmd/proj-redes/src/structs"
)

type ImageRequest struct {
	Path string
}

func ServeImages(w http.ResponseWriter, r *http.Request) {
	var req ImageRequest
	deco := json.NewDecoder(r.Body)
	if err := deco.Decode(&req); err != nil {
		fmt.Printf("Error al decodificar JSON en getimage: %v\n", err)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(structs.Response{Message: "Solicitud JSON Invalida"})
		return
	}

	img, err := os.Open(req.Path)
	if err != nil {
		fmt.Printf("Error al decodificar JSON en getimage: %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(structs.Response{Message: "Error al localizar imagen"})
		return
	}
	defer img.Close()

	w.Header().Set("Content-Type", "image/png")
	io.Copy(w, img)
}
