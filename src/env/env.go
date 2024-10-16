package env

import (
	"fmt"
	"os"
	"strconv"

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

var SERVER_PROTOCOL, WEB_PROTOCOL, SERVER_ADDRESS, WEB_ADDRESS string
var SERVER_PORT, WEB_PORT int

/*
This package loads the application secrets including the JWT Secret and Cookie Secret.
The cookie name and the cookie session handler
*/
func init() {
	errLoad := godotenv.Load()
	if errLoad != nil {
		fmt.Println("FATAL: Couldnt load enviorment file", errLoad)
		return
	}
	Store = sessions.NewCookieStore([]byte(os.Getenv("COOKIE_SECRET")))
	JwtSecret = []byte(os.Getenv("JWT_SECRET"))
	CookieName = os.Getenv("COOKIE_NAME")
	WebFullURL = (os.Getenv("WEB_FULL_URL") == "1")
	SERVER_ADDRESS = os.Getenv("SERVER_ADDRESS")
	SERVER_PORT, _ = strconv.Atoi(os.Getenv("SERVER_PORT"))
	SERVER_PROTOCOL = os.Getenv("SERVER_PROTOCOL")
	WEB_ADDRESS = os.Getenv("WEB_ADDRESS")
	WEB_PORT, _ = strconv.Atoi(os.Getenv("WEB_PORT"))
	WEB_PROTOCOL = os.Getenv("WEB_PROTOCOL")
}
