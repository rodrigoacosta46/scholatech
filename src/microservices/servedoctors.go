package microservices

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/nicolas-k-cmd/proj-redes/src/database"
	"github.com/nicolas-k-cmd/proj-redes/src/structs"
)

type RequestFilterDoctors struct {
	Username   string
	Gender     string
	Speciality string
	Page       int
}

func ServeDoctors(w http.ResponseWriter, r *http.Request) {
	var req RequestFilterDoctors
	decoder := json.NewDecoder(r.Body)
	defer r.Body.Close()
	if err := decoder.Decode(&req); err != nil {
		fmt.Printf("Error al decodificar JSON: %v\n", err)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(structs.Response{Message: "Solicitud JSON Invalida"})
		return
	}
	fmt.Println("acá está", req.Username, req.Gender, req.Speciality, req.Page)
	qry := database.Db.Model(&database.User{})

	if req.Username != "" {
		qry = qry.Where("username LIKE ?", "%"+req.Username+"%")
	}

	if req.Speciality != "" {
		qry = qry.Where("speciality = ?", req.Speciality)
	}

	if req.Gender != "" {
		if req.Gender == "male" || req.Gender == "female" {
			qry = qry.Where("gender = ?", req.Gender)
		}
	}

	var doctors []database.User
	var pageStruct PaginationRequest
	pageStruct.Page = req.Page

	spr, boolerr := (SampleClosure(ClosureStruct{
		structParser:    doctors,
		command:         qry.Preload("Perfil").Where("perfil_id = 2"),
		operation:       "Find",
		requestedBy:     "doctors",
		SearchableEntry: "",
		AllowLike:       false,
	}, pageStruct))()
	if !boolerr {
		fmt.Println("Error al realizar qry en servedoctors")
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
