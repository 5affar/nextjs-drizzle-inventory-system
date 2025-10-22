import * as Icons from "lucide-react";


export default function PrimaryButton({ className, name, onClick, isLoading, type = "button" }: { className?: string, name: string, onClick?: () => void, isLoading?: boolean, type?: "button" | "submit" | "reset" }) {

  return (
    <button 
    type={type}
    className={`flex items-center w-fit text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${className}`} 
    onClick={onClick} disabled={isLoading}>
      {name}
    </button>
  );
}