package env

import (
	"fmt"
	"os"

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
}
