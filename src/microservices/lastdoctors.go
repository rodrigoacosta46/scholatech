package microservices

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/nicolas-k-cmd/proj-redes/src/database"
	Middleware "github.com/nicolas-k-cmd/proj-redes/src/middleware"
	"github.com/nicolas-k-cmd/proj-redes/src/structs"
)

func LastDoctor(w http.ResponseWriter, r *http.Request) {
	jwtToken, _ := Middleware.GetCookiePostMiddleware(w, r)
	id, err := (jwtToken.Claims.GetSubject())
	log.Println("QUE", id)
	if err != nil {
		log.Printf("Error al obtener el jwt del usuario: %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode((structs.Response{Message: "Error al obtener el ID del sujeto"}))
		return
	}
	var doctors []database.User
	spr, boolerr := MicroPagination(w, r, ClosureStruct{
		structParser: doctors,
		command: database.Db.Model(&database.User{}).
			Joins("JOIN turnos ON turnos.doctor_id = users.id").
			Where("users.perfil_id = ?", 2).
			Where("turnos.paciente_id = ?", id).
			Where("turnos.estado = ?", "closed"),
		operation:       "Find",
		requestedBy:     "lastdoctors",
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
