import Title from "../components/Title";
import { userHook } from "../hooks/userHook";

const List = () => {
    const { userConfig } = userHook();

    return(
        <Title 
            txt="Listado de usuarios"
            allowAnimations={true}
            scheme={userConfig.theme}
        />

        
    )
}

export default List;