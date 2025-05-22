import React, { createContext, useContext, useState } from "react";

const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <TimerContext.Provider value={{ isSubmitting, setIsSubmitting }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => useContext(TimerContext);
