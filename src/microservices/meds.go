package microservices

import (
	"net/http"

	"github.com/nicolas-k-cmd/proj-redes/src/database"
)

func ServeMeds(w http.ResponseWriter, r *http.Request) {
	Db := database.Db

}