package microservices

import (
	"encoding/json"
	"net/http"

	"github.com/nicolas-k-cmd/proj-redes/src/database"
	Middleware "github.com/nicolas-k-cmd/proj-redes/src/middleware"
	"github.com/nicolas-k-cmd/proj-redes/src/structs"
	"gorm.io/gorm"
)

func ServeSessionLocalStorage(w http.ResponseWriter, r *http.Request) {
	jwtToken, _ := Middleware.GetCookiePostMiddleware(w, r)
	id, err := (jwtToken.Claims.GetSubject())
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode((structs.Response{Message: "Error al obtener el ID del sujeto", RedirectRoute: "/logout", Authenticated: "false"}))
	}
	var user database.User
	result := database.Db.Omit("password").First(&user, id)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(structs.Response{Message: "No se ha encontrado el usuario", RedirectRoute: "/login", Authenticated: "false"})
			return
		} else {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(structs.Response{Message: "Ha ocurrido un error interno al obtener la informacion del usuario", Fatal: "true"})
			return
		}
	}
	parseable, _ := json.Marshal(user)
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(structs.Response{Message: string(parseable), Authenticated: "true"})

}
