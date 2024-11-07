package microservices

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/nicolas-k-cmd/proj-redes/src/database"
	"github.com/nicolas-k-cmd/proj-redes/src/enum"
	Middleware "github.com/nicolas-k-cmd/proj-redes/src/middleware"
	"github.com/nicolas-k-cmd/proj-redes/src/structs"
)

type RequestAssignDoctor struct {
	DoctorID int
	Motivo   string
	Detalles string
}

func AssignDoctor(w http.ResponseWriter, r *http.Request) {
	var req RequestAssignDoctor
	deco := json.NewDecoder(r.Body)
	defer r.Body.Close()
	if err := deco.Decode(&req); err != nil {
		fmt.Printf("Error al decodificar JSON en assigndoctor: %v\n", err)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(structs.Response{Message: "Solicitud JSON Invalida"})
		return
	}

	if len(req.Motivo) > 30 || len(req.Detalles) > 250 {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode((structs.Response{Message: "Error al guardar asignación"}))
		return
	}

	jwtToken, _ := Middleware.GetCookiePostMiddleware(w, r)
	id, err := (jwtToken.Claims.GetSubject())
	if err != nil {
		fmt.Printf("Error al obtener el jwt del usuario: %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode((structs.Response{Message: "Error al obtener el ID del sujeto"}))
		return
	}

	var usId int
	if usId, err = strconv.Atoi(id); err != nil {
		fmt.Printf("Error de parseo en userconfig: %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(structs.Response{Message: "Error al guardar asignacion"})
		return
	}

	res := database.Db.Where(&database.Turno{DoctorID: req.DoctorID, PacienteID: usId, Estado: "pending"}).Find(&database.Turno{})
	if res.Error != nil {
		fmt.Printf("Error en assigndoctor")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(structs.Response{Message: "Error al guardar asignacion"})
		return
	} else if res.RowsAffected > 0 {
		fmt.Printf("Doctor ya consultado")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(structs.Response{Message: "Ya realizaste un pedido de consulta a este especialista"})
		return
	}

	tx := database.Db.Begin()

	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
			fmt.Println("Failed trasaction:", r)
		}
	}()

	turno := database.Turno{
		DoctorID:   req.DoctorID,
		PacienteID: usId,
		Motivo:     req.Motivo,
		Notas:      req.Detalles,
		Estado:     "pending",
	}

	notificacion := database.Notificacion{
		UsuarioID: usId,
		Title:     "Asignación exitosa",
		Mensaje:   "Asignación de doctor exitosa, ahora espera a que el doctor confirme el turno",
		Estado:    "pendiente",
	}

	if err := tx.Create(&turno).Error; err != nil {
		tx.Rollback()
		fmt.Println("Failed to create turno:", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(structs.Response{Message: "Error al guardar asignacion"})
		return
	}

	if err := tx.Create(&notificacion).Error; err != nil {
		tx.Rollback()
		fmt.Println("Failed to create notification:", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(structs.Response{Message: "Error al guardar asignacion"})
		return
	}

	if err := tx.Commit().Error; err != nil {
		fmt.Println("Failed to commit transaction:", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(structs.Response{Message: "Error al guardar asignacion"})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(structs.Response{
		Message:       string("La cuenta ha sido registrada con exito"),
		RedirectRoute: enum.URLs["story"].Which(r),
	})
}
