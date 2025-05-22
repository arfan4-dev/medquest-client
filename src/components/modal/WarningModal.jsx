import { IoIosWarning } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import Button from "../Button";
import { useModal } from "../../context/modal";

const WarningModal = ({
  closeModal,
  title = "Are you Sure?",
  description,
  successText = "Yes",
  onClick,
}) => {
  const { setLoading, isLoading } = useModal();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md p-6 mx-4 bg-white rounded-lg shadow-xl">
        <button
          onClick={closeModal}
          className="absolute text-gray-500 top-4 right-4 hover:text-gray-700 focus:outline-none"
        >
          <IoCloseSharp size={20} />
        </button>

        <div className="flex items-start mb-4">
          <IoIosWarning size={30} className="mr-3 text-yellow-500" />
          <div>
            <h2 className="text-lg font-semibold text-custom_black_100">
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-sm text-gray-600">{description}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            className="text-sm py-2.5 px-6 font-semibold rounded-md border text-gray-700 hover:bg-gray-100 transition duration-300"
            onClick={closeModal}
          >
            No, cancel
          </Button>

          <Button
            disabled={isLoading}
            className="text-sm py-2.5 px-6 font-semibold rounded-md bg-red-500 text-white hover:bg-red-600 transition duration-300"
            onClick={() => {
              setLoading(true);
              onClick();
            }}
          >
            {successText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WarningModal;
