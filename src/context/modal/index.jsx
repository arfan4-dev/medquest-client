import { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    content: null,
    isLoading: false,
  });

  const openModal = (content) => {
    setModalState({ isOpen: true, content });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, content: null });
  };

  const setLoading = (loading) => {
    setModalState((prev) => ({ ...prev, isLoading: loading }));
  };
  return (
    <ModalContext.Provider
      value={{ ...modalState, openModal, closeModal, setLoading }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
