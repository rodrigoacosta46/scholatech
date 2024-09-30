package cookies

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/gorilla/sessions"
	"github.com/nicolas-k-cmd/proj-redes/src/env"
	"github.com/nicolas-k-cmd/proj-redes/src/structs"
)

func CreateHandler(w http.ResponseWriter, r *http.Request, id int) {
	fmt.Println("cookie name: ", env.CookieName)
	session, err := env.Store.Get(r, env.CookieName)
	if err != nil {
		fmt.Println("error gathering session", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(structs.Response{Message: "Ocurrio un error al obtener la sesion"})
		return
	}
	session.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   86400 * 7,
		HttpOnly: true,
		Secure:   false,
		SameSite: http.SameSiteLaxMode,
	}
	token, err := GenerateJWT(id)
	if err != nil {
		fmt.Println("error generating new JWT")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(structs.Response{Message: "Ocurrio un error al generar la sesion"})
		return
	}
	fmt.Println("JWT Token")
	session.Values["testValue"] = "test"
	session.Values["jwt"] = token
	fmt.Println("token: ", token)
	fmt.Println("session", session)
	err = session.Save(r, w)
	if err != nil {
		fmt.Println("error while storing the session", err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(structs.Response{Message: "Ocurrio un error al guardar la sesion"})
		return
	}
}

func DeleteHandler(w http.ResponseWriter, r *http.Request) {
	session, _ := env.Store.Get(r, env.CookieName)
	session.Values["jwt"] = ""
	session.Options.MaxAge = -1
	fmt.Println("session:", session)
	session.Save(r, w)
	http.Redirect(w, r, "http://localhost:5173/login", http.StatusFound)
}

func GenerateJWT(id int) (string, error) {
	//JWT Duration
	now := time.Now()
	expirationTime := now.Add(24 * time.Hour)
	parsedId := strconv.Itoa(id)
	fmt.Println("PROVIDED ID ", parsedId)
	// Struct Generator
	claims := &env.Claims{
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    "scholameds-ketracelblanco",
			Subject:   parsedId,
			IssuedAt:  jwt.NewNumericDate(now),
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(env.JwtSecret)
	if err != nil {
		return "", err
	}

	return tokenString, nil

}
