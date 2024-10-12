package microservices

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/nicolas-k-cmd/proj-redes/src/database"
	"github.com/nicolas-k-cmd/proj-redes/src/structs"
)

func ServeImages(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	reqDir := "img/" + vars["dir"] + "/" + vars["id"]

	var returnPath string

	if _, err := os.Stat(reqDir); os.IsNotExist(err) {
		if vars["dir"] == "profiles" {
			var gender = database.User{}
			if err := database.Db.Select("gender").First(&gender, "id = ?", vars["id"]).Error; err == nil {
				returnPath = "img/profiles/default/" + gender.Gender + ".png"
			} else {
				fmt.Printf("Error de consulta en serveimage: %v\n", err)
				w.WriteHeader(http.StatusInternalServerError)
				json.NewEncoder(w).Encode(structs.Response{Message: "Error al localizar imagen XD " + reqDir + "/" + vars["file"]})
				return
			}
		} else {
			fmt.Printf("Error en la request de directorio de imagen: %v\n", err)
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(structs.Response{Message: "Error al localizar imagen"})
			return
		}
	} else {
		returnPath = reqDir + "/" + vars["file"] + ".png"
	}

	img, err := os.Open(returnPath)
	if err != nil {
		fmt.Printf("Error al abrir imagen en serveimage: %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(structs.Response{Message: "Error al localizar imagen"})
		return
	}
	defer img.Close()

	w.Header().Set("Content-Type", "image/png")
	io.Copy(w, img)
}
