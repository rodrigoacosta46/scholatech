package microservices

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/nicolas-k-cmd/proj-redes/src/database"
	"github.com/nicolas-k-cmd/proj-redes/src/structs"
)

type RequestFilterUser struct {
	Name      string
	Email     string
	Birthdate string
	Gender    string
	Role      string
	Page      int
}

func ServeUsers(w http.ResponseWriter, r *http.Request) {
	var req RequestFilterUser
	decoder := json.NewDecoder(r.Body)
	defer r.Body.Close()
	if err := decoder.Decode(&req); err != nil {
		log.Printf("Error al decodificar JSON: %v\n", err)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(structs.Response{Message: "Solicitud JSON Invalida"})
		return
	}
	log.Println(req.Birthdate, req.Email, req.Gender, req.Name, req.Page, req.Role)
	qry := database.Db.Model(&database.User{})

	if req.Name != "" {
		qry = qry.Where("username LIKE ?", "%"+req.Name+"%")
	}

	if req.Email != "" {
		qry = qry.Where("email LIKE ?", "%"+req.Email+"%")
	}

	if req.Birthdate != "" {
		birth_date_form := req.Birthdate
		parsedDate, err := time.Parse("2006-01-02", birth_date_form)
		if err == nil {
			qry = qry.Where("birthdate <= ?", parsedDate)
		}
	}

	if req.Gender != "" {
		qry = qry.Where("gender = ?", req.Gender)
	}

	if req.Role != "" {
		if req.Role == "1" || req.Role == "2" {
			qry = qry.Where("perfil_id = ?", req.Role)
		}
	}

	qry.Where("perfil_id != 3")

	var users []database.User
	var pageStruct PaginationRequest
	pageStruct.Page = req.Page

	spr, boolerr := (SampleClosure(ClosureStruct{
		structParser:    users,
		command:         qry.Preload("Perfil"),
		operation:       "Find",
		SearchableEntry: "",
		AllowLike:       false,
	}, pageStruct))()
	if !boolerr {
		log.Println("Error al realizar qry en serveusers")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(structs.Response{Message: "Error al ejecutar consulta"})
		return
	} else {
		spr_response, _ := json.Marshal(spr)
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(structs.Response{Message: string(spr_response)})
		return
	}
}
