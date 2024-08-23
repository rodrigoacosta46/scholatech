package main

import (
	"database/sql"
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

type Sub struct {
	Username string
	Password string
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
	mux.HandleFunc("/login", loginWebpage)
	mux.HandleFunc("/loginauth", loginAuthHandler)
	mux.HandleFunc("/registerauth", registerAuthHandler)
	mux.HandleFunc("/register", registerWebpage)
	http.ListenAndServe(":8080", mux)
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

func loginWebpage(w http.ResponseWriter, r *http.Request) {
	fmt.Println("El usuario esta logueandose")
	tp1.ExecuteTemplate(w, "login.html", nil)
}
func registerWebpage(w http.ResponseWriter, r *http.Request) {
	fmt.Println("El usuario esta registrandose")
	tp1.ExecuteTemplate(w, "register.html", nil)
}

func loginAuthHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("*****loginAuthHandler running*****")
	r.ParseForm()
	username := r.FormValue("username")
	password := r.FormValue("password")
	fmt.Println("username:", username, "password:", password)
	var hash string
	stmt := "SELECT clave FROM usuarios WHERE nombre = ?"
	row := db.QueryRow(stmt, username)
	err := row.Scan(&hash)
	fmt.Println("hash from db:", hash)
	if err != nil {
		fmt.Println("error selecting Hash in db by Username")
		tp1.ExecuteTemplate(w, "login.html", "check username and password")
		return
	}
	err = bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	// returns nil on succcess
	if err == nil {
		fmt.Fprint(w, "You have successfully logged in")
		return
	}
	fmt.Println("incorrect password")
	tp1.ExecuteTemplate(w, "login.html", "check username and password")
}

func formInputHandleFunc(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Processing Data")
	var s Sub
	s.Username = r.FormValue("usernamedatabase")
	s.Password = r.FormValue("passworddatabase")
	fmt.Println("Username", s.Username, "Sensitibe data", s.Password)
}

func registerAuthHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Redirect(w, r, "/register", http.StatusSeeOther)
		return
	}
	fmt.Println("***registerAuthhandler running")
	r.ParseForm()
	username := r.FormValue("username")
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

	password := r.FormValue("password")
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
		tp1.ExecuteTemplate(w, "register.html", "Please check username and password criteria")
		return
	}

	gender := r.FormValue("gender")
	//XNOR GATE
	if (gender == "male") == (gender == "female") {
		fmt.Println("El genero seleccionado es invalido ", gender)
		tp1.ExecuteTemplate(w, "register.html", "Invalid Gender")
		return
	}
	birth_date_form := r.FormValue("birthdate")
	parsedDate, err := time.Parse("2006-01-02", birth_date_form)
	if err != nil {
		fmt.Println("Fecha de nacimiento invalida", err)
		tp1.ExecuteTemplate(w, "register.html", "Invalid birthdate")
		return
	}
	email := r.FormValue("email")
	_, err_email := mail.ParseAddress(email)
	if err_email != nil {
		fmt.Println("Correo electronico invalido")
		tp1.ExecuteTemplate(w, "register.html", "Invalid Email")
		return
	}
	stmt := "SELECT id FROM usuarios WHERE nombre=?"
	print(db)
	row := db.QueryRow(stmt, username)
	var uID string
	err = row.Scan(&uID)
	if err != sql.ErrNoRows {
		fmt.Println("Username already exsits, err:", err)
		tp1.ExecuteTemplate(w, "register.html", "Username already taken")
		return
	}
	var hash []byte
	hash, err = bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		fmt.Println("bcrypt err:", err)
		tp1.ExecuteTemplate(w, "register.html", "there was a problem registering account")
		return
	}
	fmt.Println("hash", hash)
	fmt.Println("string(hash)", string(hash))
	var insertStmt *sql.Stmt
	insertStmt, err = db.Prepare("INSERT INTO usuarios (nombre, correo, clave, genero, nacimiento, fecha_alta) VALUES (?, ?, ?, ?, ?, NOW());")
	if err != nil {
		fmt.Println("error preparing statement", err)
		tp1.ExecuteTemplate(w, "register.html", "there was a problem registering account")
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
		tp1.ExecuteTemplate(w, "register.html", "There was a problem registering account")
	}
	fmt.Println("EL REGISTRO FUE UN EXITO")

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
