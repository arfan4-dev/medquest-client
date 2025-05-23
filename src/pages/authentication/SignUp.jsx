import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useState } from "react";
import { FaAsterisk, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Footer from "../../components/Footer";
import {
  inputFieldsStep1,
  inputFieldsStep2,
  universitiesData,
} from "../../constant/auth";
import { confirmationSchema, RegisterSchema } from "../../schema/auth.schema";
import { registerUser } from "../../store/features/auth/auth.service";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showRecheckEmail, setShowRecheckEmail] = useState(false);
  const [formValues, setFormValues] = useState(null);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const dispatch = useDispatch();

  const [universities, setUniversities] = useState([]);

  const handleCityChange = (e, setFieldValue) => {
    const selectedCity = e.target.value;
    const filteredUniversities = universitiesData
      .filter((university) => university.city === selectedCity)
      .map((university) => university.name);
    setUniversities(filteredUniversities);
    setFieldValue("city", selectedCity);
    setFieldValue("university", "");
  };

  const years = Array.from({ length: 5 }, (_, i) => ({
    label: `Year ${i + 1}`,
    value: `Year${i + 1}`,
  }));
  return (
    <>
      {!showRecheckEmail ? (
        <>
          <Link
            to="/home"
            className="sticky top-0 py-2 m-auto text-center bg-white z-99">
            <p className="text-title-sm font-semibold text-[#3A57E8] bg-white py-3">
              MEDQUEST
            </p>
          </Link>
          <div className="xsm:max-w-[360px] m-auto mt-12 pb-22 lg:px-0 px-4">
            <div>
              <h1 className="mb-5 font-semibold text-center lg:text-title-xl2 text-title-md text-black-3">
                Create an account
              </h1>

              {step > 1 && (
                <div className="relative md:right-1/2">
                  <Button
                    text="Prev"
                    type="button"
                    leftIcon={MdOutlineKeyboardArrowLeft}
                    leftIconStyle="text-[#ADB5BD] text-[25px]"
                    onClick={() => setStep((prev) => prev - 1)}
                    className="bg-white border flex items-center border-[#E9ECEF] text-secondary rounded-[4px] py-2 px-4 hover:bg-gray-100 focus:outline-none hover:shadow-md"
                  />
                </div>
              )}
            </div>
            <p className="text-title-sm text-[#0D6EFD] font-bold text-center mb-6">
              {step}/2
            </p>

            <Formik
              initialValues={{
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                confirmPassword: "",
                year: "",
                city: "",
                university: "",
                phoneNumber: "",
              }}
              validationSchema={RegisterSchema}
              onSubmit={async (values, { setSubmitting }) => {
                setSubmitting(true);
                setFormValues(values);
                setShowRecheckEmail(true);
                setSubmitting(false);
              }}>
              {({ setFieldValue, isSubmitting, errors }) => (
                <Form className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-1">
                    {(step === 1 ? inputFieldsStep1 : inputFieldsStep2).map(
                      (field) => (
                        <div key={field.name}>
                          <label
                            htmlFor={field.name}
                            className="block font-normal text-title-p text-black-3">
                            {field.label}
                            <FaAsterisk
                              size={6}
                              className="items-start inline mb-3 ml-1 text-red-500"
                            />
                          </label>
                          {field.type === "select" ? (
                            field.name === "year" ? (
                              <Field
                                as="select"
                                id={field.name}
                                name={field.name}
                                className="mt-3 p-3 text-secondary text-title-p bg-white focus:outline-none rounded-[4px] w-full border border-[#CED4DA] placeholder-secondary">
                                <option value="" label="Select your year" />
                                {years.map((year) => (
                                  <option key={year.value} value={year.value}>
                                    {year.label}
                                  </option>
                                ))}
                              </Field>
                            ) : field.name === "city" ? (
                              <Field
                                as="select"
                                id={field.name}
                                name={field.name}
                                className="mt-3 p-3 text-secondary text-title-p bg-white focus:outline-none rounded-[4px] w-full border border-[#CED4DA] placeholder-secondary"
                                onChange={(e) =>
                                  handleCityChange(e, setFieldValue)
                                }>
                                <option value="" label="Select your city" />
                                {Array.from(
                                  new Set(
                                    universitiesData.map((data) => data.city)
                                  )
                                ).map((city) => (
                                  <option key={city} value={city}>
                                    {city}
                                  </option>
                                ))}
                              </Field>
                            ) : field.name === "university" ? (
                              <Field
                                as="select"
                                id={field.name}
                                name={field.name}
                                className="mt-3 p-3 text-secondary text-title-p bg-white focus:outline-none rounded-[4px] w-full border border-[#CED4DA] placeholder-secondary">
                                <option
                                  value=""
                                  label="Select your university"
                                />
                                {universities.map((university, index) => (
                                  <option key={index} value={university}>
                                    {university}
                                  </option>
                                ))}
                              </Field>
                            ) : null
                          ) : (
                            <div className="relative flex items-center">
                              <Field
                                id={field.name}
                                name={field.name}
                                type={
                                  field.name === "password"
                                    ? showPassword
                                      ? "text"
                                      : "password"
                                    : field.name === "confirmPassword"
                                    ? showConfirmPassword
                                      ? "text"
                                      : "password"
                                    : field.type
                                }
                                placeholder={field.placeholder}
                                className="mt-3 p-3 text-secondary text-title-p focus:outline-none rounded-[4px] w-full border border-[#CED4DA] placeholder-secondary"
                              />

                              {(field.name === "password" ||
                                field.name === "confirmPassword") && (
                                <button
                                  type="button"
                                  onClick={
                                    field.name === "password"
                                      ? togglePasswordVisibility
                                      : toggleConfirmPasswordVisibility
                                  }
                                  className="absolute transform -translate-y-1/2 right-3 top-10 text-primary">
                                  {(field.name === "password" &&
                                    showPassword) ||
                                  (field.name === "confirmPassword" &&
                                    showConfirmPassword) ? (
                                    <FaEyeSlash />
                                  ) : (
                                    <FaEye />
                                  )}
                                </button>
                              )}
                            </div>
                          )}
                          <ErrorMessage
                            name={field.name}
                            component="div"
                            className="mt-1 text-sm text-red-500"
                          />
                        </div>
                      )
                    )}
                  </div>

                  <div className="flex items-center justify-between max-w-full mb-10">
                    {step === 1 ? (
                      <button
                        type="button"
                        className="bg-[#0D6EFD] text-title-p rounded-[4px] border text-white font-normal py-2 focus:outline-none w-full"
                        onClick={(e) => {
                          e.preventDefault();

                          if (
                            errors.name ||
                            errors.email ||
                            errors.password ||
                            errors.confirmPassword ||
                            errors.phoneNumber
                          ) {
                            return;
                          }
                          setStep(2);
                        }}>
                        Continue
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-[#0D6EFD] text-title-p rounded-[4px] border text-white font-normal py-2 focus:outline-none w-full hover:shadow-md">
                        {isSubmitting ? "Submitting..." : "Submit"}
                      </button>
                    )}
                  </div>
                </Form>
              )}
            </Formik>

            <p className="mt-8 font-normal text-center text-title-p text-secondary">
              Already have an account?
              <Link to="/log-in" className="text-[#0D6EFD] underline">
                Log in
              </Link>
            </p>
          </div>
          <Footer />
        </>
      ) : (
        <Formik
          initialValues={{ email: formValues.email }}
          validationSchema={confirmationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            try {
              const dataToSubmit = { ...formValues, email: values.email };
              const res = await dispatch(registerUser(dataToSubmit));
              if (res.type === "registerUser/fulfilled") {
                localStorage.setItem("userId", res.payload?.data?.id);

                // ✅ Set user ID for GA4 session tracking
                window.gtag &&
                  window.gtag("config", "G-RYTHBH8GW2", {
                    user_id: res.payload?.data?.id,
                  });
                // ✅ Track new user
                window.gtag &&
                  window.gtag("event", "new_user_created", {
                    user_id: res.payload?.data?.id || "", // optional but recommended
                    method: "email", // or "google" etc. if social auth
                  });

                navigate("/email-confirmation");
              }
            } catch (error) {
              console.error("Submission error: ", error);
            } finally {
              setSubmitting(false);
            }
          }}>
          {({ isSubmitting }) => (
            <div className="flex items-center justify-center min-h-screen bg-white">
              <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
                <h2 className="mb-6 text-2xl font-semibold text-center text-[#3A57E8]">
                  Confirm Your Email
                </h2>
                <Form className="space-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <Field
                      type="email"
                      name="email"
                      id="email"
                      className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3A57E8] border-[#CED4DA]"
                      placeholder="Enter your email"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="mt-1 text-sm text-red-500"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 text-white rounded-md bg-[#3A57E8] hover:bg-[#2a41b8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3A57E8]">
                      {isSubmitting ? "Submitting..." : "Confirm & Register"}
                    </button>
                  </div>
                </Form>
              </div>
            </div>
          )}
        </Formik>
      )}
    </>
  );
};

export default SignUp;
