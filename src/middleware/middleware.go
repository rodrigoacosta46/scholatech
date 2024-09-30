package Middleware

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/golang-jwt/jwt/v5"
	"github.com/gorilla/sessions"
	"github.com/nicolas-k-cmd/proj-redes/src/env"
	"github.com/nicolas-k-cmd/proj-redes/src/structs"
)

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
		json.NewEncoder(w).Encode(structs.Response{Message: "Token JWT Invalido o Expirado", RedirectRoute: "/login", Authenticated: "true"})
		panic("TOKEN INVALIDO")
	}
	return token, session
}

func JwtMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("JWT Middleware. Path:", r.URL.Path)
		if !SilentuncheckJWTHandler(w, r) {
			fmt.Println("El usuario SI esta autenticado")
			next.ServeHTTP(w, r)
		} else {
			fmt.Println("El usuario NO esta autenticado")
			w.WriteHeader(http.StatusFound)
			json.NewEncoder(w).Encode(structs.Response{Message: "Usted debe autenticarse para poder continuar....", Authenticated: "false", RedirectRoute: "/login"})
		}
	})

}

func AntiJwtMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("Anti JWT Middleware. Path:", r.URL.Path)
		if SilentuncheckJWTHandler(w, r) {
			fmt.Println("El usuario NO esta autenticado")
			next.ServeHTTP(w, r)
		} else {
			fmt.Println("El usuario SI esta autenticado")
			w.WriteHeader(http.StatusFound)
			json.NewEncoder(w).Encode(structs.Response{Message: "Usted ya se encuentra autenticado en el sistema", Authenticated: "true", RedirectRoute: "/profile"})
		}
	})
}

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

func ValidateJWTHandler(w http.ResponseWriter, r *http.Request) {
	session, err := env.Store.Get(r, env.CookieName)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(structs.Response{Message: "Ocurrio un error al obtener la sesion", RedirectRoute: "/login", Authenticated: "false"})
		return
	}

	tokenString, ok := session.Values["jwt"].(string)
	if !ok {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(structs.Response{Message: "Token JWT No encontrado", RedirectRoute: "/login", Authenticated: "false"})
		return
	}

	claims := &env.Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return env.JwtSecret, nil
	})

	if err != nil || !token.Valid {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(structs.Response{Message: "Token JWT Invalido o Expirado", RedirectRoute: "/login", Authenticated: "true"})
		return
	}
	messagePrint := fmt.Sprintf("El usuario %s se encuentra autenticado", claims.ID)
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(structs.Response{Message: messagePrint, RedirectRoute: "/profile", Authenticated: "true"})
}

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
