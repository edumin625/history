type BTSItem = {
  base : string, 
  hover : string
}

type BTS = {
  blue : BTSItem, 
  orange : BTSItem, 
  lime : BTSItem
}


const BTStyle : BTS= {
  blue : {
    base : "bg-blue-500",
    hover : "hover:bg-blue-900",
  },
  orange : {
    base : "bg-orange-500",
    hover : "hover:bg-orange-900",
  },
  lime : {
    base : "bg-lime-500",
    hover : "hover:bg-lime-900",
  }
} as const;

type BtColor = keyof BTS ;
//type BtColor = keyof typeof BTStyle ;
// type BtColor = 'blue' | 'orange' | 'lime' ;

interface TailButtonProps {
  type : "submit" | "reset" | "button", 
  color : BtColor, 
  caption : string, 
  onHandle? : () => void,
  disabled?: boolean
}

export default function TailButton({type, color, caption, onHandle, disabled} : TailButtonProps) {
  const btstyle = BTStyle[color] ;

  return (
    <button type = {type}
            className={`${btstyle.base} text-white rounded
                        ${!disabled && btstyle.hover} hover:font-bold 
                        w-full
                        px-4 py-2 mx-2
                        disabled:opacity-50 disabled:cursor-not-allowed`}
            onClick={onHandle}
            disabled={disabled}>
      {caption}
    </button>
  )
}
