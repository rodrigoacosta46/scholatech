package database

import (
	"fmt"
	"time"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

/*
Database structures

The ORM will automigrate and generate the tables acording to the structs and its data types.
If a record is retrieved from the database, the corresponding structure will be used for it.
*/
type User struct {
	ID         int        `gorm:"primaryKey"`
	Username   string     `gorm:"size:50;not null"`
	Email      string     `gorm:"size:100;not null"`
	Password   string     `gorm:"size:128;not null"`
	Telephone  *string    `gorm:"size:50"`
	Address    *string    `gorm:"size:100"`
	Speciality *string    `gorm:"size:100"`
	Gender     string     `gorm:"type:enum('male','female','another');not null"`
	Birthdate  time.Time  `gorm:"type:date;not null"`
	CreatedAt  time.Time  `gorm:"type:datetime;not null"`
	UpdatedAt  *time.Time `gorm:"type:datetime"`
	DeletedAt  *time.Time `gorm:"type:datetime"`
	PerfilID   int        `gorm:"not null"`
	Perfil     Perfil     `gorm:"foreignKey:PerfilID;"` // Relación hasOne
}

type Turno struct {
	ID         int        `gorm:"primaryKey"`
	DoctorID   int        `gorm:"not null"`
	PacienteID int        `gorm:"not null"`
	Fecha      time.Time  `gorm:"type:date;not null"`
	Hora       time.Time  `gorm:"type:time;not null"`
	Motivo     string     `gorm:"size:50;not null"`
	Notas      string     `gorm:"type:text;not null"`
	CreatedAt  time.Time  `gorm:"type:datetime;not null"`
	UpdatedAt  *time.Time `gorm:"type:datetime"`
	DeletedAt  *time.Time `gorm:"type:datetime"`
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
}

type Medicamento struct {
	ID          int        `gorm:"primaryKey"`
	Nombre      string     `gorm:"size:100;not null"`
	Descripcion string     `gorm:"type:text;not null"`
	Imagen      string     `gorm:"type:text;not null"`
	CreatedAt   time.Time  `gorm:"type:datetime;not null"`
	UpdatedAt   *time.Time `gorm:"type:datetime"`
	DeletedAt   *time.Time `gorm:"type:datetime"`
}

type Notificacion struct {
	ID         int        `gorm:"primaryKey"`
	UsuarioID  int        `gorm:"not null"`
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
	ID            int        `gorm:"primaryKey"`
	HistorialID   int        `gorm:"not null"`
	MedicamentoID int        `gorm:"not null"`
	CreatedAt     time.Time  `gorm:"type:datetime;not null"`
	UpdatedAt     *time.Time `gorm:"type:datetime"`
	DeletedAt     *time.Time `gorm:"type:datetime"`
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

/*
This function runs automatically when importing the package
and is responsible for the orchestration, execution and migration
of the database. In case of failure, it will throw a panic error.
*/
func init() {
	fmt.Println("BOOTING UP DATABASE SERVICE....")
	var err error
	Db, err = gorm.Open(mysql.Open("root@tcp(localhost:3306)/scholaTech26GORM?charset=utf8mb4&parseTime=True&loc=Local"), &gorm.Config{})
	if err != nil {
		fmt.Println("FATAL: No se pudo conectar a la base de datos")
		panic(err)
	}
	err = Db.AutoMigrate(&User{}, &Turno{}, &Historial{}, &Medicamento{}, &Notificacion{}, &Perfil{}, &Receta{})
	if err != nil {
		fmt.Println("A FATAL ERROR OCURRED WHILE MIGRATING DATABASE")
		panic(err)
	}
	
	var count int64
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
	/*
	perfiles := []Perfil{
		{ID: 1, Name: "Paciente"},
		{ID: 2, Name: "Doctor"},
		{ID: 3, Name: "Admin"},
	}
	err = Db.Find(&perfiles).Error
	if err == gorm.ErrRecordNotFound {
		fmt.Println("Looks like the profile records are not inserted")
		if errorInsert := Db.Create(&perfiles).Error; errorInsert != nil {
			if errorInsert == gorm.ErrDuplicatedKey {
				fmt.Println("We didnt add the profiles because they already exists")
			} else {
				fmt.Println("Couldnt add new entries to the profiles, it may be that the entries already exists?")
				panic(errorInsert)
			}
		}
	}
	*/
}
