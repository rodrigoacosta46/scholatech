package auth

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/mail"
	"regexp"
	"strconv"
	"time"

	"github.com/nicolas-k-cmd/proj-redes/src/cookies"
	"github.com/nicolas-k-cmd/proj-redes/src/database"
	"github.com/nicolas-k-cmd/proj-redes/src/enum"
	"github.com/nicolas-k-cmd/proj-redes/src/structs"
	"gorm.io/gorm"

	"golang.org/x/crypto/bcrypt"
)

/*
HTTP ENDPOINT
Must pass the Guest Routes Middleware Routes
When the user fills out the register form and issues an HTTP Request for creation
This endpoint will take into action if the CORS and Middleware Routes are satisfied.
It requieres that the user Issues a valid RegisterRequest JSON HTTP Request.
And that the Request method is always POST (Yep, were creating a resource, what else were you expecting?)

Once the structure is aprsed,
it will validate throught regex and other methods the data provided in the structure
If anything fails, it will returns a 4XX code unless its a server error (5XX)
If the data structure its ok, it will use GORM to search if the user exists.
If it exists, it will throw an error.
If not. The operation will continue upon the creation of the new resource.
Prior the insertion in the database, a hash will be created, again, everything must be ok
The data is succesfully inserted (I hope) and the servers returns an
HTTP 201 Code, A success message and an order to redirect to an authenticated route
*/
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
	var nameFormat bool = true

	regex := regexp.MustCompile(`^([A-ZÑÁÉÍÓÚÜ][a-zñáéíóúü\.\-']+)(\s[A-ZÑÁÉÍÓÚÜ][a-zñáéíóúü\.\-']+){1,}$`)
	fmt.Println("Username: ", username)
	if regex.MatchString(username) {
		fmt.Println("Nombre cumple con formato")
	} else {
		fmt.Println("Nombre no cumple con formato")
		nameFormat = false
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

	if nameFormat && nameLength && pswdLowercase && pswdUppercase && pswdNumber && pswdSpecial {
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

	strRole := req.Role
	role, err := strconv.Atoi(strRole)

	if ((role == 1) == (role == 2)) || (err != nil) {
		fmt.Println("El perfil seleccionado es invalido ", role)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(structs.Response{Message: "El perfil seleccionado es invalido"})
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
		PerfilID:  role,
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
		RedirectRoute: enum.URLs["profile"].Which(r),
	})
}

/*
Same thing as the RegisterAuthHandler but for login
*/

type authUser struct {
	Password string
	ID       int
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

	userData := authUser{}

	if err := database.Db.Model(&database.User{}).Select("password", "id").Where("username = ?", username).Scan(&userData).Error; err != nil {
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
		fmt.Println(userData.Password)
		err = bcrypt.CompareHashAndPassword([]byte(userData.Password), []byte(password))
		// returns nil on succcess
		if err == nil {
			cookies.CreateHandler(w, r, userData.ID)
			w.WriteHeader(http.StatusOK)
			json.NewEncoder(w).Encode(structs.Response{
				Message:       "La autenticacion fue un exito",
				RedirectRoute: enum.URLs["profile"].Which(r),
			})
			return
		}
		fmt.Println("incorrect password")
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(structs.Response{Message: "El nombre de usuario o la contrasenia son incorrectos."})
	}
}
