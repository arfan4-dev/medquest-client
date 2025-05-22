import { twMerge } from "tailwind-merge";

const Loader = ({
  className = "w-16 h-16 border-4 border-blue-500 border-solid rounded-full animate-spin-1.5 border-t-transparent",
}) => {
  return <div className={twMerge(className)}></div>;
};

export default Loader;
