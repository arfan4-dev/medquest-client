import { twMerge } from "tailwind-merge";

import { IoCloseSharp } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useDrawer } from "../../context/drawer/index";
import { FaRegCommentDots } from "react-icons/fa";
const GenericDrawer = ({ className }) => {
  const drawer = useDrawer();
  const { comments = {} } = useSelector((state) => state?.discussion || {});

  return (
    <div>
      {drawer.isOpen && (
        <div
          className={`fixed inset-0 z-30 bg-black bg-opacity-50 brightness-75 backdrop-blur-sm contrast-100`}
          onClick={drawer.closeDrawer}
        />
      )}
      <div
        className={twMerge(
          `fixed top-0 right-0 z-40 w-4/5 md:w-[27.5rem] bg-[#FAFAFA] h-screen overflow-y-auto transition-transform transform duration-700 ${
            drawer?.isOpen ? "translate-x-0 " : "translate-x-full "
          } bg-red dark:bg-gray-800 bg-white`,
          className
        )}
        tabIndex="-1"
      >
        <section>
          <div className="flex items-center justify-between px-4 pt-4">
            <div className="flex items-center  text-lg font-bold text-[#212529]">
              <FaRegCommentDots className="mr-1 opacity-90" size={25} />
              {`Discussion(${comments?.total || 0})`}
            </div>
            <button
              type="button"
              onClick={drawer?.closeDrawer}
              className="w-10 h-10 text-sm font-extrabold text-gray-400 hover:text-grey-600"
            >
              <IoCloseSharp
                size={24}
                className="text-black hover:text-neutral-500"
              />
            </button>
          </div>

          <div className="px-4 py-6">{drawer?.content}</div>
        </section>
      </div>
    </div>
  );
};

export default GenericDrawer;
