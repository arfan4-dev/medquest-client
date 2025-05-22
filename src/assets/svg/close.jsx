import { twMerge } from "tailwind-merge";

const CloseSvg = ({
  className = "w-3 h-3 cursor-pointer",
  fill = "white",
  onClick,
}) => {
  return (
    <svg
      className={twMerge(`w-3 h-3 cursor-pointer ${className}`)}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 14 14"
      onClick={onClick}
    >
      <path
        fill={fill}
        stroke="currentColor"
        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
      />
    </svg>
  );
};

export default CloseSvg;
