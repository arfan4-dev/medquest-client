import { useFormik } from "formik";
import React from "react";
import { RxCross2 } from "react-icons/rx";
import useEarlyAccess from "../hooks/useEarlyAccess";
import { earlyAccessSchema } from "../schema/auth.schema";
import Loader from "./Loader";

const GetEarlyModal = ({ isOpen, closeModal }) => {
  if (!isOpen) return null;

  const { loading, requestEarlyAccess } = useEarlyAccess();

  const universities = [
    "Faculté de Médecine et de Pharmacie d’Oujda",
    "Faculté de Médecine, de Pharmacie et de Médecine Dentaire de Fès",
    "Faculté Euromed de Médecine",
    "Faculté de médecine et de pharmacie de Rabat",
    "Faculté de Médecine Abulcasis",
    "Faculté internationale de Médecine",
    "Faculté Mohammed VI de Médecine de Rabat",
    "Faculté de Médecine et de Pharmacie de Marrakech",
    "Faculté Privée de Médecine et de Pharmacie de Marrakech",
    "Faculté de Médecine et de Pharmacie de Casablanca",
    "Faculté Mohammed VI de Médecine de Casablanca",
    "Mohamed VI Faculty of Medicine",
    "Faculté de Médecine et de Pharmacie de Tanger",
    "Faculté de Médecine et de Pharmacie d'Agadir",
    "Faculté de Médecine de l’UPSSA",
    "Faculté de Médecine et de Pharmacie Beni Mellal",
    "Faculté Mohammed VI de Médecine de Dakhla",
    "Faculté de Médecine et de Pharmacie d’Errachidia",
    "Faculté de Médecine et de Pharmacie de Guelmim",
    "Faculté de Médecine et de Pharmacie de Laayoune",
  ];

  const years = Array.from({ length: 5 }, (_, i) => ({
    label: `Year ${i + 1}`,
    value: `Year${i + 1}`,
  }));

  const formFields = [
    { name: "email", label: "Email", type: "email", placeholder: "@gmail.com" },
    {
      name: "university",
      label: "University",
      type: "select",
      options: universities,
    },
    {
      name: "year",
      label: "Year",
      type: "select",
      options: years,
    },
  ];

  const formik = useFormik({
    initialValues: {
      email: "",
      university: "",
      year: "",
    },

    validationSchema: earlyAccessSchema,
    onSubmit: async (values) => {
      const res = await requestEarlyAccess(
        values.email,
        values.year,
        values.university
      );

      closeModal();
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-65">
      <div
        className="w-full max-w-xl p-6 mx-3 bg-white rounded-md"
        style={{
          boxShadow: "0px 2px 4px -1px #0000000F, 0px 4px 6px -1px #0000001A",
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-[#111827] font-semibold">
            Get into the waitlist
          </h2>
          <button
            type="button"
            className="text-[#6B7280] hover:text-gray-600"
            onClick={closeModal}
          >
            <RxCross2 size={16} color="#6B7280" />
          </button>
        </div>

        <p className="text-[#6B7280] text-subtitle-xsm mb-4">
          Add yourself to the waitlist, and we will contact you in due time.
        </p>

        <form onSubmit={formik.handleSubmit}>
          {formFields.map((field) => (
            <div key={field.name} className="mb-4">
              <label
                htmlFor={field.name}
                className="block text-sm text-[#6B7280] font-medium"
              >
                {field.label}
              </label>

              {field.type === "select" ? (
                <select
                  id={field.name}
                  name={field.name}
                  onChange={formik.handleChange}
                  value={formik.values[field.name]}
                  className="mt-1 h-[42px] px-3 text-[#ADB5BD] text-title-p focus:outline-none rounded-[8px] w-full border border-[#E5E7EB] placeholder-[#9CA3AF] bg-white"
                >
                  <option value="" disabled>
                    Select {field.label}
                  </option>
                  {field.options.map((option, index) => (
                    <option key={index} value={option.value || option}>
                      {option.label || option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  onChange={formik.handleChange}
                  value={formik.values[field.name]}
                  className="mt-1 h-[42px] px-3 py-2 text-[#ADB5BD] text-title-p focus:outline-none rounded-[8px] w-full border border-[#E5E7EB] placeholder-[#9CA3AF] bg-white"
                />
              )}

              {/* Error message */}
              {formik.errors[field.name] && formik.touched[field.name] && (
                <div className="mt-1 text-sm text-red-500">
                  {formik.errors[field.name]}
                </div>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="bg-[#3A57E8] flex items-center text-white font-semibold px-4 py-2 rounded-md mt-4 float-right"
          >
            {loading ? (
              <span className="flex items-center gap-x-2">
                <Loader className="w-4 h-4 border-2 border-white border-solid rounded-full animate-spin-1.5 border-t-transparent" />
                Loading...
              </span>
            ) : (
              "Get Early Access"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GetEarlyModal;
