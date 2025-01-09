package auth

import (
	"errors"
	"log"
	"net/mail"
	"regexp"
	"strconv"
	"time"
)

func isValidUsername(username string) bool {
	regex := regexp.MustCompile(`^([A-ZÑÁÉÍÓÚÜ][a-zñáéíóúü\.\-']+)(\s[A-ZÑÁÉÍÓÚÜ][a-zñáéíóúü\.\-']+){1,}$`)
	return regex.MatchString(username) && len(username) >= 5 && len(username) <= 50
}

func isValidPassword(password string) bool {
	return regexp.MustCompile(`[a-z]`).MatchString(password) &&
		regexp.MustCompile(`[A-Z]`).MatchString(password) &&
		regexp.MustCompile(`[0-9]`).MatchString(password) &&
		regexp.MustCompile(`[!@#~$%^&*()_+={}:;"'<>,.?/\\[\]\|-]`).MatchString(password)
}

func parseEmail(email string) (bool, error) {
	_, err := mail.ParseAddress(email)
	if err != nil {
		log.Printf("Email validation error %v", err)
		return false, errors.New("correo electronico invalido")
	} else {
		return true, nil

	}
}
func parseDate(dateStr string) (time.Time, error) {
	date, err := time.Parse("2006-01-02", dateStr)
	return date, err
}

func parseGender(gender string) bool {
	return ((gender == "male") != (gender == "female"))
}

func parseRole(roleStr string) (int, error) {
	role, err := strconv.Atoi(roleStr)
	if err != nil {
		return -1, errors.New("ocurrio un error al verificar el rol")
	} else {
		if (role == 1) != (role == 2) {
			return role, nil
		} else {
			return -1, errors.New("rol invalido")
		}

	}

}
