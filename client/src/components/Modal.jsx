const Modal = ({  state=false, setter, children }) => {

    return(
       <>
            { 
                state && 
                <div className="z-30 sticky top-0 grid place-content-center w-full min-h-full bg-black/30">
                  <div className="animate-fadeIn relative grid gap-3 grid-cols-1 lg:grid-cols-4 bg-white shadow-[5px_5px] shadow-green-900 max-w-xl p-4">
                    <div 
                      onClick={ setter }
                      className="absolute cursor-pointer w-fit -top-3 end-0 px-3 py-1 bg-green-900 rounded-3xl text-white"
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </div>
                    { children }
                  </div>
                </div> 
            }
        </>
    )
}

export default Modal;