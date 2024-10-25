package microservices

import (
	"encoding/json"
	"net/http"

	"github.com/nicolas-k-cmd/proj-redes/src/database"
	"github.com/nicolas-k-cmd/proj-redes/src/enum"
	Middleware "github.com/nicolas-k-cmd/proj-redes/src/middleware"
	"github.com/nicolas-k-cmd/proj-redes/src/structs"
	"gorm.io/gorm"
)

/*
Once authentication middleware are passed.
This function will retrieve from the database the information about the user and send it to the frontend
This is useful for the React Hooks.
The frontend must know information about the user for displaying purposes.
*/

func ServeSessionLocalStorage(w http.ResponseWriter, r *http.Request) {
	jwtToken, _ := Middleware.GetCookiePostMiddleware(w, r)
	id, err := (jwtToken.Claims.GetSubject())
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode((structs.Response{Message: "Error al obtener el ID del sujeto", RedirectRoute: enum.URLs["logout"].Which(r), Authenticated: "false"}))
	}
	var user database.User
	result := database.Db.Omit("Password").Preload("Perfil").First(&user, id)
	/*result := database.Db.
	Preload("Rol.Perfil").
	Omit("Password").
	First(&user, id)*/
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(structs.Response{Message: "No se ha encontrado el usuario", RedirectRoute: enum.URLs["login"].Which(r), Authenticated: "false"})
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
