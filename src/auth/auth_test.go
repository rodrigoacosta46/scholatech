package auth

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/nicolas-k-cmd/proj-redes/src/database"
	"github.com/nicolas-k-cmd/proj-redes/src/structs"
	"golang.org/x/crypto/bcrypt"
)

type RegisterTestCase struct {
	Name    string
	Struct  structs.RegisterRequest
	Message string
	Code    int
}

func TestRegisterAuthHandler(t *testing.T) {

	// Define datos de prueba
	newUser := structs.RegisterRequest{
		Username:  "Juan Osvaldo",
		Password:  "Password##123!",
		Gender:    "male",
		Role:      "1",
		Telephone: "123456789",
		Email:     "testuser@example.com",
		Birthdate: "2000-01-01",
	}
	newUserWrongUsername := newUser
	newUserWrongUsername.Username = "Juan"
	newUserWrongPassword := newUser
	newUserWrongPassword.Password = "123456780"
	newUserWrongGender := newUser
	newUserWrongGender.Gender = "AntiGenero"
	newUserWrongTelehpone := newUser
	newUserWrongTelehpone.Telephone = "123"
	newUserWrongEmail := newUser
	newUserWrongEmail.Email = "example"
	newUserWrongBirthdate := newUser
	newUserWrongBirthdate.Birthdate = "3000"
	testCases := map[string]RegisterTestCase{
		"newUser":               {Name: "newUser", Struct: newUser, Message: "Valid user details", Code: 201},
		"newUserWrongUsername":  {Name: "newUserWrongUsername", Struct: newUserWrongUsername, Message: "Username too short", Code: 400},
		"newUserWrongPassword":  {Name: "newUserWrongPassword", Struct: newUserWrongPassword, Message: "Password too weak", Code: 400},
		"newUserWrongGender":    {Name: "newUserWrongGender", Struct: newUserWrongGender, Message: "Invalid gender", Code: 400},
		"newUserWrongTelehpone": {Name: "newUserWrongTelehpone", Struct: newUserWrongTelehpone, Message: "Invalid phone number", Code: 400},
		"newUserWrongEmail":     {Name: "newUserWrongEmail", Struct: newUserWrongEmail, Message: "Invalid email format", Code: 400},
		"newUserWrongBirthdate": {Name: "newUserWrongBirthdate", Struct: newUserWrongBirthdate, Message: "Invalid birthdate (future date)", Code: 400},
	}

	// Iterar sobre el mapa y procesar cada caso de prueba
	for key, testCase := range testCases {
		// Imprimir los detalles del caso de prueba
		t.Logf("Processing Test Case: %s\n", key)
		t.Logf("Name: %s\n", testCase.Name)
		t.Logf("Struct: %+v\n", testCase.Struct)
		t.Logf("Message: %s\n", testCase.Message)
		t.Logf("Expected code: %v\n", testCase.Code)

		reqBody, _ := json.Marshal(testCase.Struct)
		req := httptest.NewRequest(http.MethodPost, "/registerauth", bytes.NewBuffer(reqBody))
		req.Header.Set("Content-Type", "application/json")

		w := httptest.NewRecorder()

		RegisterAuthHandler(w, req)
		if int(w.Code) != testCase.Code {
			t.Errorf("Expected status code %v, got %v", testCase.Code, w.Code)
		} else {
			t.Logf("SUCESSFULL")
		}
		t.Log("Test Case processed")
	}

	// Verifica si el usuario fue creado en la base de datos
	var user database.User
	err := database.Db.First(&user, "username = ?", newUser.Username).Error
	if err != nil {
		t.Fatalf("User was not created in the database: %v", err)
	}

	// Verifica si el hash de la contraseña fue generado
	if bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(newUser.Password)) != nil {
		t.Error("Password hash mismatch")
	}
}

const letterBytes = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

func randStringBytes(n int) string {
	// Usar el tiempo actual para generar una semilla pseudo-aleatoria
	currentTime := time.Now().UnixNano()

	b := make([]byte, n)
	for i := range b {
		// Usa la semilla para obtener un "número aleatorio" basado en el tiempo
		currentTime = (currentTime * 1664525) + 1013904223
		idx := int(currentTime % int64(len(letterBytes)))
		b[i] = letterBytes[idx]
	}
	return string(b)
}

func TestLoginAuthHandler(t *testing.T) {
	password := "Password##123!"
	username := randStringBytes(20)
	parsedDate, _ := time.Parse("2006-01-02", "2005-12-12")
	hash, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	user := database.User{
		Username:  username,
		Telephone: "5411 5050 0147",
		PerfilID:  1,
		Gender:    "male",
		Password:  string(hash),
		Email:     username + "@example.com",
		Birthdate: parsedDate,
	}
	database.Db.Create(&user)

	// Define datos de prueba
	loginReq := structs.LoginRequest{
		Username: username,
		Password: password,
	}

	reqBody, _ := json.Marshal(loginReq)
	req := httptest.NewRequest(http.MethodPost, "/loginauth", bytes.NewBuffer(reqBody))
	req.Header.Set("Content-Type", "application/json")

	// Simula un servidor
	w := httptest.NewRecorder()

	LoginAuthHandler(w, req)

	// Verifica el estado de respuesta
	if w.Code != http.StatusOK {
		t.Errorf("Expected status code 200, got %v", w.Code)
	}

	// Verifica si el mensaje de éxito fue retornado
	var resp structs.Response
	if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
		t.Errorf("Failed to parse response body: %v", err)
	}
	if resp.Message != "La autenticacion fue un exito" {
		t.Errorf("Unexpected message: %v", resp.Message)
	}
}

func BenchmarkLoginAuthHandlerParallel(b *testing.B) {
	// Prepara un usuario en la base de datos para las pruebas
	password := "Password##123!"
	username := "ParallelUser"
	hash, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

	user := database.User{
		Username:  username,
		Password:  string(hash),
		Email:     "paralleluser@example.com",
		Birthdate: time.Now(),
		PerfilID:  1,
		Gender:    "male",
		Telephone: "5411 5050 0147",
	}
	database.Db.Create(&user)

	reqBody, _ := json.Marshal(structs.LoginRequest{
		Username: username,
		Password: password,
	})

	b.ResetTimer()

	b.RunParallel(func(pb *testing.PB) {
		for pb.Next() {
			req := httptest.NewRequest(http.MethodPost, "/loginauth", bytes.NewBuffer(reqBody))
			req.Header.Set("Content-Type", "application/json")

			w := httptest.NewRecorder()
			LoginAuthHandler(w, req)

			// Verifica el código de estado
			if w.Code != http.StatusOK && w.Code != http.StatusUnauthorized {
				b.Fatalf("Unexpected status code: %v", w.Code)
			}
		}
	})
}
