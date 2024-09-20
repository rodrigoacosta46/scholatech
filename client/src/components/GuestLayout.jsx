import { Outlet } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';


const GuestLayout = ({ children }) => {
  class AuthMethodHandler {
    result
    authenticated
    PropertyGuest
    redirect_route = null
     constructor(Guest) {
      this.PropertyGuest = Guest
      this.Orchestrator()
    }
    async Orchestrator() {
      try {
        this.result = await axios.get("http://localhost:8000/isAuthenticated", {withCredentials: true})
        this.result = this.result.data
      } catch (error) {
        console.log("It looks like its not authenticated")
        this.result = error.response.data
      } finally {
        this.parseAuthenticated()
        this.parseRedirectRoute()
        this.letsGo()
      }
    }
    parseAuthenticated() {
      if (this.result.hasOwnProperty("authenticated")) {
        let propertyGet = this.result.authenticated
          if ((propertyGet == "true") ^ (propertyGet == "false")) {
            this.authenticated = (propertyGet == "true");
          } else {
            console.warn("Invalid authenticated response")
          }
      }
      else {
        console.warn("We dont know if the user is authenticated or not")
      }
    }
    parseRedirectRoute() {
      if (this.result.hasOwnProperty("redirect_route")) {
        try {
          let URLEncoded = new URL(this.result.redirect_route, window.location.origin)
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
      if (!(this.PropertyGuest ^ this.authenticated)) {
        console.log("Lets redirect")
        console.log(this.redirect_route)
        window.location.href = this.redirect_route;
      } else {
        console.log("Everythings ok")
      }
    }
  }

  useEffect(() => {
    const authHandler = new AuthMethodHandler(true);
  }, []);

  return (
    <div className="min-w-fit min-h-dvh bg-[#dae3de]">
      <div className="w-full h-fit flex flex-col items-center ">
        <img src="img/logo.png" alt="Page LOGO" className="w-32 p-2" />
        <Outlet/>
      </div>
    </div>
  );
};

export default GuestLayout;
