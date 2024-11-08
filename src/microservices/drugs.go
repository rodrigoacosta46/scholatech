package microservices

import (
	"encoding/json"
	"net/http"

	"github.com/nicolas-k-cmd/proj-redes/src/database"
	"github.com/nicolas-k-cmd/proj-redes/src/structs"
)

func ServeDrugs(w http.ResponseWriter, r *http.Request) {
	var drugs []database.Medicamento
	spr, boolerr := MicroPagination(w, r, ClosureStruct{
		structParser:    drugs,
		command:         database.Db.Model(&database.Medicamento{}),
		operation:       "Find",
		requestedBy:     "drugs",
		SearchableEntry: "Nombre",
		AllowLike:       true,
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
