package microservices

import (
	"encoding/json"
	"net/http"

	"github.com/nicolas-k-cmd/proj-redes/src/database"
	Middleware "github.com/nicolas-k-cmd/proj-redes/src/middleware"
	"github.com/nicolas-k-cmd/proj-redes/src/structs"
)

type NotificacionWithFlag struct {
	Notificacion database.Notificacion `gorm:"embedded"`
	NewGroupFlag int                   `gorm:"column:isSection"`
}

func ServeNotifications(w http.ResponseWriter, r *http.Request) {
	jwtToken, _ := Middleware.GetCookiePostMiddleware(w, r)
	id, _ := (jwtToken.Claims.GetSubject())
	var notificaciones []NotificacionWithFlag
	spr, boolerr := MicroPagination(w, r, ClosureStruct{
		structParser:    notificaciones,
		command:         database.Db.Model(&database.Notificacion{}).Where("usuario_id = ? AND deleted_at IS NULL", id).Select("notificacions.*, CASE WHEN DATE(notificacions.created_at) = DATE(LAG(notificacions.created_at) OVER (ORDER BY notificacions.created_at DESC)) THEN 0 ELSE 1 END AS isSection").Order("notificacions.created_at DESC"),
		operation:       "Scan",
		requestedBy:     "Notifications",
		SearchableEntry: "",
		AllowLike:       false,
	}, false)
	if !boolerr {
		return
	} else {
		w.WriteHeader(http.StatusOK)
		spr_response, _ := json.Marshal(spr)
		json.NewEncoder(w).Encode(structs.Response{Message: string(spr_response)})
		return
	}
}
