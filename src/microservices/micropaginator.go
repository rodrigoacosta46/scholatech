package microservices

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/nicolas-k-cmd/proj-redes/src/database"
	"github.com/nicolas-k-cmd/proj-redes/src/env"
	"github.com/nicolas-k-cmd/proj-redes/src/structs"
	redis "github.com/redis/go-redis/v9"
	"gorm.io/gorm"
)

type ServePaginationResponse struct {
	Object string `json:"object"`
	Total  int    `json:"total"`
}

type PaginationRequest struct {
	Page   int
	Search *string
}

type ClosureStruct struct {
	structParser    interface{}
	command         *gorm.DB
	operation       string
	requestedBy     string
	SearchableEntry string
	AllowLike       bool
}

var LIMIT_PAGE int = 10

func SampleClosure(input ClosureStruct, req PaginationRequest) func() (ServePaginationResponse, bool) {
	return func() (ServePaginationResponse, bool) {
		var spr ServePaginationResponse
		spr.Object = ""
		spr.Total = 0
		from := ((req.Page - 1) * LIMIT_PAGE)
		var totalPages int64
		var err error
		err = input.command.Count(&totalPages).Error
		if err != nil {
			log.Println("Error al ejecutar la closure4", err)
			return spr, false
		}
		if input.AllowLike && req.Search != nil {
			searchTerm := "%" + *req.Search + "%"
			input.command = input.command.Where(input.SearchableEntry+" LIKE ?", searchTerm)
		}

		input.command = input.command.Offset(from).Limit(LIMIT_PAGE)
		switch input.operation {
		case "Find":
			err = input.command.Find(&input.structParser).Error
			//resultDebug := input.command.Debug().Find(&input.structParser)
			//log.Println(resultDebug.Statement.SQL.String())
			//err = nil
		case "First":
			err = input.command.First(&input.structParser).Error
		case "Last":
			err = input.command.Offset(from).Last(&input.structParser).Error
		case "Scan":
			err = input.command.Scan(&input.structParser).Error
		}
		if err != nil {
			log.Println("Error al ejecutar la closure", err)
			return spr, false
		} else {
			spr.Total = int(totalPages)
			formattedField, _ := json.Marshal(&input.structParser)
			spr.Object = string(formattedField)
			return spr, true
		}

	}
}

func MicroPagination(w http.ResponseWriter, r *http.Request, input ClosureStruct, StoreRedis bool) (ServePaginationResponse, bool) {
	var req PaginationRequest
	decoder := json.NewDecoder(r.Body)
	defer r.Body.Close()
	if err := decoder.Decode(&req); err != nil {
		log.Printf("Error al decodificar JSON en paginacion: %v\n", err)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(structs.Response{Message: "Solicitud JSON Invalida"})
		return ServePaginationResponse{}, false
	}
	var CacheKeywords string
	if req.Search != nil {
		CacheKeywords = *req.Search
	} else {
		CacheKeywords = env.CACHE_NO_ISSUER
	}
	cacheKey := fmt.Sprintf("pagination:%s:%s:%d", input.requestedBy, CacheKeywords, req.Page)
	if os.Getenv("APP_ENV") == "testing" && StoreRedis {
		log.Printf("MicroPaginator Redis Store is enabled while the enviroment is in test mode, disabling redis pagination...")
		StoreRedis = false
	}
	if StoreRedis {
		cachedResult, err := database.Client.Get(database.Ctx, cacheKey).Result()
		if err == nil {
			// Si encontramos el resultado en Redis, lo parseamos y lo retornamos
			var spr ServePaginationResponse
			if jsonErr := json.Unmarshal([]byte(cachedResult), &spr); jsonErr == nil {
				log.Println("Resultado de paginación obtenido de Redis")
				return spr, true
			} else {
				log.Printf("Error al parsear JSON desde Redis: %v\n", jsonErr)
			}
		} else if err != redis.Nil {
			// Error inesperado en Redis (diferente de "clave no encontrada")
			log.Printf("Error al buscar en Redis: %v\n", err)
		}
	}
	spr, err := (SampleClosure(input, req))()

	if !err {
		log.Printf("Error al ejecutar la closure")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(structs.Response{Message: "Solicitud JSON Invalida"})
		return ServePaginationResponse{}, false
	}
	if StoreRedis {
		// Convierte el resultado a JSON para almacenarlo en Redis
		resultJSON, err := json.Marshal(spr)
		if err != nil {
			log.Printf("Error al convertir resultado a JSON para Redis: %v\n", err)
		} else {
			// Guarda el resultado en Redis con una expiración de 10 minutos
			err = database.Client.Set(database.Ctx, cacheKey, resultJSON, 10*time.Minute).Err()
			if err != nil {
				log.Printf("Error al guardar en Redis: %v\n", err)
			} else {
				log.Println("Resultado de paginación almacenado en Redis")
			}
		}
	}
	return spr, true

}

/*
CLIENTE ENTRA AL ENDPOINT /DRUGS

A nivel servidro, pasar el middleware
el servidor desde el handler del endpoint llama al paginador
el paginador devuelve los resultados,e l handler lo parsea
a json y le devuelve un response al client
*/
