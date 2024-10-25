package microservices

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/nicolas-k-cmd/proj-redes/src/structs"
	"gorm.io/gorm"
)

type ServePaginationResponse struct {
	Object string `json:"object"`
	Total  int    `json:"total"`
}

type PaginationRequest struct {
	Page int
}

type ClosureStruct struct {
	structParser interface{}
	command      *gorm.DB
	operation    string
}

var LIMIT_PAGE int = 10

func SampleClosure(input ClosureStruct, req PaginationRequest) func() (ServePaginationResponse, bool) {
	return func() (ServePaginationResponse, bool) {
		var spr ServePaginationResponse
		spr.Object = ""
		spr.Total = 0
		from := ((req.Page - 1) * LIMIT_PAGE)
		var totalPages int64
		var err error
		err = input.command.Count(&totalPages).Error
		if err != nil {
			return spr, false
		}
		input.command = input.command.Offset(from).Limit(LIMIT_PAGE)
		switch input.operation {
		case "Find":
			err = input.command.Find(&input.structParser).Error
		case "First":
			err = input.command.First(&input.structParser).Error
		case "Last":
			err = input.command.Offset(from).Last(&input.structParser).Error
		}

		if err != nil {
			return spr, false
		} else {
			spr.Total = int(totalPages)
			formattedField, _ := json.Marshal(&input.structParser)
			spr.Object = string(formattedField)
			return spr, true
		}

	}
}

func MicroPagination(w http.ResponseWriter, r *http.Request, input ClosureStruct) (ServePaginationResponse, bool) {
	var req PaginationRequest
	decoder := json.NewDecoder(r.Body)
	defer r.Body.Close()
	if err := decoder.Decode(&req); err != nil {
		fmt.Printf("Error al decodificar JSON en paginacion: %v\n", err)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(structs.Response{Message: "Solicitud JSON Invalida"})
		return ServePaginationResponse{}, false
	}
	spr, err := (SampleClosure(input, req))()
	if !err {
		fmt.Printf("Error al ejecutar la closure")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(structs.Response{Message: "Solicitud JSON Invalida"})
		return ServePaginationResponse{}, false
	}
	return spr, true

}

/*
CLIENTE ENTRA AL ENDPOINT /DRUGS

A nivel servidro, pasar el middleware
el servidor desde el handler del endpoint llama al paginador
el paginador devuelve los resultados,e l handler lo parsea
a json y le devuelve un response al client
*/
