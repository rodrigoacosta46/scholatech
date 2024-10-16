import React from 'react';
import Title from '../../components/Title';
import { userHook } from '../../hooks/userHook';

const Treatments = () => {
    const { userConfig } = userHook();

    return(
        <>
            <Title txt="Tratamientos de pacientes" allowAnimations={true} scheme={userConfig.theme}/>
        </>
    )
}

export default Treatments;