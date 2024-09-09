const Title = ({ txt }) => {
    return(
        <>
            <p>{txt}</p>
            <div className="flex w-full h-1">
              <div 
                className="bg-green-800 w-2/5"
              />
              <div
                className="bg-green-600 w-2/5" 
              />
              <div
                className="bg-green-400 w-2/5" 
              />
            </div>
        </>
    )
}

export default Title;