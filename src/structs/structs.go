package structs

/**
These structures are what will be parsed from the HTTP Request of the JSON client
to a Golang structure, this will facilitate data processing at the backend level.

If any entries are missing or there are extra or extraneous entries, or they cannot be parsed into the data structures.
The program will issue an HTTP code 400 (BAD REQUEST) and cancel the pending operation.
**/

type RegisterRequest struct {
	Username  string
	Password  string
	Email     string
	Birthdate string
	Gender    string
	Role      string
}

type LoginRequest struct {
	Username string
	Password string
}

/*
HTTP Response template for every endpoint at the server.

Message returns the postprocessation content, either is a message, an structure, depends on the endpoint.

RedirectRoute,
if needed, the server will indicate the frotend to do a window.location change.
This is useful at authentication endpoints

Authenticated
If the JWT Is invalid or expired, or the cookie is invalid or missing, it will throw an that the authentication is false.
If false, the client has orders to destroy the cookie and return back to the auth endpoint.

Fatal
if the servers issues a HTTP 500 Error message or the server cannot continue its operation, it will issue a Fatal entry,
If the fatal entry is present and its true. The frontend will lock every operation util an operator fixes the issue.
*/
type Response struct {
	Message       string `json:"message"`
	RedirectRoute string `json:"redirect_route,omitempty"`
	Authenticated string `json:"authenticated,omitempty"`
	Fatal         string `json:"fatal,omitempty"`
}
