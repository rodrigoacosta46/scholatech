package main

import (
	"fmt"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	"github.com/nicolas-k-cmd/proj-redes/src/auth"
	"github.com/nicolas-k-cmd/proj-redes/src/cookies"
	"github.com/nicolas-k-cmd/proj-redes/src/microservices"
	Middleware "github.com/nicolas-k-cmd/proj-redes/src/middleware"
)

func main() {
	fmt.Println("Starting service..")
	gorillaRouter()
}

func gorillaRouter() {
	r := mux.NewRouter()
	r.Use(Middleware.EnableCORS)
	r.HandleFunc("/isAuthenticated", Middleware.ValidateJWTHandler)
	r.HandleFunc("/logout", cookies.DeleteHandler)
	guestRoutes := r.NewRoute().Subrouter()
	guestRoutes.Use(Middleware.AntiJwtMiddleware)
	guestRoutes.HandleFunc("/loginauth", auth.LoginAuthHandler)
	guestRoutes.HandleFunc("/registerauth", auth.RegisterAuthHandler)
	guestRoutes.HandleFunc("/testingCreateHandler", func(w http.ResponseWriter, r *http.Request) {
		cookies.CreateHandler(w, r, 1)
	})
	protectedRoutes := r.NewRoute().Subrouter()
	protectedRoutes.Use(Middleware.JwtMiddleware)
	//protectedRoutes.HandleFunc("/logout", cookies.DeleteHandler)
	//	Services
	protectedRoutes.HandleFunc("/sync", microservices.ServeSessionLocalStorage)
	protectedRoutes.HandleFunc("/getDrugs", microservices.ServeDrugs)
	protectedRoutes.HandleFunc("/getImage/{dir}/{id:[0-9]+}/{file}", microservices.ServeImages)
	protectedRoutes.HandleFunc("/saveChanges", microservices.SaveUserConfig)
	protectedRoutes.HandleFunc("/getDoctors", microservices.ServeDoctors)
	protectedRoutes.HandleFunc("/getTurnos/{status}", microservices.ServeAssigments)
	// Admin services
	adminRoutes := protectedRoutes.NewRoute().Subrouter()
	adminRoutes.Use(Middleware.AdminValidation)
	adminRoutes.HandleFunc("/getUsers", microservices.ServeUsers)
	fmt.Println("Database is ready for running")
	http.ListenAndServe("0.0.0.0:8000", r)
}
