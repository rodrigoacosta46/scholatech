const Title = ({ txt, allowAnimations=false }) => {
    return(
        <>
            <p>{txt}</p>
            <div className="flex w-full h-1">
              <span className="w-2/5">
                <div
                  style={{ animationDelay: '.1s' }}
                  className={(allowAnimations ? "animate-slideIn opacity-0 ": "") +"bg-green-800 h-full"}
                />
              </span>
              <span className="w-2/5">
                <div
                  style={{ animationDelay: '.4s' }}
                  className={(allowAnimations ? "animate-slideIn opacity-0 ": "") +"bg-green-600 h-full"}
                />
              </span>
              <span className="w-2/5">
                <div
                  style={{ animationDelay: '.7s' }}
                  className={(allowAnimations ? "animate-slideIn opacity-0 ": "") +"bg-green-400 h-full"}
                />
              </span>
            </div>
        </>
    )
}

export default Title;