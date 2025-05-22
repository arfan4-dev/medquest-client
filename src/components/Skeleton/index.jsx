const Skeleton = ({ variant = "default" }) => {
  const bgColor = variant === "light" ? "bg-[#F8F9FA]" : "bg-[#E5E7EB]";
  const progressColor = variant === "light" ? "bg-[#E9ECEF]" : "bg-[#4e535d]";

  return (
    <div className="bg-white rounded-lg border border-[#CED4DA] shadow-sm">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className={`border-b border-[#CED4DA] ${
            item === 3 ? "last:border-b-0" : ""
          }`}
        >
          <div className="flex items-center justify-between p-4">
            <div className="flex flex-col w-full gap-2">
              <div
                className={`h-4 ${bgColor} rounded-full w-1/3 animate-pulse`}
              ></div>
              <div
                className={`h-3 ${bgColor} rounded-full w-1/4 animate-pulse opacity-70`}
              ></div>
            </div>
            <div className="flex items-center gap-4">
              <div
                className={`h-7 w-20 ${progressColor} rounded-md animate-pulse`}
              ></div>
              <div
                className={`h-5 w-5 ${bgColor} rounded-full animate-pulse`}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Skeleton;
