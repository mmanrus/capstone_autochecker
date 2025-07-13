import { Input } from "@/components/ui/input"
import clsx from 'clsx'
export function InputComponent({
     type = "text",
     placeholder = "",
     onChange,
     value,
     required = false,
     className,
     ...rest
   }) {
     return (
         <Input
          className={clsx("flex flex-col gap-1", className)}
           type={type}
           placeholder={placeholder}
           value={value}
           onChange={onChange}
           required={required}
           {...rest}
         />
     );
   }