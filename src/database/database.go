package database

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"math/rand"
	"os"
	"reflect"
	"time"

	"github.com/go-faker/faker/v4"
	"github.com/nicolas-k-cmd/proj-redes/src/env"
	redis "github.com/redis/go-redis/v9"
	"gorm.io/driver/mysql"
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
	Gender      string     `gorm:"type:enum('male','female','another');not null" faker:"oneof:male,female,another"`
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
	Estado     string     `gorm:"type:enum('accepted','closed','pending');not null"`
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
	ID         int        `gorm:"primaryKey"`
	UsuarioID  int        `gorm:"not null"`
	Title      string     `gorm:"type:text;not null"`
	Mensaje    string     `gorm:"type:text;not null"`
	FechaEnvio time.Time  `gorm:"type:datetime;not null"`
	Estado     string     `gorm:"type:enum('pendiente','leido','enviado');not null"`
	CreatedAt  time.Time  `gorm:"type:datetime;not null"`
	UpdatedAt  *time.Time `gorm:"type:datetime"`
	DeletedAt  *time.Time `gorm:"type:datetime"`
}

type Perfil struct {
	ID          int        `gorm:"primaryKey"`
	Name        string     `gorm:"size:50;not null"`
	Description *string    `gorm:"size:50"`
	CreatedAt   time.Time  `gorm:"type:datetime;not null"`
	UpdatedAt   *time.Time `gorm:"type:datetime"`
	DeletedAt   *time.Time `gorm:"type:datetime"`
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
	fmt.Println("BOOTING UP DATABASE SERVICE....")
	var err error
	Db, err = gorm.Open(mysql.Open("root@tcp(localhost:3306)/scholaTech26GORM?charset=utf8mb4&parseTime=True&loc=UTC"), &gorm.Config{})
	if err != nil {
		fmt.Println("FATAL: No se pudo conectar a la base de datos")
		panic(err)
	}
	err = Db.AutoMigrate(&User{}, &Turno{}, &Historial{}, &Medicamento{}, &Notificacion{}, &Perfil{}, &Receta{})
	if err != nil {
		fmt.Println("A FATAL ERROR OCURRED WHILE MIGRATING DATABASE")
		panic(err)
	}
	Db.Model(&Perfil{}).Count(&count)

	if count == 0 {
		fmt.Println("Looks like the profile records are not inserted")
		perfiles := []Perfil{
			{ID: 1, Name: "Paciente"},
			{ID: 2, Name: "Doctor"},
			{ID: 3, Name: "Admin"},
		}
		// Intentar insertar los perfiles
		if errorInsert := Db.Create(&perfiles).Error; errorInsert != nil {
			fmt.Printf("Couldn't add new entries to the profiles: %v\n", errorInsert)
			panic(errorInsert)
		} else {
			fmt.Println("Profile records inserted successfully")
		}
	} else {
		fmt.Println("Profile records already exist")
	}
	count = 0
	if env.SEED_DRUGS == 1 {
		SeedDrugs()
	}
	count = 0
	if env.ENABLE_FAKER == 1 {
		count = 0
		fmt.Println("DATABASE FAKER IS ENABLED, SEEDING THE DATABASE....")
		fmt.Println()
		result, err := callFuncSeeder(env.FAKER_DOCTOR, UserFaker, 2, env.FAKER_DOCTOR_TOTAL, true)
		if result == false {
			fmt.Println("FAKER DOCTOR IS DISABLED")
		} else if err != nil {
			fmt.Println("Error while calling the Faker doctor")
			panic(err)
		}
		result, err = callFuncSeeder(env.FAKER_PATIENT, UserFaker, 1, env.FAKER_PATIENT_TOTAL, true)
		if result == false {
			fmt.Println("FAKER PATIENT IS DISABLED")
		} else if err != nil {
			fmt.Println("Error while calling the Faker patient")
			panic(err)
		}
		result, err = callFuncSeeder(env.FAKER_TURNOS, TurnosFaker, env.FAKER_TURNOS_TOTAL, env.FAKER_DOCTOR_TOTAL, env.FAKER_PATIENT_TOTAL, true)
		if result == false {
			fmt.Println("FAKER TURNOS IS DISABLED")
		} else if err != nil {
			fmt.Println("Error while calling the Faker turnos")
			panic(err)
		}
	}
	redisService()
}

func redisService() {
	Ctx = context.Background()
	Client = redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
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
		fmt.Printf("Error al conectar a Redis: %v\n", err)
		os.Exit(1) // Salir si no se puede conectar
	} else {
		fmt.Println("Conexión a Redis establecida exitosamente")
	}
	err = Client.Set(Ctx, "DATABASE_MIGRATION_TIMESTAMP", "UNDEFINED", 0).Err()
	if err != nil {
		panic(err)
	}
	val, err := Client.Get(Ctx, "DATABASE_MIGRATION_TIMESTAMP").Result()
	if err != nil {
		panic(err)
	}
	fmt.Println("DATABASE_MIGRAITON_TIMESTAMP", val)

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
		fmt.Println("Looks like the drug records are not inserted")
		path := "./config/drugs.json"
		file, err := os.Open(path)

		if err != nil {
			fmt.Println("FATAL: Could not open json drugs file")
			panic(err)
		}

		defer file.Close()

		data, err := io.ReadAll(file)
		if err != nil {
			fmt.Println("FATAL: Could not read json drugs file")
			panic(err)
		}

		var drugs []Medicamento

		if err := json.Unmarshal(data, &drugs); err != nil {
			fmt.Println("FATAL: Failed to format json")
			panic(err)
		}
		if errorInsert := Db.Omit("CreatedAt", "UpdatedAt", "DeletedAt").Create(&drugs).Error; errorInsert != nil {
			fmt.Printf("Couldn't add new entries to drugs: %v\n", errorInsert)
			panic(errorInsert)
		} else {
			fmt.Println("Drug records inserted successfully")
		}
	} else {
		fmt.Println("Drug records already exist")
	}
}

func UserFaker(ProfileID int, number int, checkOcurrences bool) {
	if checkOcurrences {
		fmt.Println("Verifying ocurrences...")
		if err := Db.Model(&User{}).Where("perfil_id = ?", ProfileID).Count(&count).Error; err != nil {
			fmt.Printf("Failed to count the ProfileID %v entries", ProfileID)
			panic(err)
		} else {
			fmt.Println("Number of entries in the users table: ", count)
			if count < int64(number) {
				fmt.Printf("Looks like there isnt enought ProfileID %v in the database assuming the number of entries is lower that the total of ProfileID requested. Inserting entries...", ProfileID)
			} else {
				fmt.Printf("Im assumming we already have the ProfileID %v inserted by the number of User entries", ProfileID)
				return
			}
		}
	}
	tx := Db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
			fmt.Println("Failed trasaction:", r)
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
			fmt.Println("Failed to create the user:", err)
			return
		}
	}

	if err := tx.Commit().Error; err != nil {
		fmt.Println("Failed to commit userst:", err)
	}
}

func randomNumber(max int) int {
	rand.Seed(time.Now().UnixNano())

	var n int = max
	randomNumber := rand.Intn(n) + 1
	//fmt.Printf("Numero aleatorio entre 1 y %d: %d\n", n, randomNumber)
	return randomNumber
}

func TurnosFaker(number int, maxDoctors int, maxPatients int, checkOcurrences bool) {
	var count int64
	if checkOcurrences {
		fmt.Println("Verifying ocurrences...")
		if err := Db.Model(&Turno{}).Count(&count).Error; err != nil {
			fmt.Printf("Failed to count the Turnos entries")
			panic(err)
		} else {
			fmt.Println("Number of entries in the turnos table: ", count)
			if count < int64(number) {
				fmt.Printf("Looks like there isnt enought turnos the database assuming the number of entries is lower that the total of turnos requested. Inserting entries...")
			} else {
				fmt.Printf("Im assumming we already have the turnos inserted by the number of turnos entries %v", count)
				return
			}
		}
	}
	var TotalPatients int64
	var TotalDoctors int64
	err := Db.Model(User{}).Where("perfil_id = 1").Count(&TotalPatients).Error
	if err != nil {
		fmt.Println("FATAL ERROR WHILE COUNTING THE TOTAL OF PATIENTS FOR ASSIGMENTS SEEDING")
		panic(err)
	}
	err = Db.Model(User{}).Where("perfil_id = 2").Count(&TotalDoctors).Error
	if err != nil {
		fmt.Println("FATAL ERROR WHILE COUNTING THE TOTAL OF DOCTORS FOR ASSIGMENTS SEEDING")
		panic(err)
	}
	fmt.Printf("Total doctors %v", TotalDoctors)
	fmt.Printf("Total patients %v", TotalPatients)
	if (TotalDoctors >= int64(maxDoctors)) && (int64(maxPatients) <= TotalPatients) {
		tx := Db.Begin()
		defer func() {
			if r := recover(); r != nil {
				tx.Rollback()
				fmt.Println("Failed trasaction:", r)
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
				fmt.Println("AN ERROR OCURRED WHILE PARSING A FAKE DATE FOR ASSIGMENTS")
			}
			turnoStruct := Turno{
				DoctorID:   randomNumber(int(TotalDoctors)),
				PacienteID: randomNumber(int(TotalPatients)),
				Fecha:      &parsedDate,
				Motivo:     (faker.Paragraph())[:20],
				Estado:     statuses[(randomNumber(len(statuses)))-1],
			}
			if err = tx.Create(&turnoStruct).Error; err != nil {
				tx.Rollback()
				fmt.Println("Failed to create the assigment:", err)
				return
			}
		}
		if err := tx.Commit().Error; err != nil {
			fmt.Println("Failed to commit turrnos:", err)
		}
		fmt.Println("Assigments created successfuly")
	} else {
		fmt.Println("Cantidad de usuarios y doctores insuficientes para crear los turnos")
	}

}
