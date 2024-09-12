import Card from "./Card";

const Modal = ({ state=false, setter, children }) => {

    return(
       <>
            { 
                state && 
                <div className="z-30 sticky top-0 grid place-content-center w-full min-h-full bg-black/30">
                  <Card className="relative">
                    <div 
                        onClick={ setter }
                        className="absolute cursor-pointer w-fit -top-3 end-0 px-3 py-1 bg-red-900 rounded-3xl text-white"
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </div>
                    <div className="animate-fadeIn relative grid gap-3 grid-cols-1 lg:grid-cols-4 overflow-hidden max-w-xl">            
                      { children }
                    </div>
                  </Card>
                </div> 
            }
        </>
    )
}

export default Modal;