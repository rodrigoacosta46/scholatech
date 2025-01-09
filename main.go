package main

import (
	"log"
	"net/http"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	"github.com/nicolas-k-cmd/proj-redes/src/auth"
	"github.com/nicolas-k-cmd/proj-redes/src/cookies"
	"github.com/nicolas-k-cmd/proj-redes/src/env"
	"github.com/nicolas-k-cmd/proj-redes/src/microservices"
	Middleware "github.com/nicolas-k-cmd/proj-redes/src/middleware"
	"github.com/nicolas-k-cmd/proj-redes/src/ratelimiter"
)

func main() {
	log.Println("Starting service..")
	gorillaRouter()
}

func gorillaRouter() {
	r := mux.NewRouter()
	r.Use(Middleware.EnableCORS)
	r.Use(Middleware.CspAndSecurityMiddleware)
	r.HandleFunc("/isAuthenticated", Middleware.ValidateJWTHandler)
	r.HandleFunc("/logout", cookies.DeleteHandler)
	guestRoutes := r.NewRoute().Subrouter()
	guestRoutes.Use(Middleware.AntiJwtMiddleware)
	guestRoutes.Use(ratelimiter.GetRatelimiter(env.RATELIMITER_GUEST, time.Minute))
	guestRoutes.HandleFunc("/loginauth", auth.LoginAuthHandler)
	guestRoutes.HandleFunc("/registerauth", auth.RegisterAuthHandler)
	guestRoutes.HandleFunc("/testingCreateHandler", func(w http.ResponseWriter, r *http.Request) {
		cookies.CreateHandler(w, r, 1)
	})
	guestRoutes.HandleFunc("/testingCreateHandlerpatient", func(w http.ResponseWriter, r *http.Request) {
		cookies.CreateHandler(w, r, 205)
	})
	protectedRoutes := r.NewRoute().Subrouter()
	protectedRoutes.Use(Middleware.JwtMiddleware)
	protectedRoutes.Use(ratelimiter.GetRatelimiter(env.RATELIMITER_PROTECTED, time.Minute))
	//protectedRoutes.HandleFunc("/logout", cookiesx.DeleteHandler)
	//	Services
	protectedRoutes.HandleFunc("/sync", microservices.ServeSessionLocalStorage)
	protectedRoutes.HandleFunc("/getDrugs", microservices.ServeDrugs)
	protectedRoutes.HandleFunc("/getImage/{dir}/{id:[0-9]+}/{file}", microservices.ServeImages)
	protectedRoutes.HandleFunc("/saveChanges", microservices.SaveUserConfig)
	protectedRoutes.HandleFunc("/getDoctors", microservices.ServeDoctors)
	protectedRoutes.HandleFunc("/getTurnos/{status}", microservices.ServeAssigments)
	protectedRoutes.HandleFunc("/assignDoctor", microservices.AssignDoctor)
	protectedRoutes.HandleFunc("/getNotifications", microservices.ServeNotifications)
	protectedRoutes.HandleFunc("/updateNotification/{action}", microservices.UpdateNotification)
	protectedRoutes.HandleFunc("/getResults", microservices.ServeAssigmentsResults)
	protectedRoutes.HandleFunc("/lastdoctor", microservices.LastDoctor)
	// Doctor services
	doctorRoutes := protectedRoutes.NewRoute().Subrouter()
	doctorRoutes.Use(Middleware.RoleValidation("2"))
	doctorRoutes.HandleFunc("/updateAssigment/{action}", microservices.UpdateAssigment)
	doctorRoutes.HandleFunc("/assignmentResults", microservices.AssigmentResults)
	// Admin services
	adminRoutes := protectedRoutes.NewRoute().Subrouter()
	adminRoutes.Use(Middleware.RoleValidation("3"))
	adminRoutes.HandleFunc("/getUsers", microservices.ServeUsers)
	log.Println("Database is ready for running")
	err := http.ListenAndServe("0.0.0.0:8000", r)
	if err != nil {
		log.Printf("FATAL ERROR OCURRED WHILE SERVING THE MUX")
		panic(err)
	}
}
