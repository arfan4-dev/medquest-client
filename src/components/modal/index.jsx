import { useEffect, useRef } from "react";
import { useModal } from "../../context/modal";

const Modal = () => {
  const { isOpen, content, closeModal } = useModal();
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        closeModal();
      }
    };
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [closeModal]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center px-3 overflow-x-hidden overflow-y-auto bg-black z-99999 bg- bg-opacity-60">
      <div
        ref={ref}
        id="popup-modal"
        tabIndex="-1"
        className="relative w-full max-w-lg max-h-full bg-white rounded-lg shadow dark:bg-gray-950"
        onClick={(e) => e.stopPropagation()}
      >
        <div>{content}</div>
      </div>
    </div>
  );
};

export default Modal;
