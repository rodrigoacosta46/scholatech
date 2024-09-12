const Title = ({
  txt,
  allowAnimations = false,
  className = "text-2xl w-fit bg-slate-200 text-green-900 p-4 rounded-lg font-black m-2 shadow-[7px_7px] shadow-green-700",
  ...props
}) => {
  return (
    <div
      className={className} 
      {...props}
    >
      <p>{txt}</p>
      <div className="grid grid-flow-col grid-cols-6 w-full h-1">
        <div
          style={{ animationDelay: ".1s" }}
          className={
            (allowAnimations ? "animate-slideIn opacity-0 " : "") +
            "col-span-2 bg-green-800 h-full"
          }
        />
        <div
          style={{ animationDelay: ".4s" }}
          className={
            (allowAnimations ? "animate-slideIn opacity-0 " : "") +
            "col-span-3 bg-green-600 h-full"
          }
        />
        <div
          style={{ animationDelay: ".7s" }}
          className={
            (allowAnimations ? "animate-slideIn opacity-0 " : "") +
            "bg-green-400 h-full"
          }
        />
      </div>
    </div>
  );
};

export default Title;
