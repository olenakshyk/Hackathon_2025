import React from 'react';

interface IconProps {
  path: string | React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  onClick?: (event: React.MouseEvent<SVGSVGElement>) => any;
}

const Icon: React.FC<IconProps> = ({ path, style, className, onClick }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      width="25"
      height="30"
      onClick={onClick}
      className={className}
      style={{
        display: 'block',
        stroke: 'none',
        outline: 'none',
        background: 'transparent',
        ...style,
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {typeof path === 'string'
        ? <path d={path} fill="currentColor" />
        : path}
    </svg>
  );
};

export default Icon;
