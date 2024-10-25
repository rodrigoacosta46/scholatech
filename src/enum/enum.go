package enum

import (
	"net/http"
	"strconv"

	"github.com/nicolas-k-cmd/proj-redes/src/env"

	"github.com/ua-parser/uap-go/uaparser"
)

type StatusMap map[string]string

func NewStatusMap(ShortURL string, FullURL string, View string) StatusMap {
	return StatusMap{
		"ShortURL": ShortURL,
		"FullURL":  FullURL,
		"View":     View,
	}
}

func (sm StatusMap) Contains(status string) bool {
	_, ok := sm[status]
	return ok
}

func (sm StatusMap) Which(r *http.Request) string {
	RequestUserAgent := r.UserAgent()
	parsedResults := uaparser.NewFromSaved().Parse(RequestUserAgent)
	if parsedResults.Os.Family == "Android" {
		return sm["view"]
	} else if env.WebFullURL {
		return sm["FullURL"]
	} else {
		return sm["ShortURL"]
	}
}

type URI map[string]StatusMap

var URLs URI = make(URI)

func Server_URL() string {
	return string(env.SERVER_PROTOCOL + "://" + env.SERVER_ADDRESS + ":" + strconv.Itoa(env.SERVER_PORT))
}

func Client_URL() string {
	return string(env.WEB_PROTOCOL + "://" + env.WEB_ADDRESS + ":" + strconv.Itoa(env.WEB_PORT))
}
func init() {
	URLs["register"] = NewStatusMap(
		"/register",
		Client_URL()+"/register",
		"com.suiza.register",
	)
	URLs["login"] = NewStatusMap(
		"/login",
		Client_URL()+"/login",
		"com.suiza.login",
	)
	URLs["logout"] = NewStatusMap(
		"/logout",
		Server_URL()+"/logout",
		Server_URL()+"/logout",
	)
	URLs["profile"] = NewStatusMap(
		"/profile",
		Client_URL()+"/profile",
		"com.suiza.profile",
	)
}
