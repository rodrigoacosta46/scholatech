package auth

import (
	"errors"
	"log"
	"net/http"
	"strings"

	"github.com/nicolas-k-cmd/proj-redes/src/cookies"
	"github.com/nicolas-k-cmd/proj-redes/src/database"
	"github.com/nicolas-k-cmd/proj-redes/src/enum"
	"github.com/nicolas-k-cmd/proj-redes/src/structs"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type authUser struct {
	Password string
	ID       int
}

type AuthService struct {
	db *gorm.DB
	w  http.ResponseWriter
	r  *http.Request
}

func NewAuthService(w http.ResponseWriter, r *http.Request) *AuthService {
	return &AuthService{
		db: database.Db,
		r:  r,
		w:  w,
	}
}

func (a *AuthService) Register(req structs.RegisterRequest) (structs.Response, error) {
	answer := structs.Response{}
	// Validación avanzada
	req.Username = strings.TrimSpace(req.Username)
	req.Email = strings.TrimSpace(req.Email)
	req.Password = strings.TrimSpace(req.Password)
	if !isValidUsername(req.Username) || !isValidPassword(req.Password) {
		a.w.WriteHeader(http.StatusBadRequest)
		return answer, errors.New("el nombre de usuario o contraseña no cumplen los requisitos")
	}
	if !parseGender(req.Gender) {
		a.w.WriteHeader(http.StatusBadRequest)
		return answer, errors.New("genero invalido")
	}
	valid, err := parseEmail(req.Email)
	if !valid || err != nil {
		a.w.WriteHeader(http.StatusInternalServerError)
		log.Printf("Error ocurred while validating email, %v", err)
		return answer, err
	}
	role, err := parseRole(req.Role)
	if role == -1 || err != nil {
		log.Printf("Error ocurred while verifying role %v", err.Error())
		a.w.WriteHeader(http.StatusBadRequest)
		return answer, err
	}
	// Crear hash de la contraseña
	parsedDate, err := parseDate(req.Birthdate)
	if err != nil {
		log.Printf("Error while validating date %v", err.Error())
		return answer, errors.New("fecha invalida")
	}
	valid, err = a.IsEmailAvaiable(req.Email)
	if !valid || err != nil {
		log.Printf("Error ocurred while verifying email ocurrences, %v", err)
		return answer, err
	}
	valid, err = a.IsUsernameAvaiable(req.Username)
	if !valid || err != nil {
		return answer, err
	}
	hashedPassword, err := a.BCryptGenerator(req.Password)
	if err != nil {
		return answer, err
	}
	/*
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			return nil, errors.New("error al encriptar la contraseña")
		}
	*/

	// Insertar usuario
	userInsert := database.User{
		Username:  req.Username,
		Password:  string(hashedPassword),
		Email:     req.Email,
		Telephone: req.Telephone,
		Gender:    req.Gender,
		Birthdate: parsedDate,
		PerfilID:  role,
	}

	if err := a.db.Create(&userInsert).Error; err != nil {
		return answer, errors.New("error al guardar el usuario en la base de datos")
	}
	log.Println("EL REGISTRO FUE UN EXITO")
	log.Println("Creando session...")
	cookies.CreateHandler(a.w, a.r, userInsert.ID)
	a.w.WriteHeader(http.StatusCreated)
	answer.Message = "La cuenta ha sido registrada con exito"
	answer.RedirectRoute = "/profile"
	return answer, nil
}

func (a *AuthService) Login(req structs.LoginRequest) (structs.Response, error) {
	answer := structs.Response{}
	req.Username = strings.TrimSpace(req.Username)
	req.Password = strings.TrimSpace(req.Password)
	log.Println("username:", req.Username, "password:", req.Password)
	if !isValidUsername(req.Username) || !isValidPassword(req.Password) {
		return answer, errors.New("el nombre de usuario o contraseña no cumplen los requisitos")
	}
	userData := authUser{}

	if err := database.Db.Model(&database.User{}).Select("password", "id").Where("username = ?", req.Username).Scan(&userData).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			log.Println("error selecting Hash in db by Username")
			a.w.WriteHeader(http.StatusUnauthorized)
			return answer, errors.New("el nombre de usuario o  la contrasenia son incorrectos")
		} else {
			log.Println("A fatal error ocurred while performing the login query: ", err)
			answer.Fatal = "rue"
			a.w.WriteHeader(http.StatusInternalServerError)
			return answer, errors.New("ocurrio un fallo interno al buscar el usuario")
		}
	} else {
		log.Println(userData.Password)
		err = bcrypt.CompareHashAndPassword([]byte(userData.Password), []byte(req.Password))
		// returns nil on succcess
		if err == nil {
			cookies.CreateHandler(a.w, a.r, userData.ID)
			a.w.WriteHeader(http.StatusOK)
			answer.Message = "La autenticacion fue un exito"
			answer.RedirectRoute = enum.URLs["profile"].Which(a.r)
			return answer, nil
		}
		log.Println("incorrect password")
		a.w.WriteHeader(http.StatusUnauthorized)
		return answer, errors.New("el nombre de usuario o la contrasenia son incorrecots")
		//json.NewEncoder(a.w).Encode(structs.Response{Message: "El nombre de usuario o la contrasenia son incorrectos."})
	}

}
func (a *AuthService) IsUsernameAvaiable(username string) (bool, error) {
	var user database.User
	err := a.db.Where("username = ?", username).Select("id").First(&user).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return true, nil
	} else if err != nil {
		log.Printf("An error ocurred while searching if the username is in use or not: %v", string(err.Error()))
		return false, errors.New("ocurrio un fallo al verificar si el nombre dee usuario estaba en uso")
	} else {
		return false, errors.New("error desconocido al buscar el nombre de usuario")
	}
}

func (a *AuthService) IsEmailAvaiable(email string) (bool, error) {
	var user database.User
	err := a.db.Where("email = ?", email).Select("id").First(&user).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return true, nil
	} else if err != nil {
		log.Printf("An error ocurred while searching if the email is in use or not: %v", string(err.Error()))
		return false, errors.New("ocurrio un fallo al verificar si el correo estaba en uso")
	} else {
		return false, errors.New("el email se encuentra en uso")

	}
}

func (a *AuthService) BCryptGenerator(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", errors.New("error al encriptar la contraseña")
	} else {
		return string(hashedPassword), nil

	}
}
