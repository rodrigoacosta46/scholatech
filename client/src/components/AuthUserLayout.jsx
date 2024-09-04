import Sidebar from "./Sidebar"

const AuthUserLayout = (children) => {
    return(
        <div class="min-w-fit min-h-dvh bg-white">    
            <Sidebar />
            {children}
        </div>
    )
}

export default AuthUserLayout;