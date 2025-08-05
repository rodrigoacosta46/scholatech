package microservices

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"github.com/nicolas-k-cmd/proj-redes/src/database"
	"github.com/nicolas-k-cmd/proj-redes/src/structs"
)

type AcceptAssigmentRequest struct {
	ID         int
	Fecha      string
	PacienteID int
}

type RejectAssigmentRequest struct {
	ID         int
	PacienteID int
}

func UpdateAssigment(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	switch vars["action"] {
	case "accept":
		if err := acceptAssigment(r); err != nil {
			log.Printf("Error al actualizar la asignación: %v\n", err)
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(structs.Response{Message: "Error al actualizar la asignación"})
			return
		}
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(structs.Response{Message: "Asignación actualizada con éxito"})
	case "cancel":
		if err := cancelAssigment(r); err != nil {
			log.Printf("Error al actualizar la asignación: %v\n", err)
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(structs.Response{Message: "Error al actualizar la asignación"})
			return
		}
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(structs.Response{Message: "Asignación actualizada con éxito"})
	default:
		log.Println("La variable no es válida")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(structs.Response{Message: "Solicitud GET Invalida"})
		return
	}
}

func requestDecoder(req interface{}, r *http.Request) error {
	deco := json.NewDecoder(r.Body)
	defer r.Body.Close()
	if err := deco.Decode(&req); err != nil {
		return err
	}
	return nil
}

func doctorTransaction(turnoID int, update database.Turno, notificacion database.Notificacion) error {
	tx := database.Db.Begin()

	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
			log.Println("Failed trasaction:", r)
		}
	}()

	updateTurno := tx.Model(&update).Where("id = ?", turnoID).Updates(update)
	if updateTurno.Error != nil {
		tx.Rollback()
		return updateTurno.Error
	}

	if err := tx.Create(&notificacion).Error; err != nil {
		tx.Rollback()
		return err
	}

	if err := tx.Commit().Error; err != nil {
		return err
	}

	return nil
}

func acceptAssigment(r *http.Request) error {
	var req AcceptAssigmentRequest
	if err := requestDecoder(&req, r); err != nil {
		return err
	}

	parsedDateTime, err := time.Parse(time.RFC3339, req.Fecha)
	dateFlag := time.Now().UTC()
	if err != nil || dateFlag.After(parsedDateTime) || dateFlag.AddDate(1, 0, 0).Before(parsedDateTime) {
		return err
	}

	params := database.Turno{Fecha: &parsedDateTime, Estado: "accepted"}

	notificacion := database.Notificacion{
		UsuarioID: req.PacienteID,
		Title:     "Consulta aceptada",
		Mensaje:   "El doctor ha aceptado tu consulta, ve tu historial de consultas para más información",
		Estado:    "pendiente",
	}

	if err := doctorTransaction(req.ID, params, notificacion); err != nil {
		return err
	}

	return nil
}

func cancelAssigment(r *http.Request) error {
	var req RejectAssigmentRequest
	if err := requestDecoder(&req, r); err != nil {
		return err
	}

	dateformat := time.Now().UTC()
	params := database.Turno{DeletedAt: &dateformat, Estado: "closed"}

	notificacion := database.Notificacion{
		UsuarioID: req.PacienteID,
		Title:     "Tu consulta fue descartada",
		Mensaje:   "El doctor ha descartado tu consulta, para más información podes ir a tu historial de consulta",
		Estado:    "pendiente",
	}

	if err := doctorTransaction(req.ID, params, notificacion); err != nil {
		return err
	}

	return nil
}
