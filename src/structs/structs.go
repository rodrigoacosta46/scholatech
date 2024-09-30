package structs

type RegisterRequest struct {
	Username  string
	Password  string
	Email     string
	Birthdate string
	Gender    string
}

type LoginRequest struct {
	Username string
	Password string
}
type Response struct {
	Message       string `json:"message"`
	RedirectRoute string `json:"redirect_route,omitempty"`
	Authenticated string `json:"authenticated,omitempty"`
	Fatal         string `json:"fatal,omitempty"`
}
