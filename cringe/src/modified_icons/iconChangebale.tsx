import React from "react";

const IconChangebale: React.FC<{style?: React.CSSProperties, path: React.ReactNode, className?: string, onClick?: (event: React.MouseEvent<SVGSVGElement>)=>any, viewBox: string}> = ({className, onClick, path, style, viewBox}) =>{
    return <svg style={style} onClick={(e)=>onClick? onClick(e) : null} className={className} xmlns="http://www.w3.org/2000/svg"  id="Layer_1" data-name="Layer 1" viewBox={viewBox} fill="currentColor" >
    {path}
  </svg>
  
}
export default IconChangebale