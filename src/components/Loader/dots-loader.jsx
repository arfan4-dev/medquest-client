const DotsLoader = () => {
  return (
    <div class="flex justify-center items-center ">
      <div class="flex space-x-2">
        <div class="dot w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
        <div class="dot w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></div>
        <div class="dot w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-400"></div>
      </div>
    </div>
  );
};

export default DotsLoader;
