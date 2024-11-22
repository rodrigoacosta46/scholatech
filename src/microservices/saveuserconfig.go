package microservices

import (
	"encoding/base64"
	"encoding/json"
	"log"
	"net/http"
	"net/mail"
	"os"
	"regexp"
	"strconv"
	"time"

	"github.com/nicolas-k-cmd/proj-redes/src/database"
	"github.com/nicolas-k-cmd/proj-redes/src/enum"
	Middleware "github.com/nicolas-k-cmd/proj-redes/src/middleware"
	"github.com/nicolas-k-cmd/proj-redes/src/structs"
	"golang.org/x/crypto/bcrypt"
)

type PasswordStruct struct {
	CurrentPassword string
	NewPassword     string
}

type RequestStruct struct {
	ID          int
	Username    string
	Email       string
	Gender      string
	Birthdate   string
	Password    PasswordStruct
	Picture     string
	Telephone   string
	Address     string
	Description string
	Speciality  string
}

func SaveUserConfig(w http.ResponseWriter, r *http.Request) {
	var req RequestStruct
	decoder := json.NewDecoder(r.Body)
	defer r.Body.Close()
	if err := decoder.Decode(&req); err != nil {
		log.Printf("Error al decodificar JSON en userconfig: %v\n", err)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(structs.Response{Message: "Solicitud JSON Invalida"})
		return
	}

	jwtToken, _ := Middleware.GetCookiePostMiddleware(w, r)
	id, err := (jwtToken.Claims.GetSubject())
	if err != nil {
		log.Printf("Error al obtener el jwt del usuario: %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode((structs.Response{Message: "Error al obtener el ID del sujeto"}))
		return
	}

	var usId int
	if usId, err = strconv.Atoi(id); err != nil {
		log.Printf("Error de parseo en userconfig: %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(structs.Response{Message: "Error al guardar cambios"})
		return
	}

	var usInfo = &database.User{}
	if err = database.Db.Joins("Perfil").First(&usInfo, usId).Error; err != nil {
		log.Printf("Error de consulta en userconfig: %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(structs.Response{Message: "Error al guardar cambios"})
		return
	}
	log.Println(usInfo)
	username := req.Username

	regex := regexp.MustCompile(`^([A-ZÑÁÉÍÓÚÜ][a-zñáéíóúü\.\-']+)(\s[A-ZÑÁÉÍÓÚÜ][a-zñáéíóúü\.\-']+){1,}$`)
	if regex.MatchString(username) && (len(username) >= 5 && len(username) <= 50) {
		log.Println("Nombre cumple con formato")
	} else {
		log.Println("Nombre no cumple con formato")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(structs.Response{Message: "El nombre de usuario no cumple con los requisitos."})
		return
	}

	newpass := req.Password.NewPassword
	if newpass != "" {
		log.Println("password:", newpass, "\npswdLength:", len(newpass))

		var pswdLowercase, pswdUppercase, pswdNumber, pswdSpecial bool
		pswdLowercase = regexp.MustCompile(`[a-z]`).MatchString(newpass)
		pswdUppercase = regexp.MustCompile(`[A-Z]`).MatchString(newpass)
		pswdNumber = regexp.MustCompile(`[0-9]`).MatchString(newpass)
		pswdSpecial = regexp.MustCompile(`[!@#~$%^&*()_+={}:;"'<>,.?/\\[\]\|-]`).MatchString(newpass)

		log.Println("lowercase:", pswdLowercase)
		log.Println("uppercase:", pswdUppercase)
		log.Println("numbers:", pswdNumber)
		log.Println("special charsxw:", pswdSpecial)

		if pswdLowercase && pswdUppercase && pswdNumber && pswdSpecial {
			log.Println("La contraseña cumple con los requisitos.")
		} else {
			log.Println("La contraseña no cumple con los requisitos.")
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(structs.Response{Message: "La contraseña no cumple con los requisitos."})
			return
		}

		if err = bcrypt.CompareHashAndPassword([]byte(usInfo.Password), []byte(req.Password.CurrentPassword)); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(structs.Response{Message: "La contraseña actual es incorrecta"})
			return
		}

		newpass, err := bcrypt.GenerateFromPassword([]byte(req.Password.NewPassword), bcrypt.DefaultCost)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(structs.Response{Message: "Error al guardar cambios"})
			return
		}
		req.Password.NewPassword = string(newpass)
	} else {
		req.Password.NewPassword = usInfo.Password
	}

	gender := req.Gender
	if (gender == "male") == (gender == "female") {
		log.Println("El genero seleccionado es invalido ", gender)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(structs.Response{Message: "El genero seleccionado es invalido"})
		return
	}

	birth_date_form := req.Birthdate
	parsedDate, err := time.Parse("2006-01-02", birth_date_form)
	currentDate := time.Now().UTC()
	if err != nil || currentDate.AddDate(-18, 0, 0).Before(parsedDate) {
		log.Println("Fecha de nacimiento invalida", err)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(structs.Response{Message: "La fecha de nacimiento es invalida"})
		return
	}

	email := req.Email
	_, err_email := mail.ParseAddress(email)
	if err_email != nil {
		log.Println("Correo electronico invalido", err_email)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(structs.Response{Message: "Correo electronico invalido"})
		return
	}

	if req.Picture != "" {
		usDir := "img/profiles/" + id
		if _, err := os.Stat(usDir); os.IsNotExist(err) {
			if err = os.Mkdir(usDir, os.ModePerm); err != nil {
				log.Println("Error al crear carpeta de usuario", err)
				w.WriteHeader(http.StatusInternalServerError)
				json.NewEncoder(w).Encode(structs.Response{Message: "Error al guardar imagen", Fatal: "true"})
				return
			}
		}
		log.Println(req.Picture)

		img, err := base64.StdEncoding.DecodeString(req.Picture)
		if err != nil {
			log.Println("Error al decodificar base64", err)
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(structs.Response{Message: "Error al guardar imagen", Fatal: "true"})
			return
		}

		filePath := usDir + "/" + id + ".png"

		if err := os.WriteFile(filePath, img, 0644); err != nil {
			log.Println("Error al formatear archivo de usuario", err)
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(structs.Response{Message: "Error al guardar imagen", Fatal: "true"})
			return
		}
	}

	log.Println(req.Telephone, len(req.Telephone))
	if len(req.Telephone) > 15 || !regexp.MustCompile(`^(\d+\s)(\d+\s)(\d{4,})$`).MatchString(req.Telephone) {
		log.Println("formato incorrecto de Telefono")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(structs.Response{Message: "Número de teléfono inválido"})
		return
	}

	log.Println("Rol del usuario: ", usInfo.Perfil.Name)
	if usInfo.Perfil.Name == "Doctor" {
		var errorFlag bool
		log.Println("Campos: ", req.Description, req.Address, req.Speciality)
		if req.Description != "" && (len(req.Description) > 400 || len(req.Description) < 50) {
			log.Println("formato incorrecto de Descripción")
			errorFlag = true
		}
		if req.Address != "" && (len(req.Address) > 100 || len(req.Address) < 5) {
			log.Println("formato incorrecto de Direccion")
			errorFlag = true
		}
		if req.Speciality != "" && (len(req.Speciality) > 50 || len(req.Speciality) < 5) {
			log.Println("formato incorrecto de Especialidad")
			errorFlag = true
		}
		if errorFlag {
			log.Println("Error al verificar campos reservados")
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(structs.Response{Message: "Error al guardar cambios"})
			return
		}
	} else {
		req.Description = ""
		req.Address = ""
		req.Speciality = ""
	}

	modifiedFields := database.User{
		Username:    req.Username,
		Email:       req.Email,
		Password:    req.Password.NewPassword,
		Birthdate:   parsedDate,
		Gender:      gender,
		Telephone:   req.Telephone,
		Address:     req.Address,
		Description: req.Description,
		Speciality:  req.Speciality,
	}

	if err = database.Db.Model(&database.User{}).Where("id = ?", usId).Updates(modifiedFields).Error; err != nil {
		log.Println("Error al guardar configuración de usuario", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(structs.Response{Message: "Error al guardar imagen", Fatal: "true"})
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(structs.Response{
		Message:       "Datos cambiados con exito",
		RedirectRoute: enum.URLs["profile"].Which(r),
	})
}
