package microservices

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/nicolas-k-cmd/proj-redes/src/database"
	"github.com/nicolas-k-cmd/proj-redes/src/structs"
)

type PaginationRequest struct {
	Page int
}

type ResponseFormat struct {
	Drugs string `json:"drugs"`
	Total int    `json:"total"`
}

func ServeDrugs(w http.ResponseWriter, r *http.Request) {
	var req PaginationRequest
	decoder := json.NewDecoder(r.Body)
	defer r.Body.Close()
	if err := decoder.Decode(&req); err != nil {
		fmt.Printf("Error al decodificar JSON en drogas: %v\n", err)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(structs.Response{Message: "Solicitud JSON Invalida"})
		return
	}

	var totalPages int64
	if err := database.Db.Model(&database.Medicamento{}).Count(&totalPages).Error; err != nil {
		fmt.Printf("Error al parsear en drogas: %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode((structs.Response{Message: "Error de paginación"}))
		return
	}

	page := req.Page
	if page > int(totalPages) || page < 1 {
		fmt.Printf("Error al parsear en drogas2, la venganza:")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode((structs.Response{Message: "Error de paginación"}))
		return
	}

	pageSize := 10
	from := (page - 1) * pageSize
	var drugs []database.Medicamento
	if err := database.Db.Offset(from).Limit(pageSize).Find(&drugs).Error; err != nil {
		fmt.Printf("Error de consulta en drogas: %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode((structs.Response{Message: "Error de paginación"}))
	}
	var res ResponseFormat
	formattedField, _ := json.Marshal(drugs)
	res.Drugs = string(formattedField)
	res.Total = int(totalPages)
	parseable, _ := json.Marshal(res)
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(structs.Response{Message: string(parseable)})
}
