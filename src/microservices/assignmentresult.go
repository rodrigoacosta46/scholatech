package microservices

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/nicolas-k-cmd/proj-redes/src/database"
	"github.com/nicolas-k-cmd/proj-redes/src/structs"
)

type AssigmentResultsRequest struct {
	ID          int
	Diagnostico string
	Notas       string
	Drogas      []AssigmentDrogas `json:"Drogas,omitempty"`
	PacienteID  int
}

type AssigmentDrogas struct {
	Drug   string `json:"drug"`
	Amount string `json:"amount"`
	Time   string `json:"time"`
}

func AssigmentResults(w http.ResponseWriter, r *http.Request) {
	var req AssigmentResultsRequest

	if err := requestDecoder(&req, r); err != nil {
		log.Println("Error al decodificar en assigmentresult", err)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(structs.Response{Message: "Solicitud Invalida"})
		return
	}
	if len(req.Diagnostico) > 50 || len(req.Notas) > 500 || len(req.Drogas) > 10 {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(structs.Response{Message: "Solicitud Invalida"})
		return
	}

	tx := database.Db.Begin()

	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
			log.Println("Failed trasaction:", r)
		}
	}()

	updateTurno := tx.Model(&database.Turno{Estado: "closed"}).Where("id = ?", req.ID).Updates(nil)
	if updateTurno.Error != nil {
		tx.Rollback()
		log.Println("Error de consulta en assigmentresult: ", updateTurno.Error)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(structs.Response{Message: "Error al subir diagnóstico"})
		return
	}

	historial := database.Historial{
		TurnoID:     req.ID,
		Diagnostico: req.Diagnostico,
		Notas:       req.Notas,
	}

	res := tx.Model(&database.Historial{}).Where("turno_id = ?", historial.TurnoID).FirstOrCreate(&historial)
	if res.Error != nil || res.RowsAffected == 0 {
		tx.Rollback()
		log.Println("Error de consulta en assigmentresult: ", res.Error)
		log.Println("Turno id: ", historial.TurnoID)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(structs.Response{Message: "Error al subir diagnóstico"})
		return
	}

	if len(req.Drogas) > 0 {
		for i, droga := range req.Drogas {
			log.Println("datos", i, historial.ID, droga.Drug, droga.Amount)

			drugID, err := strconv.Atoi(droga.Drug)
			if err != nil {
				tx.Rollback()
				log.Println("Error de consulta en assigmentresult: ", err)
				w.WriteHeader(http.StatusInternalServerError)
				json.NewEncoder(w).Encode(structs.Response{Message: "Error al subir diagnóstico"})
				return
			}

			amount, err := strconv.ParseFloat(droga.Amount, 32)
			if err != nil {
				tx.Rollback()
				log.Println("Error de consulta en assigmentresult: ", err)
				w.WriteHeader(http.StatusInternalServerError)
				json.NewEncoder(w).Encode(structs.Response{Message: "Error al subir diagnóstico"})
				return
			}

			if err := tx.Create(&database.Receta{HistorialID: historial.ID, MedicamentoID: drugID, Cantidad: float32(amount), Tomas: droga.Time}).Error; err != nil {
				tx.Rollback()
				log.Println("Error de consulta en assigmentresult: ", err)
				w.WriteHeader(http.StatusInternalServerError)
				json.NewEncoder(w).Encode(structs.Response{Message: "Error al subir diagnóstico"})
				return
			}
		}
	}

	notificacion := database.Notificacion{
		UsuarioID: req.PacienteID,
		Title:     "Nuevo diagnóstico",
		Mensaje:   "Se ha realizado un nuevo diagnóstico, puedes ver los detalles del mismo en tu historial de consulta",
		Estado:    "pendiente",
	}

	if err := tx.Create(&notificacion).Error; err != nil {
		tx.Rollback()
		log.Println("Error de consulta en assigmentresult: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(structs.Response{Message: "Error al subir diagnóstico"})
		return
	}

	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		log.Println("Error de consulta en assigmentresult: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(structs.Response{Message: "Error al subir diagnóstico"})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(structs.Response{Message: "Diagnostico subido con éxito"})
}
