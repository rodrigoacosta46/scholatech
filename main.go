package main

import (
	"fmt"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"

	"github.com/nicolas-k-cmd/proj-redes/src/auth"
	"github.com/nicolas-k-cmd/proj-redes/src/cookies"
	"github.com/nicolas-k-cmd/proj-redes/src/database"
	Middleware "github.com/nicolas-k-cmd/proj-redes/src/middleware"
)

func main() {
	fmt.Println("Starting service..")
	database.Database()
	gorillaRouter()
}

func gorillaRouter() {
	r := mux.NewRouter()
	r.Use(Middleware.EnableCORS)
	r.HandleFunc("/isAuthenticated", Middleware.ValidateJWTHandler)
	guestRoutes := r.NewRoute().Subrouter()
	guestRoutes.Use(Middleware.AntiJwtMiddleware)
	guestRoutes.HandleFunc("/loginauth", auth.LoginAuthHandler)
	guestRoutes.HandleFunc("/registerauth", auth.RegisterAuthHandler)
	guestRoutes.HandleFunc("/testingCreateHandler", func(w http.ResponseWriter, r *http.Request) {
		cookies.CreateHandler(w, r, "testinguser")
	})
	protectedRoutes := r.NewRoute().Subrouter()
	protectedRoutes.Use(Middleware.JwtMiddleware)
	protectedRoutes.HandleFunc("/logout", cookies.DeleteHandler)
	fmt.Println("Database is ready for running")
	http.ListenAndServe(":8000", r)

}
