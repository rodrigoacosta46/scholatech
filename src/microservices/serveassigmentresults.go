package microservices

import (
	"encoding/json"
	"net/http"

	"github.com/nicolas-k-cmd/proj-redes/src/database"
	Middleware "github.com/nicolas-k-cmd/proj-redes/src/middleware"
	"github.com/nicolas-k-cmd/proj-redes/src/structs"
)

func ServeAssigmentsResults(w http.ResponseWriter, r *http.Request) {
	jwtToken, _ := Middleware.GetCookiePostMiddleware(w, r)
	id, _ := (jwtToken.Claims.GetSubject())
	var historial []database.Historial
	spr, boolerr := MicroPagination(w, r, ClosureStruct{
		structParser:    historial,
		command:         database.Db.Model(&database.Historial{}).Joins("JOIN turnos ON turnos.id = historials.turno_id").Joins("JOIN users AS doctors ON doctors.id = turnos.doctor_id").Joins("JOIN users AS pacientes ON pacientes.id = turnos.paciente_id").Where("turnos.doctor_id = ? OR turnos.paciente_id = ?", id, id).Preload("Turno.Paciente").Preload("Turno.Doctor").Preload("Recetas").Preload("Recetas.Medicamento").Order("updated_at DESC"),
		operation:       "Find",
		requestedBy:     "Turno",
		SearchableEntry: "",
		AllowLike:       false,
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
