package env

import (
	"log"
	"os"
	"strconv"
	"strings"

	"github.com/golang-jwt/jwt/v5"
	"github.com/gorilla/sessions"
	"github.com/joho/godotenv"
)

var JwtSecret []byte

var CookieName string

// JWT Structure
type Claims struct {
	jwt.RegisteredClaims
}

// Cookie handler with the cookie secret
var Store *sessions.CookieStore

var WebFullURL bool

var SERVER_PROTOCOL, WEB_PROTOCOL, SERVER_ADDRESS, WEB_ADDRESS, JWT_ISSUER, CACHE_NO_ISSUER string
var SERVER_PORT, WEB_PORT, RATELIMITER_GUEST, RATELIMITER_PROTECTED int

var SEED_DRUGS, ENABLE_FAKER, FAKER_DOCTOR, FAKER_DOCTOR_TOTAL, FAKER_PATIENT, FAKER_PATIENT_TOTAL, FAKER_HISTORIAL_TURNOS_CLOSED, FAKER_TURNOS, FAKER_TURNOS_TOTAL int

var MainDirectory, RealPath string

var WhereIam string

var DB_ADDRESS, REDIS_ADDRESS string

func removeSrcAndAfter(path string) string {
	// Encontrar la posición de "/src"
	index := strings.Index(path, "/src")
	if index == -1 {
		return path // Si no contiene "/src", devolver la ruta completa
	}

	// Retornar la ruta hasta antes de "/src"
	return path[:index]
}

/*
This package loads the application secrets including the JWT Secret and Cookie Secret.
The cookie name and the cookie session handler
*/

func init() {
	var err error
	MainDirectory, err = os.Getwd()
	if err != nil {
		log.Panicln("FATAL: Couldnt load enviroment directory", err)
	}
	RealPath = removeSrcAndAfter(MainDirectory)
	errLoad := godotenv.Load(RealPath + "/.env")
	if errLoad != nil {
		log.Panicln("FATAL: Couldnt load enviroment file", errLoad)
	}
	WhereIam := os.Getenv("WhereIam")
	if WhereIam == "KUBERNETES" {
		DB_ADDRESS = os.Getenv("DB_ADDRESS_KUBERNETES")
		REDIS_ADDRESS = os.Getenv("REDIS_ADDRESS_KUBERNETES")
	} else if WhereIam == "DOCKER" {
		DB_ADDRESS = os.Getenv("DB_ADDRESS_DOCKER")
		REDIS_ADDRESS = os.Getenv("REDIS_ADDRESS_DOCKER")
	} else {
		WhereIam = "HOST"
		DB_ADDRESS = os.Getenv("DB_ADDRESS_HOST")
		REDIS_ADDRESS = os.Getenv("REDIS_ADDRESS_HOST")
	}
	log.Println("WHEREIAM: ", WhereIam)
	Store = sessions.NewCookieStore([]byte(os.Getenv("COOKIE_SECRET")))
	JwtSecret = []byte(os.Getenv("JWT_SECRET"))
	CookieName = os.Getenv("COOKIE_NAME")
	WebFullURL = (os.Getenv("WEB_FULL_URL") == "1")
	SERVER_ADDRESS = os.Getenv("SERVER_ADDRESS")
	JWT_ISSUER = os.Getenv("JWT_ISSUER")
	SERVER_PROTOCOL = os.Getenv("SERVER_PROTOCOL")
	WEB_ADDRESS = os.Getenv("WEB_ADDRESS")
	WEB_PORT, _ = strconv.Atoi(os.Getenv("WEB_PORT"))
	CACHE_NO_ISSUER = os.Getenv("CACHE_NO_ISSUER")
	WEB_PROTOCOL = os.Getenv("WEB_PROTOCOL")
	RATELIMITER_PROTECTED, err = strconv.Atoi(os.Getenv("RATELIMITER_PROTECTED"))
	if err != nil {
		log.Println("UNABLE TO PARSE ENVIROMENT VARIABLE RATELIMITER_PROTECTED TO INT")
		panic(err)
	}
	RATELIMITER_GUEST, err = strconv.Atoi(os.Getenv("RATELIMITER_GUEST"))
	if err != nil {
		log.Println("UNABLE TO PARSE ENVIROMENT VARIABLE RATELIMITER_GUEST TO INT")
		panic(err)
	}
	FAKER_HISTORIAL_TURNOS_CLOSED, err = strconv.Atoi(os.Getenv("FAKER_HISTORIAL_TURNOS_CLOSED"))
	if err != nil {
		log.Println("UNABLE TO PARSE ENVIROMENT VARIABLE FAKER_HISTORIAL_TURNOS_CLOSED TO INT")
		panic(err)
	}
	SERVER_PORT, err = strconv.Atoi(os.Getenv("SERVER_PORT"))
	if err != nil {
		log.Println("UNABLE TO PARSE ENVIROMENT VARIABLE SERVER_PORT TO INT")
		panic(err)
	}
	SEED_DRUGS, err = strconv.Atoi(os.Getenv("SEED_DRUGS"))
	if err != nil {
		log.Println("UNABLE TO PARSE ENVIROMENT VARIABLE SEED_DRUGS TO INT")
		panic(err)
	}
	ENABLE_FAKER, err = strconv.Atoi(os.Getenv("ENABLE_FAKER"))
	if err != nil {
		log.Println("UNABLE TO PARSE ENVIROMENT VARIABLE ENABLE_FAKER TO INT")
		panic(err)
	}
	FAKER_DOCTOR, err = strconv.Atoi(os.Getenv("FAKER_DOCTOR"))
	if err != nil {
		log.Println("UNABLE TO PARSE ENVIROMENT VARIABLE FAKER_DOCTOR TO INT")
		panic(err)
	}
	FAKER_DOCTOR_TOTAL, err = strconv.Atoi(os.Getenv("FAKER_DOCTOR_TOTAL"))
	if err != nil {
		log.Println("UNABLE TO PARSE ENVIROMENT VARIABLE FAKER_DOCTOR_TOTAL TO INT")
		panic(err)
	}
	FAKER_PATIENT, err = strconv.Atoi(os.Getenv("FAKER_PATIENT"))
	if err != nil {
		log.Println("UNABLE TO PARSE ENVIROMENT VARIABLE FAKER_PATIENT TO INT")
		panic(err)
	}
	FAKER_PATIENT_TOTAL, err = strconv.Atoi(os.Getenv("FAKER_PATIENT_TOTAL"))
	if err != nil {
		log.Println("UNABLE TO PARSE ENVIROMENT VARIABLE FAKER_PATIENT_TOTAL TO INT")
		panic(err)
	}
	FAKER_TURNOS, err = strconv.Atoi(os.Getenv("FAKER_TURNOS"))
	if err != nil {
		log.Println("UNABLE TO PARSE ENVIROMENT VARIABLE FAKER_TURNOS TO INT")
		panic(err)
	}
	FAKER_TURNOS_TOTAL, err = strconv.Atoi(os.Getenv("FAKER_TURNOS_TOTAL"))
	if err != nil {
		log.Println("UNABLE TO PARSE ENVIROMENT VARIABLE FAKER_TURNOS_TOTAL TO INT")
		panic(err)
	}
}
