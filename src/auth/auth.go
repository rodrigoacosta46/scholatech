package auth

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/nicolas-k-cmd/proj-redes/src/structs"
)

func RegisterAuthHandler(w http.ResponseWriter, r *http.Request) {
	var req structs.RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("Error al decodficar JSON: %v\n", err)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(structs.Response{Message: "Solicitud JSON Invalida"})
		return
	}

	authService := NewAuthService(w, r)
	response, err := authService.Register(req)
	if err != nil {
		response.Message = err.Error()
	} else {
		w.WriteHeader(http.StatusCreated)
	}
	json.NewEncoder(w).Encode(response)
}

func LoginAuthHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("*****loginAuthHandler running*****")
	var req structs.LoginRequest
	decoder := json.NewDecoder(r.Body)
	defer r.Body.Close()
	if err := decoder.Decode(&req); err != nil {
		log.Printf("Error al decodficar JSON: %v\n", err)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(structs.Response{Message: "Solicitud JSON Invalida"})
		return
	}
	authService := NewAuthService(w, r)
	response, err := authService.Login(req)
	if err != nil {
		response.Message = err.Error()
	}
	json.NewEncoder(w).Encode(response)
}
