import React from "react";

const Icon: React.FC<{style?: React.CSSProperties, path: React.ReactNode, className?: string, onClick?: (event: React.MouseEvent<SVGSVGElement>)=>any}> = ({className, onClick, path, style}) =>{
    return <svg style={style} onClick={(e)=>onClick? onClick(e) : null} className={className} xmlns="http://www.w3.org/2000/svg"  id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" fill="currentColor" >
    {path}
  </svg>
  
}
export default Icon