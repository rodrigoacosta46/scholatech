import { twMerge } from "tailwind-merge";

const InputScent = ({ title='', name='', value='', type, placeholder, required, readOnly=false, className=''}) => {
  return (
    <div className="text-slate-700">
      { title }
      <input
        name={name}
        defaultValue={value}
        readOnly={readOnly}
        type={type}
        className={twMerge(`transition-[border] outline-none border-b-[1px] focus:border-blue-600 ${!readOnly ? '[&:not(:placeholder-shown)]:border-blue-600' : 'cursor-not-allowed'} bg-transparent ms-2 ${className}`)}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
};

export default InputScent;
