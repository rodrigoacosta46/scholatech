package Middleware

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/golang-jwt/jwt/v5"
	"github.com/gorilla/sessions"
	"github.com/nicolas-k-cmd/proj-redes/src/enum"
	"github.com/nicolas-k-cmd/proj-redes/src/env"
	"github.com/nicolas-k-cmd/proj-redes/src/structs"
)

/*
This function retrieves the JWT from the encrypted cookie once
it has already passed any security measures specified at the specific endpoint
*/
func GetCookiePostMiddleware(w http.ResponseWriter, r *http.Request) (*jwt.Token, *sessions.Session) {
	session, err := env.Store.Get(r, env.CookieName)
	if err != nil {
		panic(err)
	}

	tokenString, _ := session.Values["jwt"].(string)
	claims := &env.Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return env.JwtSecret, nil
	})

	if err != nil || !token.Valid {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(structs.Response{Message: "Token JWT Invalido o Expirado", RedirectRoute: enum.URLs["login"].Which(r), Authenticated: "true"})
		panic("TOKEN INVALIDO")
	}
	return token, session
}

/*
Validates if the user is authenticated.
*/
func JwtMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("JWT Middleware. Path:", r.URL.Path)
		if !SilentuncheckJWTHandler(w, r) {
			fmt.Println("El usuario SI esta autenticado")
			next.ServeHTTP(w, r)
		} else {
			fmt.Println("El usuario NO esta autenticado")
			w.WriteHeader(http.StatusFound)
			json.NewEncoder(w).Encode(structs.Response{Message: "Usted debe autenticarse para poder continuar....", Authenticated: "false", RedirectRoute: enum.URLs["login"].Which(r)})
		}
	})

}

/*
Validates if the user is NOT autheticated
*/

func AntiJwtMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("Anti JWT Middleware. Path:", r.URL.Path)
		if SilentuncheckJWTHandler(w, r) {
			fmt.Println("El usuario NO esta autenticado")
			next.ServeHTTP(w, r)
		} else {
			fmt.Println("El usuario SI esta autenticado")
			w.WriteHeader(http.StatusFound)
			json.NewEncoder(w).Encode(structs.Response{Message: "Usted ya se encuentra autenticado en el sistema", Authenticated: "true", RedirectRoute: enum.URLs["profile"].Which(r)})
		}
	})
}

/*
Checks if the JWT Is invalid.
If invalid, it returns true.
If an internal error ocurrs, it returns false
*/

func SilentuncheckJWTHandler(w http.ResponseWriter, r *http.Request) bool {
	session, err := env.Store.Get(r, env.CookieName)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		//json.NewEncoder(w).Encode(Response{Message: "Ocurrio un error al obtener la sesion"})
		return false
	}
	if session.Values["jwt"] == nil {
		return true
	}
	_, err = jwt.ParseWithClaims(session.Values["jwt"].(string), &env.Claims{}, func(token *jwt.Token) (interface{}, error) {
		return env.JwtSecret, nil
	})
	return err != nil
}

/*
This function decrypts the cookies, retrieves the JWT tocken and validates it with JWT SECRET.
It also includes validation in case if the token is expired.

Please take in note that this is not a middleware.
This is in case an alarm is triggered that indicates that the user might not be authenticated.
If authenticated is false, it destroys the cookie.
*/
func ValidateJWTHandler(w http.ResponseWriter, r *http.Request) {
	session, err := env.Store.Get(r, env.CookieName)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(structs.Response{Message: "Ocurrio un error al obtener la sesion", RedirectRoute: enum.URLs["login"].Which(r), Authenticated: "false"})
		return
	}

	tokenString, ok := session.Values["jwt"].(string)
	if !ok {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(structs.Response{Message: "Token JWT No encontrado", RedirectRoute: enum.URLs["login"].Which(r), Authenticated: "false"})
		return
	}

	claims := &env.Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return env.JwtSecret, nil
	})

	if err != nil || !token.Valid {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(structs.Response{Message: "Token JWT Invalido o Expirado", RedirectRoute: enum.URLs["logout"].Which(r), Authenticated: "false"})
		return
	}
	messagePrint := fmt.Sprintf("El usuario %s se encuentra autenticado", claims.ID)
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(structs.Response{Message: messagePrint, RedirectRoute: enum.URLs["profile"].Which(r), Authenticated: "true"})
}

/*
Frontend and backend are two separate application listening at diferrent ports
Browsers realize that and apply CORS.
Without this function, we couldnt do any AJAX request between frontend and backend.
OPTIONS Is mandatory
*/
func EnableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}
