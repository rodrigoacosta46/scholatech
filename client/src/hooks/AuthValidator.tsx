import axios, { AxiosResponse } from "axios"
import { parseAuthenticatedHelper } from "./orderprocessor"

interface ResponseStructure {
    message: string | Record<string, unknown>;  
    redirect_route: string;
    authenticated: boolean;
    fatal: boolean;
  }
  
export class AuthMethodHandler {
    result: ResponseStructure;
    authenticated: boolean
    PropertyGuest: boolean
    redirect_route: URL = new URL("/login", window.location.origin)
     constructor(Guest) {
      this.PropertyGuest = Guest
      this.Orchestrator()
    }
    async Orchestrator() {
      try {
        let preresult: AxiosResponse = await axios.get(process.env.REACT_APP_API_URL
  + "/isAuthenticated", {withCredentials: true})
        this.result = preresult.data
      } catch (error) {
        console.log("It looks like its not authenticated")
        this.result = error.response.data
      } finally {
        //this.parseAuthenticated()
        this.authenticated = parseAuthenticatedHelper(this.result)
        this.parseRedirectRoute()
        this.letsGo()
      }
    }
    parseRedirectRoute() {
      if (this.result.hasOwnProperty("redirect_route")) {
        try {
          let URLEncoded;
          if (this.PropertyGuest && !this.authenticated && (this.result.redirect_route == "/logout")) {
            URLEncoded = new URL("/logout", process.env.REACT_APP_API_URL);
          } else {
            URLEncoded = new URL(this.result.redirect_route, window.location.origin)
          }
          this.redirect_route = URLEncoded;
        } catch (e) {
          console.warn(e)
          console.warn("Invalid URL")
        }
      } else {
        console.log("No url provided")
      }
    }
    letsGo() {
      console.log(this.PropertyGuest)
      console.log(this.authenticated)
      //XNOR GATE
      //IF GUEST (1) AND AUTHENTICATED (1) THEN REDIRECT
      //IF GUEST (0) AND AUTHENTICATED (0) THEN REDIRECT
      // AND LOGIC, BUT BECAUSE WE NEED TO 0 & 0 = 1
      // WE APPLY XNOR GATE
      // THEN WE APPLY OR GATE TO CHECK IF THE EXPECTED ROUTE IS LOGOUT.
      // IF LOGOUT ALWAYS LOGOUT, ALWAYS REDIRECT.
      if (((this.PropertyGuest === this.authenticated)) || (this.redirect_route.pathname == "/logout")){
        console.log("Lets redirect")
        console.log(this.redirect_route)
        window.location.href = this.redirect_route.href;
      } else {
        console.log("Everythings ok")
      }
    }
  }
