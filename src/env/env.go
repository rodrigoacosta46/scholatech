package env

import (
	"fmt"
	"os"

	"github.com/golang-jwt/jwt/v5"
	"github.com/gorilla/sessions"
	"github.com/joho/godotenv"
)

var JwtSecret []byte // = []byte("scholameds-jwtsecret")

var CookieName string

type Claims struct {
	jwt.RegisteredClaims
}

var Store *sessions.CookieStore //= sessions.NewCookieStore([]byte("scholameds-cookiesecret"))

// Generates JWT Token for Web Session

func env() {
	errLoad := godotenv.Load()
	if errLoad != nil {
		fmt.Println("FATAL: Couldnt load enviorment file", errLoad)
		return
	}
	Store = sessions.NewCookieStore([]byte(os.Getenv("COOKIE_SECRET")))
	JwtSecret = []byte(os.Getenv("JWT_SECRET"))
	CookieName = os.Getenv("COOKIE_NAME")
}
