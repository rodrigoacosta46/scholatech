package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"html/template"
	"net/http"
	"net/mail"
	"os"
	"strings"
	"time"
	"unicode"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/sessions"
	"golang.org/x/crypto/bcrypt"
)

var tp1 *template.Template

var name = "john"

type RegisterRequest struct {
	Username  string
	Password  string
	Email     string
	Birthdate string
	Gender    string
}

type LoginRequest struct {
	Username string
	Password string
}
type Response struct {
	Message       string `json:"message"`
	RedirectRoute string `json:"redirect_route,omitempty"`
}

var db *sql.DB

var store = sessions.NewCookieStore([]byte("super-secret-password"))

func main() {
	var err error
	db, err = sql.Open("mysql", "root@tcp(localhost:3306)/scholaTech26")
	if err != nil {
		fmt.Println("lets panic")
		panic(err.Error())
	}
	defer db.Close()
	err = db.Ping()
	if err != nil {
		fmt.Println("Error while connecting to the database")
		panic(err.Error())
	}
	importarDB()
	tp1, _ = tp1.ParseGlob("*.html")
	mux := http.NewServeMux()
	mux.HandleFunc("/loginauth", loginAuthHandler)
	mux.HandleFunc("/registerauth", registerAuthHandler)
	http.ListenAndServe(":8000", enableCORS(mux))
}

func enableCORS(next http.Handler) http.Handler {
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

func importarDB() {
	sqlContent, err := os.ReadFile("scholatech.sql")
	if err != nil {
		fmt.Printf("No se puede leer el archivo SQL: %v", err)
		return
	}
	fmt.Println("BEGINNIG")
	tx, err := db.Begin()
	if err != nil {
		fmt.Printf("error al iniciar la transacción: %v", err)
		return
	}
	queries := strings.Split(string(sqlContent), ";")
	for _, query := range queries {
		query = strings.TrimSpace(query)
		if query != "" {
			_, err = tx.Exec(query)
			if err != nil {
				tx.Rollback()
				fmt.Printf("Error al ejecutar la consulta: %v\nConsulta: %s", err, query)
				return
			}
		}
	}
	err = tx.Commit()
	if err != nil {
		tx.Rollback()
		fmt.Println("Error al confirmar la transaccion: %v", err)
		return
	}
	fmt.Println("la db fue importada con exito")

}

func loginAuthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	fmt.Println("*****loginAuthHandler running*****")
	var req LoginRequest
	decoder := json.NewDecoder(r.Body)
	defer r.Body.Close()
	if err := decoder.Decode(&req); err != nil {
		fmt.Printf("Error al decodficar JSON: %v\n", err)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(Response{Message: "Solicitud JSON Invalida"})
		return
	}
	username := req.Username
	password := req.Password
	fmt.Println("username:", username, "password:", password)
	var hash string
	stmt := "SELECT clave FROM usuarios WHERE nombre = ?"
	row := db.QueryRow(stmt, username)
	err := row.Scan(&hash)
	fmt.Println("hash from db:", hash)
	if err != nil {
		fmt.Println("error selecting Hash in db by Username")
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(Response{Message: "El nombre de usuario o la contrasenia son incorrectos."})
		return
	}
	err = bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	// returns nil on succcess
	if err == nil {
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(Response{
			Message:       "La autenticacion fue un exito",
			RedirectRoute: "/LoginSuccess",
		})
		return
	}
	fmt.Println("incorrect password")
	w.WriteHeader(http.StatusUnauthorized)
	json.NewEncoder(w).Encode(Response{Message: "El nombre de usuario o la contrasenia son incorrectos."})

}

func registerAuthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method != http.MethodPost {
		http.Redirect(w, r, "/register", http.StatusSeeOther)
		return
	}
	fmt.Println("***registerAuthhandler running")
	//bytedata, err := ioutil.ReadAll(r.Body)
	//reqBodyString := string(bytedata)
	//fmt.Println(reqBodyString)
	var req RegisterRequest
	decoder := json.NewDecoder(r.Body)
	defer r.Body.Close()
	//r.Body = ioutil.NopCloser(bytes.NewBuffer(bytedata))
	if err := decoder.Decode(&req); err != nil {
		fmt.Printf("Error al decodficar JSON: %v\n", err)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(Response{Message: "Solicitud JSON Invalida"})
		return
	}
	username := req.Username
	var nameAlphanumeric bool = true
	for _, char := range username {
		if !(unicode.IsLetter(char) || unicode.IsNumber(char)) {
			fmt.Println("No es alfabumerico")
			fmt.Println(char)
			nameAlphanumeric = false
			break
		}
	}

	var nameLength bool
	if len(username) >= 5 && len(username) <= 50 {
		nameLength = true
	}

	password := req.Password //.FormValue("password")
	fmt.Println("password:", password, "\npswdLength:", len(password))
	var pswdLowercase, pswdUppercase, pswdNumber, pswdSpecial bool
	for _, char := range password {
		switch {
		case unicode.IsLower(char):
			pswdLowercase = true
		case unicode.IsUpper(char):
			pswdUppercase = true
		case unicode.IsNumber(char):
			pswdNumber = true
		case unicode.IsPunct(char) || unicode.IsSymbol(char):
			pswdSpecial = true
		}
	}

	// Utilizar las variables para evitar el error
	if nameAlphanumeric && nameLength && pswdLowercase && pswdUppercase && pswdNumber && pswdSpecial {
		fmt.Println("El nombre de usuario y la contraseña cumplen con los requisitos.")
	} else {
		fmt.Println("El nombre de usuario o la contraseña no cumplen con los requisitos.")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(Response{Message: "El nombre de usuario o la contraseña no cumplen con los requisitos."})
		return
	}

	gender := req.Gender
	//XNOR GATE
	if (gender == "male") == (gender == "female") {
		fmt.Println("El genero seleccionado es invalido ", gender)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(Response{Message: "El genero seleccionado es invalido"})
		return
	}
	birth_date_form := req.Birthdate
	parsedDate, err := time.Parse("2006-01-02", birth_date_form)
	if err != nil {
		fmt.Println("Fecha de nacimiento invalida", err)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(Response{Message: "La fecha de nacimiento es invalida"})
		return
	}
	email := req.Email
	_, err_email := mail.ParseAddress(email)
	if err_email != nil {
		fmt.Println("Correo electronico invalido")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(Response{Message: "Correo electronico invalido"})
		return
	}
	stmt := "SELECT id FROM usuarios WHERE nombre=?"
	print(db)
	row := db.QueryRow(stmt, username)
	var uID string
	err = row.Scan(&uID)
	if err != sql.ErrNoRows {
		fmt.Println("Username already exsits, err:", err)
		w.WriteHeader(http.StatusConflict)
		json.NewEncoder(w).Encode(Response{Message: "El nombre de usuario ya existe"})
		return
	}
	var hash []byte
	hash, err = bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		fmt.Println("bcrypt err:", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(Response{Message: "Ocurrio un error al registrar la cuenta"})
		return
	}
	fmt.Println("hash", hash)
	fmt.Println("string(hash)", string(hash))
	var insertStmt *sql.Stmt
	insertStmt, err = db.Prepare("INSERT INTO usuarios (nombre, correo, clave, genero, nacimiento, fecha_alta) VALUES (?, ?, ?, ?, ?, NOW());")
	if err != nil {
		fmt.Println("error preparing statement", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(Response{Message: "Ocurrio un error al registrar la cuenta"})
		return
	}
	defer insertStmt.Close()
	var result sql.Result
	result, err = insertStmt.Exec(username, email, hash, gender, parsedDate)
	rowsAff, _ := result.RowsAffected()
	lastIns, _ := result.LastInsertId()
	fmt.Println("rowsAff:", rowsAff)
	fmt.Println("lastIns", lastIns)
	fmt.Println("err", err)
	if err != nil {
		fmt.Println("error inserting new user")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(Response{Message: "Ocurrio un error al registrar la cuenta"})
	}
	fmt.Println("EL REGISTRO FUE UN EXITO")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(Response{
		Message:       "La cuenta ha sido registrada con exito",
		RedirectRoute: "/RegisterSucces",
	})
}

func createHandler(w http.ResponseWriter, r *http.Request) {
	session, err := store.Get(r, "session-name")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	session.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   86400 * 7,
		HttpOnly: true,
	}
	session.Values["name"] = "test"
	fmt.Println("session", session)
	err = session.Save(r, w)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)

	}
}

func deleteHandler(w http.ResponseWriter, r *http.Request) {
	session, _ := store.Get(r, "session-name")
	session.Options.MaxAge = -1
	fmt.Println("session:", session)
	session.Save(r, w)
	tp1.ExecuteTemplate(w, "delete.html", nil)

}
