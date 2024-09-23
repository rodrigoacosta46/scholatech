
const Card = ({ className = "", children, ...props }) => {
    return(
        <div
          className={"bg-white p-4 flex flex-col shadow-[3px_3px] shadow-green-900 " + className}
          {...props}
        >
          {children}
        </div>
    )
}

export default Card;