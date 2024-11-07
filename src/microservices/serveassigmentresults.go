package microservices

import (
	"encoding/json"
	"net/http"

	"github.com/nicolas-k-cmd/proj-redes/src/database"
	"github.com/nicolas-k-cmd/proj-redes/src/structs"
)

func ServeAssigmentsResults(w http.ResponseWriter, r *http.Request) {
	var historial []database.Turno
	spr, boolerr := MicroPagination(w, r, ClosureStruct{
		structParser: historial,
		command:      database.Db.Model(&database.Historial{}).Joins("Turno"), //Preload does not work
		operation:    "Find",
		requestedBy:  "Turno",
	}, false)
	if !boolerr {
		return
	} else {
		w.WriteHeader(http.StatusOK)
		spr_response, _ := json.Marshal(spr)
		json.NewEncoder(w).Encode(structs.Response{Message: string(spr_response)})
		return
	}
}
