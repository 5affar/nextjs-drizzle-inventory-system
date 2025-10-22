import { PencilLine } from "lucide-react";

export default function PrimaryIconButton({ buttonIcon: Icon, onClick }: { buttonIcon: any, onClick?: () => void }) {

  return (
   <span className="cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline hover:bg-gray-100 p-3 rounded-lg" 
      onClick={onClick}>
      <Icon className="h-4 w-4" />
  </span>
  );
}