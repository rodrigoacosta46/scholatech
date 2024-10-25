package microservices

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/nicolas-k-cmd/proj-redes/src/database"
	Middleware "github.com/nicolas-k-cmd/proj-redes/src/middleware"
	"github.com/nicolas-k-cmd/proj-redes/src/structs"
)

func ServeAssigments(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	switch vars["status"] {
	case "accepted", "rejected", "pending":
		fmt.Println("El valor GET es valido")
	default:
		fmt.Println("La variable no es válida")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(structs.Response{Message: "Solicitud GET Invalida"})
		return
	}
	jwtToken, _ := Middleware.GetCookiePostMiddleware(w, r)
	id, _ := (jwtToken.Claims.GetSubject())
	var turnos []database.Turno
	spr, boolerr := MicroPagination(w, r, ClosureStruct{
		structParser: turnos,
		command:      database.Db.Model(&database.Turno{}).Where("doctor_id = ? AND estado = ?", id, vars["status"]),
		operation:    "Find",
	})
	if !boolerr {
		return
	} else {
		w.WriteHeader(http.StatusOK)
		spr_response, _ := json.Marshal(spr)
		json.NewEncoder(w).Encode(structs.Response{Message: string(spr_response)})
		return
	}
}
