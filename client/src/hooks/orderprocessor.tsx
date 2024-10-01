export function xorAnswer(xorAnswerVar: string | boolean): boolean | null {
    //XOR GATE
    return ((xorAnswerVar == "true") !== (xorAnswerVar == "false")) ? (xorAnswerVar == "true") : null;
}

export function parseAuthenticatedHelper(variable): boolean {
    var authenticated
    if (variable.hasOwnProperty("authenticated")) {
        authenticated = xorAnswer(variable.authenticated)
        if (authenticated === null) {
            throw new DOMException("Invalid authentication answer")
        } else if (!authenticated) {
            return false
        } else {
            return true
        }
    } else {
        console.warn("We dont know if the user is authenticated or not")
        return false;
    }
}

export function parseFatalHelper(variable) {
    var fatal;
    if (variable.hasOwnProperty("fatal")) {
        fatal = xorAnswer(variable.fatal);
        if (fatal === null) {
            throw new DOMException("Invalid fatal answer")
        } else if (fatal) {
            throw new Error("THE SERVER HAS ENCOUNTERED A FATAL EXCEPTION")
        } else {
            console.log("Theres no error")
        }
    } else {
        console.log("We dont know if a fatal error has ocurred or not")
    }
}