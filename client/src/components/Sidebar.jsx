const Sidebar = () => {
    return(
        <div class="flex flex-col fixed fixed-left w-64 h-full bg-green-950">
            <div class="h-full flex flex-col">
                <span class="cursor-pointer w-fit after:content-['Log_Out'] after:underline after:absolute after:-translate-x-full after:opacity-0 hover:after:translate-x-0 hover:after:opacity-100 after:transition-all text-gray-400 hover:text-red-400">
                    <i class="fa-solid fa-arrow-right-from-bracket rotate-180 "></i>
                </span>             
                <div class="w-full flex gap-2 p-2">
                    <img src="img/Gaben.png" alt="Page LOGO" class="w-20 rounded-full" />
                    <div class="flex flex-col">
                        <p class="text-xl text-white text-wrap max-h-28 overflow-hidden me-2">Hernandez Gutierrez Nunez</p>
                        <p class="text-sm text-gray-500">Paciente</p>
                    </div>
                </div>
                <div class="flex flex-col w-72 h-72 overflow-y-auto overflow-x-hidden" style="direction: rtl;">
                    <div class="relative group w-64 hover:w-full flex self-end gap-[3px] text-slate-400 hover:text-white hover:bg-green-700 py-4 transition-all cursor-pointer" style="direction: ltr;">
                        <div class="w-full text-center text-wrap transition-all px-2">
                            <i class="fa-sharp-duotone fa-solid fa-heart-circle-exclamation fa-light"></i>
                            Información general 
                            <div class="absolute transition-all duration-500 bg-white h-px w-full end-full group-hover:end-4"></div>
                        </div>
                    </div><div class="relative group w-64 hover:w-full flex self-end gap-[3px] text-slate-400 hover:text-white hover:bg-green-700 py-4 transition-all cursor-pointer" style="direction: ltr;">
                        <div class="w-full text-center text-wrap transition-all px-2">
                            <i class="fa-sharp-duotone fa-solid fa-heart-circle-exclamation fa-light"></i>
                            listado de medicaciones que ingierio el paciente 
                            <div class="absolute transition-all duration-500 bg-white h-px w-full end-full group-hover:end-4"></div>
                        </div>
                    </div><div class="relative group w-64 hover:w-full flex self-end gap-[3px] text-slate-400 hover:text-white hover:bg-green-700 py-4 transition-all cursor-pointer" style="direction: ltr;">
                        <div class="w-full text-center text-wrap transition-all px-2">
                            <i class="fa-sharp-duotone fa-solid fa-heart-circle-exclamation fa-light"></i>
                            informacion de Drogas 
                            <div class="absolute transition-all duration-500 bg-white h-px w-full end-full group-hover:end-4"></div>
                        </div>
                    </div><div class="relative group w-64 hover:w-full flex self-end gap-[3px] text-slate-400 hover:text-white hover:bg-green-700 py-4 transition-all cursor-pointer" style="direction: ltr;">
                        <div class="w-full text-center text-wrap transition-all px-2">
                            <i class="fa-sharp-duotone fa-solid fa-heart-circle-exclamation fa-light"></i>
                            consultas medicas. 
                            <div class="absolute transition-all duration-500 bg-white h-px w-full end-full group-hover:end-4"></div>
                        </div>
                    </div><div class="relative group w-64 hover:w-full flex self-end gap-[3px] text-slate-400 hover:text-white hover:bg-green-700 py-4 transition-all cursor-pointer" style="direction: ltr;">
                        <div class="w-full text-center text-wrap transition-all px-2">
                            <i class="fa-sharp-duotone fa-solid fa-heart-circle-exclamation fa-light"></i>
                            registro de tomas de medicaciones 
                            <div class="absolute transition-all duration-500 bg-white h-px w-full end-full group-hover:end-4"></div>
                        </div>
                    </div><div class="relative group w-64 hover:w-full flex self-end gap-[3px] text-slate-400 hover:text-white hover:bg-green-700 py-4 transition-all cursor-pointer" style="direction: ltr;">
                        <div class="w-full text-center text-wrap transition-all px-2">
                            <i class="fa-sharp-duotone fa-solid fa-heart-circle-exclamation fa-light"></i>
                            Portal de informacion del medico.
                            <div class="absolute transition-all duration-500 bg-white h-px w-full end-full group-hover:end-4"></div>
                        </div>
                    </div><div class="relative group w-64 hover:w-full flex self-end gap-[3px] text-slate-400 hover:text-white hover:bg-green-700 py-4 transition-all cursor-pointer" style="direction: ltr;">
                        <div class="w-full text-center text-wrap transition-all px-2">
                            <i class="fa-sharp-duotone fa-solid fa-heart-circle-exclamation fa-light"></i>
                            medicaciones del paciente 
                            <div class="absolute transition-all duration-500 bg-white h-px w-full end-full group-hover:end-4"></div>
                        </div>
                    </div><div class="relative group w-64 hover:w-full flex self-end gap-[3px] text-slate-400 hover:text-white hover:bg-green-700 py-4 transition-all cursor-pointer" style="direction: ltr;">
                        <div class="w-full text-center text-wrap transition-all px-2">
                            <i class="fa-sharp-duotone fa-solid fa-heart-circle-exclamation fa-light"></i>
                            calendario 
                            <div class="absolute transition-all duration-500 bg-white h-px w-full end-full group-hover:end-4"></div>
                        </div>
                    </div><div class="relative group w-64 hover:w-full flex self-end gap-[3px] text-slate-400 hover:text-white hover:bg-green-700 py-4 transition-all cursor-pointer" style="direction: ltr;">
                        <div class="w-full text-center text-wrap transition-all px-2">
                            <i class="fa-sharp-duotone fa-solid fa-heart-circle-exclamation fa-light"></i>
                            Estudios medicos  
                            <div class="absolute transition-all duration-500 bg-white h-px w-full end-full group-hover:end-4"></div>
                        </div>
                    </div>
                </div>
            </div>
            <img src="img/logo.png" alt="Page LOGO" class="w-56 my-2 mx-auto block justify-self-end" />
        </div>
    )
}

export default Sidebar;