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

type NotificationRequest struct {
	ID int
}

func UpdateNotification(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	switch vars["action"] {
	case "read":
		if err := markAsRead(r); err != nil {
			log.Printf("Error al actualizar la notificación: %v\n", err)
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(structs.Response{Message: "Error al actualizar la notificación"})
			return
		}
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(structs.Response{Message: "Notificacion actualizada con éxito"})
	case "delete":
		if err := deleteNotification(r); err != nil {
			log.Printf("Error al actualizar la notificación: %v\n", err)
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(structs.Response{Message: "Error al actualizar la notificación"})
			return
		}
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(structs.Response{Message: "Notificación borrada con éxito"})
	default:
		log.Println("La variable no es válida")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(structs.Response{Message: "Solicitud GET Invalida"})
		return
	}
}

func markAsRead(r *http.Request) error {
	var req NotificationRequest
	if err := requestDecoder(&req, r); err != nil {
		return err
	}
	log.Println(req.ID)
	if err := database.Db.Model(&database.Notificacion{Estado: "leido"}).Where("id = ?", req.ID).Updates(nil).Error; err != nil {
		return err
	}

	return nil
}

func deleteNotification(r *http.Request) error {
	var req NotificationRequest
	if err := requestDecoder(&req, r); err != nil {
		return err
	}

	now := time.Now().UTC()
	if err := database.Db.Model(&database.Notificacion{Estado: "eliminado", DeletedAt: &now}).Where("id = ?", req.ID).Updates(nil).Error; err != nil {
		return err
	}

	return nil
}
