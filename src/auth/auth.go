package auth

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/mail"
	"regexp"
	"time"

	"github.com/nicolas-k-cmd/proj-redes/src/cookies"
	"github.com/nicolas-k-cmd/proj-redes/src/database"
	"github.com/nicolas-k-cmd/proj-redes/src/structs"
	"gorm.io/gorm"

	"golang.org/x/crypto/bcrypt"
)

func RegisterAuthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method != http.MethodPost {
		http.Redirect(w, r, "/register", http.StatusSeeOther)
		return
	}
	fmt.Println("***registerAuthhandler running")
	//bytedata, err := ioutil.ReadAll(r.Body)
	//reqBodyString := string(bytedata)
	//fmt.Println(reqBodyString)
	var req structs.RegisterRequest
	decoder := json.NewDecoder(r.Body)
	defer r.Body.Close()
	//r.Body = ioutil.NopCloser(bytes.NewBuffer(bytedata))
	if err := decoder.Decode(&req); err != nil {
		fmt.Printf("Error al decodficar JSON: %v\n", err)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(structs.Response{Message: "Solicitud JSON Invalida"})
		return
	}
	username := req.Username
	var nameAlphanumeric bool = true
	regex := regexp.MustCompile(`^[a-zA-Z0-9]+$`)
	if regex.MatchString(username) {
		fmt.Println("Es alfanumerico")
	} else {
		fmt.Println("No es alfanumerico")
		nameAlphanumeric = false
	}

	var nameLength bool
	if len(username) >= 5 && len(username) <= 50 {
		nameLength = true
	}

	password := req.Password
	fmt.Println("password:", password, "\npswdLength:", len(password))

	var pswdLowercase, pswdUppercase, pswdNumber, pswdSpecial bool
	pswdLowercase = regexp.MustCompile(`[a-z]`).MatchString(password)
	pswdUppercase = regexp.MustCompile(`[A-Z]`).MatchString(password)
	pswdNumber = regexp.MustCompile(`[0-9]`).MatchString(password)
	pswdSpecial = regexp.MustCompile(`[!@#~$%^&*()_+={}:;"'<>,.?/\\[\]\|-]`).MatchString(password)

	fmt.Println("lowercase:", pswdLowercase)
	fmt.Println("uppercase:", pswdUppercase)
	fmt.Println("numbers:", pswdNumber)
	fmt.Println("special charsxw:", pswdSpecial)

	if nameAlphanumeric && nameLength && pswdLowercase && pswdUppercase && pswdNumber && pswdSpecial {
		fmt.Println("El nombre de usuario y la contraseña cumplen con los requisitos.")
	} else {
		fmt.Println("El nombre de usuario o la contraseña no cumplen con los requisitos.")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(structs.Response{Message: "El nombre de usuario o la contraseña no cumplen con los requisitos."})
		return
	}

	gender := req.Gender
	//XNOR GATE
	if (gender == "male") == (gender == "female") {
		fmt.Println("El genero seleccionado es invalido ", gender)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(structs.Response{Message: "El genero seleccionado es invalido"})
		return
	}
	birth_date_form := req.Birthdate
	parsedDate, err := time.Parse("2006-01-02", birth_date_form)
	if err != nil {
		fmt.Println("Fecha de nacimiento invalida", err)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(structs.Response{Message: "La fecha de nacimiento es invalida"})
		return
	}
	email := req.Email
	_, err_email := mail.ParseAddress(email)
	if err_email != nil {
		fmt.Println("Correo electronico invalido")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(structs.Response{Message: "Correo electronico invalido"})
		return
	}
	var user database.User
	err = database.Db.Where("username = ?", username).Select("id").First(&user).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			fmt.Println("El usuario no existe, puede proseguir")
		} else {
			fmt.Println("Error en la consulta, err:", err)
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(structs.Response{Message: "Error al consultar la base de datos", Fatal: "treu"})
			return

		}
	} else {
		fmt.Println("El usuario ya existe")
		w.WriteHeader(http.StatusConflict)
		json.NewEncoder(w).Encode(structs.Response{Message: "El nombre de usuario ya existe"})
		return
	}
	var hash []byte
	hash, err = bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		fmt.Println("bcrypt err:", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(structs.Response{Message: "Ocurrio un error al registrar la cuenta"})
		return
	}
	fmt.Println("hash", hash)
	fmt.Println("string(hash)", string(hash))
	userInsert := database.User{
		Username:  username,
		Email:     email,
		Password:  string(hash),
		Gender:    gender,
		Birthdate: parsedDate,
	}
	resultDb := database.Db.Create(&userInsert)
	if resultDb.Error != nil {
		fmt.Printf("Error al insertar usuario %v", resultDb.Error)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(structs.Response{Message: "Ocurrio un error al guardar la cuenta", Fatal: "true"})
		return
	}
	fmt.Println("EL REGISTRO FUE UN EXITO")
	fmt.Println("Creando session...")
	cookies.CreateHandler(w, r, userInsert.ID)
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(structs.Response{
		Message:       "La cuenta ha sido registrada con exito",
		RedirectRoute: "/profile",
	})
}

func LoginAuthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	fmt.Println("*****loginAuthHandler running*****")
	var req structs.LoginRequest
	decoder := json.NewDecoder(r.Body)
	defer r.Body.Close()
	if err := decoder.Decode(&req); err != nil {
		fmt.Printf("Error al decodficar JSON: %v\n", err)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(structs.Response{Message: "Solicitud JSON Invalida"})
		return
	}
	username := req.Username
	password := req.Password
	fmt.Println("username:", username, "password:", password)
	var hash string

	if err := database.Db.Model(&database.User{}).Select("password").Where("username = ?", username).Scan(&hash).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			fmt.Println("error selecting Hash in db by Username")
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(structs.Response{Message: "El nombre de usuario o la contrasenia son incorrectos."})
		} else {
			fmt.Println("A fatal error ocurred while performing the login query: ", err)
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(structs.Response{Message: "Ocurrio un fallo interno al buscar el usuario", Fatal: "true"})
		}
		return
	} else {
		err = bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
		// returns nil on succcess
		if err == nil {
			cookies.CreateHandler(w, r, 1)
			w.WriteHeader(http.StatusOK)
			json.NewEncoder(w).Encode(structs.Response{
				Message:       "La autenticacion fue un exito",
				RedirectRoute: "/profile",
			})
			return
		}
		fmt.Println("incorrect password")
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(structs.Response{Message: "El nombre de usuario o la contrasenia son incorrectos."})
	}
}
