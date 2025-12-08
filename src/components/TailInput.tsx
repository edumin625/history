// Next.js 16 (React 19) 환경에서 컴포넌트의 Props 타입을 정의할 때,
// ref의 타입을 너무 엄격하게 RefObject로만 지정하면 null을 허용하지 않는 타입으로 정의됨
// React.Ref<T> 타입을 사용하면 이 타입은 null 처리를 자동으로 포함
import { type Ref } from "react"

interface TailInputProps {
  type : string, 
  name : string, 
  id : string,
  placeholder? : string,
  ref :Ref<HTMLInputElement>
}

export default function TailInput({type, name, id, placeholder, ref}: TailInputProps) {
  return (
    <div className='w-full'>
      <input  type={type} 
              name={name} 
              id= {id} 
              placeholder={placeholder}
              ref={ref}
              className="w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500" />
    </div>
  )
}
