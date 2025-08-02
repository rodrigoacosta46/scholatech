package database

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"math/rand"
	"os"
	"reflect"
	"time"

	"github.com/go-faker/faker/v4"
	"github.com/nicolas-k-cmd/proj-redes/src/env"
	redis "github.com/redis/go-redis/v9"
	"gorm.io/driver/mysql"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var count int64

/*
Database structures

The ORM will automigrate and generate the tables acording to the structs and its data types.
If a record is retrieved from the database, the corresponding structure will be used for it.
*/
type User struct {
	ID          int        `gorm:"primaryKey" faker:"-"`
	Username    string     `gorm:"size:50;not null" faker:"username"`
	Email       string     `gorm:"size:100;not null" faker:"email"`
	Password    string     `gorm:"size:128;not null" faker:"password"`
	Description string     `gorm:"size:400" faker:"sentence"`
	Telephone   string     `gorm:"size:50" faker:"phone_number"`
	Address     string     `gorm:"size:100" faker:"address"`
	Speciality  string     `gorm:"size:100" faker:"word"`
	Gender      string     `gorm:"type:text;not null"`
	Birthdate   time.Time  `gorm:"type:date;not null" faker:"date"`
	CreatedAt   time.Time  `gorm:"type:datetime;not null" faker:"-"`
	UpdatedAt   *time.Time `gorm:"type:datetime" faker:"-"`
	DeletedAt   *time.Time `gorm:"type:datetime" faker:"-"`
	PerfilID    int        `gorm:"not null"`
	Perfil      Perfil     `gorm:"foreignKey:PerfilID;" faker:"-"`
}

type Turno struct {
	ID         int        `gorm:"primaryKey"`
	DoctorID   int        `gorm:"not null"`
	PacienteID int        `gorm:"not null"`
	Fecha      *time.Time `gorm:"type:datetime"`
	Motivo     string     `gorm:"size:50;not null"`
	Notas      string     `gorm:"type:text;not null"`
	Estado     string     `gorm:"type:text; not null"`
	CreatedAt  time.Time  `gorm:"type:datetime;not null"`
	UpdatedAt  *time.Time `gorm:"type:datetime"`
	DeletedAt  *time.Time `gorm:"type:datetime"`
	Doctor     User       `gorm:"foreignKey:DoctorID;" faker:"-"`
	Paciente   User       `gorm:"foreignKey:PacienteID;" faker:"-"`
}

type Historial struct {
	ID          int        `gorm:"primaryKey"`
	TurnoID     int        `gorm:"not null"`
	Diagnostico string     `gorm:"type:text;not null"`
	Tratamiento string     `gorm:"type:text;not null"`
	Notas       string     `gorm:"type:text;not null"`
	CreatedAt   time.Time  `gorm:"type:datetime;not null"`
	UpdatedAt   *time.Time `gorm:"type:datetime"`
	DeletedAt   *time.Time `gorm:"type:datetime"`
	Turno       Turno      `gorm:"foreignKey:TurnoID;" faker:"-"`
	Recetas     []Receta   `gorm:"foreignKey:HistorialID"`
}

type Receta struct {
	ID            int         `gorm:"primaryKey"`
	HistorialID   int         `gorm:"not null"`
	MedicamentoID int         `gorm:"not null"`
	Cantidad      float32     `gorm:"not null"`
	Tomas         string      `gorm:"not null"`
	CreatedAt     time.Time   `gorm:"type:datetime;not null"`
	UpdatedAt     *time.Time  `gorm:"type:datetime"`
	DeletedAt     *time.Time  `gorm:"type:datetime"`
	Historial     Historial   `gorm:"foreignKey:HistorialID;" faker:"-"`
	Medicamento   Medicamento `gorm:"foreignKey:MedicamentoID;" faker:"-"`
}

type Medicamento struct {
	ID          int        `gorm:"primaryKey"`
	Nombre      string     `gorm:"size:100;not null"`
	Descripcion string     `gorm:"type:text;not null"`
	CreatedAt   time.Time  `gorm:"type:datetime;not null;default:CURRENT_TIMESTAMP"`
	UpdatedAt   *time.Time `gorm:"type:datetime"`
	DeletedAt   *time.Time `gorm:"type:datetime"`
}

type Notificacion struct {
	ID         int       `gorm:"primaryKey"`
	UsuarioID  int       `gorm:"not null"`
	Title      string    `gorm:"type:text;not null"`
	Mensaje    string    `gorm:"type:text;not null"`
	FechaEnvio time.Time `gorm:"type:datetime;not null"`
	Estado     string    `gorm:"type:text;not null"`
	//Estado     string     `gorm:"type:enum('pendiente','leido','enviado');not null"`
	CreatedAt time.Time  `gorm:"type:datetime;not null"`
	UpdatedAt *time.Time `gorm:"type:datetime"`
	DeletedAt *time.Time `gorm:"type:datetime"`
	User      User       `gorm:"foreignKey:UsuarioID;" faker:"-"`
}

type Perfil struct {
	ID          int        `gorm:"primaryKey"`
	Name        string     `gorm:"size:50;not null"`
	Description *string    `gorm:"size:50"`
	CreatedAt   time.Time  `gorm:"type:datetime;not null"`
	UpdatedAt   *time.Time `gorm:"type:datetime"`
	DeletedAt   *time.Time `gorm:"type:datetime"`
}

func (u *User) BeforeSave(tx *gorm.DB) error {
	switch u.Gender {
	case "male", "female", "other":
		log.Printf("Genero valido para el cambio %s", u.Gender)
		return nil
	default:
		return fmt.Errorf("invalid gender value: %s", u.Gender)
	}
}
func (u *Turno) BeforeSave(tx *gorm.DB) (err error) {
	if u.Estado != "accepted" && u.Estado != "closed" && u.Estado != "pending" {
		return fmt.Errorf("invalid turno value %s", u.Estado)
	}
	return nil
}

func (u *Notificacion) BeforeSave(tx *gorm.DB) (err error) {
	if u.Estado != "pendiente" && u.Estado != "leido" && u.Estado != "enviado" {
		return fmt.Errorf("invalid notificacion estado value %s", u.Estado)
	}
	return nil
}

/*
type Rol struct {
	ID        int        `gorm:"primaryKey"`
	UsuarioID int        `gorm:"not null"`
	Usuario   User       `gorm:"foreignKey:UsuarioID;"` // Relación hasOne
	PerfilID  int        `gorm:"not null"`
	Perfil    Perfil     `gorm:"foreignKey:PerfilID"` // Define HasOne relationship
	CreatedAt time.Time  `gorm:"type:datetime;not null"`
	UpdatedAt *time.Time `gorm:"type:datetime"`
	DeletedAt *time.Time `gorm:"type:datetime"`
}
*/

var Db *gorm.DB

var Ctx context.Context

var Client *redis.Client

/*
This function runs automatically when importing the package
and is responsible for the orchestration, execution and migration
of the database. In case of failure, it will throw a panic error.
*/
func init() {
	log.Println("BOOTING UP DATABASE SERVICE....")
	var err error
	if os.Getenv("APP_ENV") == "testing" {
		log.Println("Testing environment detected, skipping Redis database connection and storing DB in memory...")
		Db, err = gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{})
	} else {
		redisService()
		Db, err = gorm.Open(mysql.Open("root@tcp("+env.DB_ADDRESS+":3306)/scholaTech26GORM?charset=utf8mb4&parseTime=True&loc=UTC"), &gorm.Config{})
	}
	if err != nil {
		log.Println("FATAL: No se pudo conectar a la base de datos")
		panic(err)
	}
	err = Db.AutoMigrate(&User{}, &Turno{}, &Historial{}, &Medicamento{}, &Notificacion{}, &Perfil{}, &Receta{})
	if err != nil {
		log.Println("A FATAL ERROR OCURRED WHILE MIGRATING DATABASE")
		panic(err)
	}
	Db.Model(&Perfil{}).Count(&count)

	if count == 0 {
		log.Println("Looks like the profile records are not inserted")
		perfiles := []Perfil{
			{ID: 1, Name: "Paciente"},
			{ID: 2, Name: "Doctor"},
			{ID: 3, Name: "Admin"},
		}
		// Intentar insertar los perfiles
		if errorInsert := Db.Create(&perfiles).Error; errorInsert != nil {
			log.Printf("Couldn't add new entries to the profiles: %v\n", errorInsert)
			panic(errorInsert)
		} else {
			log.Println("Profile records inserted successfully")
		}
	} else {
		log.Println("Profile records already exist")
	}
	count = 0
	if env.SEED_DRUGS == 1 {
		SeedDrugs()
	}
	count = 0
	if env.ENABLE_FAKER == 1 {
		count = 0
		log.Println("DATABASE FAKER IS ENABLED, SEEDING THE DATABASE....")
		log.Println()
		result, err := callFuncSeeder(env.FAKER_DOCTOR, UserFaker, 2, env.FAKER_DOCTOR_TOTAL, true)
		if result == false {
			log.Println("FAKER DOCTOR IS DISABLED")
		} else if err != nil {
			log.Println("Error while calling the Faker doctor")
			panic(err)
		}
		result, err = callFuncSeeder(env.FAKER_PATIENT, UserFaker, 1, env.FAKER_PATIENT_TOTAL, true)
		if result == false {
			log.Println("FAKER PATIENT IS DISABLED")
		} else if err != nil {
			log.Println("Error while calling the Faker patient")
			panic(err)
		}
		result, err = callFuncSeeder(env.FAKER_TURNOS, TurnosFaker, env.FAKER_TURNOS_TOTAL, env.FAKER_DOCTOR_TOTAL, env.FAKER_PATIENT_TOTAL, true)
		if result == false {
			log.Println("FAKER TURNOS IS DISABLED")
		} else if err != nil {
			log.Println("Error while calling the Faker turnos")
			panic(err)
		}
		result, err = callFuncSeeder(env.FAKER_HISTORIAL_TURNOS_CLOSED, HistorialFaker, true)
		if result == false {
			log.Println("FAKER HISTORIAL IS DISABLED")
		} else if err != nil {
			log.Println("Error while calling the Faker Historial")
			panic(err)
		}
	}
}

func redisService() {
	Ctx = context.Background()
	Client = redis.NewClient(&redis.Options{
		Addr:     env.REDIS_ADDRESS + ":6379",
		Password: "", // No password set
		DB:       0,  // Use default DB
		Protocol: 2,  // Connection protocol
	})
	if Client == nil {
		panic("Nil client")
	}
	// Verificar la conexión
	_, err := Client.Ping(Ctx).Result()
	if err != nil {
		log.Printf("Error al conectar a Redis: %v\n", err)
		os.Exit(1) // Salir si no se puede conectar
	} else {
		log.Println("Conexión a Redis establecida exitosamente")
	}
	err = Client.Set(Ctx, "DATABASE_MIGRATION_TIMESTAMP", "UNDEFINED", 0).Err()
	if err != nil {
		panic(err)
	}
	val, err := Client.Get(Ctx, "DATABASE_MIGRATION_TIMESTAMP").Result()
	if err != nil {
		panic(err)
	}
	log.Println("DATABASE_MIGRAITON_TIMESTAMP", val)

}

func callFuncSeeder(enabler int, fn interface{}, params ...interface{}) (interface{}, error) {
	if enabler != 1 {
		return false, nil
	}

	v := reflect.ValueOf(fn)
	if v.Kind() != reflect.Func {
		return nil, fmt.Errorf("first argument must be a value")
	}

	in := make([]reflect.Value, len(params))
	for i, param := range params {
		in[i] = reflect.ValueOf(param)
	}
	result := v.Call(in)

	if len(result) == 0 {
		return nil, nil
	}
	return result[0].Interface(), nil
}

func SeedDrugs() {

	Db.Model(&Medicamento{}).Count(&count)

	if count == 0 {
		log.Println("Looks like the drug records are not inserted")
		path := env.RealPath + "/config/drugs.json"
		file, err := os.Open(path)

		if err != nil {
			log.Println("FATAL: Could not open json drugs file")
			panic(err)
		}

		defer file.Close()

		data, err := io.ReadAll(file)
		if err != nil {
			log.Println("FATAL: Could not read json drugs file")
			panic(err)
		}

		var drugs []Medicamento

		if err := json.Unmarshal(data, &drugs); err != nil {
			log.Println("FATAL: Failed to format json")
			panic(err)
		}
		if errorInsert := Db.Omit("CreatedAt", "UpdatedAt", "DeletedAt").Create(&drugs).Error; errorInsert != nil {
			log.Printf("Couldn't add new entries to drugs: %v\n", errorInsert)
			panic(errorInsert)
		} else {
			log.Println("Drug records inserted successfully")
		}
	} else {
		log.Println("Drug records already exist")
	}
}

func UserFaker(ProfileID int, number int, checkOcurrences bool) {
	if checkOcurrences {
		log.Println("Verifying ocurrences...")
		if err := Db.Model(&User{}).Where("perfil_id = ?", ProfileID).Count(&count).Error; err != nil {
			log.Printf("Failed to count the ProfileID %v entries", ProfileID)
			panic(err)
		} else {
			log.Println("Number of entries in the users table: ", count)
			if count < int64(number) {
				log.Printf("Looks like there isnt enought ProfileID %v in the database assuming the number of entries is lower that the total of ProfileID requested. Inserting entries...", ProfileID)
			} else {
				log.Printf("Im assumming we already have the ProfileID %v inserted by the number of User entries", ProfileID)
				return
			}
		}
	}
	tx := Db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
			log.Println("Failed trasaction:", r)
		}
	}()

	for i := 0; i < number; i++ {
		date, _ := time.Parse("2006-01-02", faker.Date())
		userStruct := User{
			Username:    faker.FirstName() + " " + faker.LastName(),
			Email:       faker.Email(),
			Description: faker.Sentence(),
			Telephone:   faker.Phonenumber(),
			Address:     faker.ChineseFirstName(),
			Speciality:  "Neurologia",
			Gender:      "male",
			Birthdate:   date,
			PerfilID:    ProfileID,
		}
		if err := tx.Create(&userStruct).Error; err != nil {
			tx.Rollback()
			log.Println("Failed to create the user:", err)
			return
		}
	}

	if err := tx.Commit().Error; err != nil {
		log.Println("Failed to commit userst:", err)
	}
}

func randomNumber(start int, max int) int {
	rand.Seed(time.Now().UnixNano())

	var n int = max
	randomNumber := rand.Intn(n) + start
	//log.Printf("Numero aleatorio entre 1 y %d: %d\n", n, randomNumber)
	return randomNumber
}

func TurnosFaker(number int, maxDoctors int, maxPatients int, checkOcurrences bool) {
	log.Println("TURNOS FAKER IS ENABLED, CHECKING...")
	var count int64
	if checkOcurrences {
		log.Println("Verifying ocurrences...")
		if err := Db.Model(&Turno{}).Count(&count).Error; err != nil {
			log.Printf("Failed to count the Turnos entries")
			panic(err)
		} else {
			log.Println("Number of entries in the turnos table: ", count)
			if count < int64(number) {
				log.Printf("Looks like there isnt enought turnos the database assuming the number of entries is lower that the total of turnos requested. Inserting entries...")
			} else {
				log.Printf("Im assumming we already have the turnos inserted by the number of turnos entries %v", count)
				return
			}
		}
	}
	var TotalPatients int64
	var TotalDoctors int64
	err := Db.Model(User{}).Where("perfil_id = 1").Count(&TotalPatients).Error
	if err != nil {
		log.Println("FATAL ERROR WHILE COUNTING THE TOTAL OF PATIENTS FOR ASSIGMENTS SEEDING")
		panic(err)
	}
	err = Db.Model(User{}).Where("perfil_id = 2").Count(&TotalDoctors).Error
	if err != nil {
		log.Println("FATAL ERROR WHILE COUNTING THE TOTAL OF DOCTORS FOR ASSIGMENTS SEEDING")
		panic(err)
	}
	log.Printf("Total doctors %v", TotalDoctors)
	log.Printf("Total patients %v", TotalPatients)
	if (TotalDoctors >= int64(maxDoctors)) && (int64(maxPatients) <= TotalPatients) {
		tx := Db.Begin()
		defer func() {
			if r := recover(); r != nil {
				tx.Rollback()
				log.Println("Failed trasaction:", r)
			}
		}()
		statuses := []string{"accepted", "closed", "pending"}
		for i := 0; i < number; i++ {

			dateString := faker.Date()

			// Definir el formato de la fecha generada por faker (YYYY-MM-DD HH:MM:SS)
			layout := "2006-01-02" // Formato común en faker.Date()

			// Parsear la fecha de string a time.Time
			parsedDate, err := time.Parse(layout, dateString)
			if err != nil {
				log.Println("AN ERROR OCURRED WHILE PARSING A FAKE DATE FOR ASSIGMENTS")
			}
			turnoStruct := Turno{
				DoctorID:   randomNumber(1, int(TotalDoctors)),
				PacienteID: randomNumber(201, int(TotalPatients)),
				Fecha:      &parsedDate,
				Motivo:     (faker.Paragraph())[:20],
				Estado:     statuses[(randomNumber(0, len(statuses)))],
			}
			if err = tx.Create(&turnoStruct).Error; err != nil {
				tx.Rollback()
				log.Println("Failed to create the assigment:", err)
				return
			}
		}
		if err := tx.Commit().Error; err != nil {
			log.Println("Failed to commit turnos:", err)
		}
		log.Println("Assigments created successfuly")
	} else {
		log.Println("Cantidad de usuarios y doctores insuficientes para crear los turnos")
	}

}

func HistorialFaker(checkOcurrences bool) {
	log.Println("HISTORIAL FAKER IS ENABLED, CHECKING...")
	if checkOcurrences {
		var turnosSinHistorial []Turno
		err := Db.Model(&Turno{}).
			Where("estado = ?", "closed").
			Where("id NOT IN (SELECT turno_id FROM historials)").
			Find(&turnosSinHistorial).Error
		if err != nil {
			log.Println("Error al verificar turnos sin historial")
			panic(err)
		}
		if len(turnosSinHistorial) == 0 {
			log.Println("No hay turnos cerrados sin historial")
			return
		} else {
			log.Println("Turnos cerrados sin historial encontrados:", len(turnosSinHistorial))
		}
	}
	var turnosCerrados []Turno
	err := Db.Model(&Turno{}).Where("estado = ?", "closed").Find(&turnosCerrados).Error
	if err != nil {
		log.Println("Error al obtener turnos cerrados")
		panic(err)
	}
	tx := Db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
			log.Println("Failed trasaction:", r)
		}
	}()
	for _, turno := range turnosCerrados {
		historial := Historial{
			TurnoID:     turno.ID,
			Diagnostico: (faker.Paragraph())[:20],
			Tratamiento: (faker.Paragraph())[:20],
			Notas:       (faker.Paragraph())[:20],
		}

		if err = tx.Create(&historial).Error; err != nil {
			tx.Rollback()
			log.Println("Failed to create the historial:", err)
			return
		}
	}
	if err := tx.Commit().Error; err != nil {
		log.Println("Failed to commit historial:", err)
	}
}
