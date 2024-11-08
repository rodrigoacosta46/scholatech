package microservices

import (
	"encoding/json"
	"net/http"

	"github.com/nicolas-k-cmd/proj-redes/src/database"
	"github.com/nicolas-k-cmd/proj-redes/src/structs"
)

func ServeDoctors(w http.ResponseWriter, r *http.Request) {

	var doctors []database.User
	spr, boolerr := MicroPagination(w, r, ClosureStruct{
		structParser:    doctors,
		command:         database.Db.Model(&database.User{}).Where("perfil_id = 2"),
		operation:       "Find",
		requestedBy:     "doctors",
		SearchableEntry: "",
		AllowLike:       false,
	}, true)
	if !boolerr {
		return
	} else {
		w.WriteHeader(http.StatusOK)
		spr_response, _ := json.Marshal(spr)
		json.NewEncoder(w).Encode(structs.Response{Message: string(spr_response)})
		return
	}
}
