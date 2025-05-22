import { useEffect } from "react";
import toast, { Toaster, useToasterStore } from "react-hot-toast";

const ToasterComponent = () => {
  const { toasts } = useToasterStore();
  const TOAST_LIMIT = 1;

  useEffect(() => {
    toasts
      .filter((t) => t.visible)
      .filter((_, i) => i >= TOAST_LIMIT)
      .forEach((t) => toast.dismiss(t.id));
  }, [toasts]);

  return (
    <Toaster
      maxCount={TOAST_LIMIT}
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          padding: "16px",
          color: "#343A40",
        },
      }}
    />
  );
};

export default ToasterComponent;
