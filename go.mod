module github.com/nicolas-k-cmd/proj-redes

go 1.22.5

require github.com/go-sql-driver/mysql v1.8.1 // direct

require (
	github.com/go-chi/httprate v0.14.1
	github.com/go-faker/faker/v4 v4.5.0
	github.com/golang-jwt/jwt/v5 v5.2.1
	github.com/gorilla/mux v1.8.1
	github.com/gorilla/sessions v1.3.0
	github.com/joho/godotenv v1.5.1
	github.com/redis/go-redis/v9 v9.7.0
	github.com/ua-parser/uap-go v0.0.0-20240611065828-3a4781585db6
	golang.org/x/crypto v0.26.0
	gorm.io/driver/mysql v1.5.7
	gorm.io/gorm v1.25.12
)

require github.com/mattn/go-sqlite3 v1.14.22 // indirect

require (
	filippo.io/edwards25519 v1.1.0 // indirect
	github.com/cespare/xxhash/v2 v2.3.0 // indirect
	github.com/dgryski/go-rendezvous v0.0.0-20200823014737-9f7001d12a5f // indirect
	github.com/gorilla/securecookie v1.1.2 // indirect
	github.com/hashicorp/golang-lru v0.5.4 // indirect
	github.com/jinzhu/inflection v1.0.0 // indirect
	github.com/jinzhu/now v1.1.5 // indirect
	golang.org/x/text v0.19.0 // indirect
	gopkg.in/yaml.v2 v2.2.1 // indirect
	gorm.io/driver/sqlite v1.5.6
)
