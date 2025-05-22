import React, { createContext, useContext, useState } from "react";

const SelectionContext = createContext();

export const useSelectionContext = () => {
  return useContext(SelectionContext);
};

export const SelectionProvider = ({ children }) => {
  const [selectedLeftCategories, setSelectedLeftCategories] = useState([]);
  const [selectedLeftSubcategories, setSelectedLeftSubcategories] = useState(
    {}
  );

  const initializeSelection = (questions) => {
    setSelectedLeftCategories(questions.map((_, index) => index));
    setSelectedLeftSubcategories(
      questions.reduce((acc, category, index) => {
        acc[index] = category.schools.map((school) => school.school);
        return acc;
      }, {})
    );
  };

  return (
    <SelectionContext.Provider
      value={{
        selectedLeftCategories,
        setSelectedLeftCategories,
        selectedLeftSubcategories,
        setSelectedLeftSubcategories,
        initializeSelection,
      }}
    >
      {children}
    </SelectionContext.Provider>
  );
};
