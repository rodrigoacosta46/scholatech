const Searchbar = ({ placeholder, className }) => {
    return(
        <div className={"flex items-center rounded-3xl p-3 text-slate-400 bg-slate-200 " + className}>
            <i className="fa-solid fa-magnifying-glass pe-2"></i>
            <input 
                type="text" 
                placeholder={placeholder}
                className={"w-full bg-transparent outline-none border-b-2 border-slate-300 focus:border-slate-400 focus:text-slate-600"}
            />
        </div>
    )
}

export default Searchbar;