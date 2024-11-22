package microservices

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/nicolas-k-cmd/proj-redes/src/database"
	Middleware "github.com/nicolas-k-cmd/proj-redes/src/middleware"
	"github.com/nicolas-k-cmd/proj-redes/src/structs"
	"gorm.io/gorm"
)

func ServeAssigments(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	switch vars["status"] {
	case "accepted", "rejected", "pending":
		log.Println("El valor GET es valido")
	default:
		log.Println("La variable no es válida")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(structs.Response{Message: "Solicitud GET Invalida"})
		return
	}

	jwtToken, _ := Middleware.GetCookiePostMiddleware(w, r)
	id, _ := (jwtToken.Claims.GetSubject())
	var turnos []database.Turno
	spr, boolerr := MicroPagination(w, r, ClosureStruct{
		structParser: turnos,
		//command:         database.Db.Model(&database.Turno{}).Where("paciente_id = ? OR doctor_id = ?", id, id).Where("estado = ?", vars["status"]).Where("deleted_at IS NULL AND estado != 'closed'").Order("updated_at DESC").Preload("Doctor").Preload("Paciente"),
		command: database.Db.Model(&database.Turno{}).
			Where("paciente_id = ? OR doctor_id = ?", id, id).
			Where("estado = ?", vars["status"]).
			Where("deleted_at IS NULL AND estado != 'closed'").
			Order("updated_at DESC").
			Preload("Doctor", func(db *gorm.DB) *gorm.DB {
				return db.Select("id, username, email, description, telephone, address, speciality, gender, birthdate, created_at, updated_at, perfil_id")
			}).
			Preload("Paciente", func(db *gorm.DB) *gorm.DB {
				return db.Select("id, username, email, description, telephone, address, speciality, gender, birthdate, created_at, updated_at, perfil_id")
			}),
		operation:       "Find",
		requestedBy:     "assigments",
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
