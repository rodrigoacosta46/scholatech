package microservices

import (
	"encoding/json"
	"fmt"
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
		fmt.Printf("Error al decodificar JSON: %v\n", err)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(structs.Response{Message: "Solicitud JSON Invalida"})
		return
	}

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
		return
	} else {
		w.WriteHeader(http.StatusOK)
		spr_response, _ := json.Marshal(spr)
		json.NewEncoder(w).Encode(structs.Response{Message: string(spr_response)})
		return
	}
}
