import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import Button from "../../components/Button";
import ConfirmModal from "../../components/Modals/ConfirmModal";
import FreePlane from "../../components/Modals/FreePlane";
import Logout from "../../components/Modals/Logout";
import useResetQuestionsHistory from "../../hooks/useResetQuestionsHistory";
import DefaultLayout from "../../layouts/DefaultLayout";
import { NewRegisterSchema } from "../../schema/auth.schema";
import {
  changePassword,
  getCurrentUser,
  logout,
} from "../../store/features/auth/auth.service";
import {
  resetPerformance,
  setUserAutoRenew,
  setUserState,
} from "../../store/features/auth/auth.slice";
import useAutoRenew from "../../hooks/useAutoRenew";

const inputFields = [
  { name: "oldPassword", type: "password", label: "Old Password:" },
  { name: "newPassword", type: "password", label: "New Password:" },
  { name: "confirmPassword", type: "password", label: "Confirm New Password:" },
];

const Settings = () => {
  const { user = {} } = useSelector((state) => state?.user?.selectedUser || {});

  const { resetHistory, isLoading } = useResetQuestionsHistory();

  const memoizedAutoRenewState = useMemo(
    () => user?.userType?.isRenewed || false,
    [user?.userType?.isRenewed]
  );

  const [isAutoRenewEnabled, setIsAutoRenewEnabled] = useState(
    memoizedAutoRenewState
  );

  useEffect(() => {
    setIsAutoRenewEnabled(memoizedAutoRenewState);
  }, [memoizedAutoRenewState]);

  const { toggleAutoRenew, isLoading: isAutoRenewLoading } = useAutoRenew();

  const [isFreePlaneModalOpen, setIsFreePlaneModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isResetHistoryModalOpen, setResetHistoryModalOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const res = await dispatch(logout());
    if (res.type === "logout/fulfilled") navigate("/log-in");
  };

  const handleResetQuestionsHistory = async () => {
    await resetHistory();
    await dispatch(resetPerformance());
    setResetHistoryModalOpen(false);
  };

  const handleAutoRenewToggle = async () => {
    try {
      const newAutoRenewState = !isAutoRenewEnabled;

      const action = newAutoRenewState ? "enabled" : "disabled";

      const res = await toggleAutoRenew(action);
      console.log(res);
      if (res.status === 200) {
        setIsAutoRenewEnabled(newAutoRenewState);

        if (action === "enabled") {
          await dispatch(setUserAutoRenew());
        } else {
          await dispatch(setUserState());
        }
      }
    } catch (error) {
      console.error("Failed to update auto-renew status:", error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      await dispatch(getCurrentUser());
    };
    if (!user?.id) {
      fetchUser();
    }
  }, []);
  const PLAN = user?.userType?.plan || "";

  const isCANCELLED = user?.userType?.isCancelled || "";
  const SUBSCRIPTION_PERIOD =
    (PLAN !== "FREE" && user?.userType?.billingCycle) || "";
  const PAYMENT =
    PLAN === "FREE"
      ? "0 MAD"
      : PLAN === "BASIC"
      ? SUBSCRIPTION_PERIOD === "monthly"
        ? "169 MAD"
        : "99 MAD"
      : PLAN === "PRO"
      ? SUBSCRIPTION_PERIOD === "monthly"
        ? "319 MAD"
        : "199 MAD"
      : "";

  const calculateNextBillingDate = (startDate, planType) => {
    if (planType === "FREE") {
      return "--";
    }

    return user?.userType?.endDate?.slice(0, 10) || "--";
  };

  const NEXT_BILLING_DATE = calculateNextBillingDate(
    user?.userType?.startDate,
    PLAN
  );

  const PRO_USER =
    user?.userType?.plan?.toUpperCase() === "PRO" &&
    user?.userType?.billingCycle === "yearly";

  const calculateEndOfContract = () => {
    const BILLING_CYCLE = user?.userType?.billingCycle;
    const SUBSCRIPTION_START_DATE = user?.userType?.subscriptionStartDate;
    const END_DATE = user?.userType?.endDate;

    if (!END_DATE) {
      return "--";
    }

    if (BILLING_CYCLE === "monthly") {
      const endDate = new Date(END_DATE);
      const currentDate = new Date();
      const diffTime = endDate.getTime() - currentDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} days remaining (${endDate.toLocaleDateString()})`;
    } else if (BILLING_CYCLE === "yearly") {
      if (!SUBSCRIPTION_START_DATE) return "--";

      const startDate = new Date(SUBSCRIPTION_START_DATE);
      const endDate = new Date(startDate);
      endDate.setFullYear(endDate.getFullYear() + 1);

      const currentDate = new Date();

      const remainingMonths =
        (endDate.getFullYear() - currentDate.getFullYear()) * 12 +
        (endDate.getMonth() - currentDate.getMonth());

      return `${remainingMonths} months remaining (${endDate.toLocaleDateString()})`;
    }

    return "--";
  };

  const USER_PLAN = user?.userType?.plan || "FREE";
  return (
    <DefaultLayout>
      <>
        <Breadcrumb pageName="Settings" />
        <div className="mt-3">
          <p className="text-sm font-medium text-black-2">
            If you wish to change your email{" "}
            <span className="text-[#0038FF]">contact</span> us at
            contact@medquest.com
          </p>
        </div>

        <div className="flex justify-end mb-10">
          <Button
            onClick={() => setIsLogoutModalOpen(true)}
            text="Logout"
            className="text-[#DC3545] bg-white font-semibold text-title-p rounded-[4px] px-7 py-2 border border-[#DC3545] focus:outline-none"
          />
          {isLogoutModalOpen && (
            <Logout
              onLogout={handleLogout}
              onClose={() => setIsLogoutModalOpen(false)}
              onConfirm={handleLogout}
            />
          )}
        </div>

        <div className="bg-white rounded-xl border border-[#E6E9EC]">
          <h2 className="text-title-p bg-[#F8F8F8] text-primary font-semibold border-b rounded-t-xl border-[#E9ECEF] px-3 py-2">
            Change Your Password
          </h2>
          <Formik
            initialValues={{
              oldPassword: "",
              newPassword: "",
              confirmPassword: "",
            }}
            validationSchema={NewRegisterSchema}
            onSubmit={async (values, { resetForm }) => {
              try {
                await dispatch(changePassword(values));

                resetForm();
              } catch (error) {}
            }}
          >
            {() => (
              <Form className="p-3 space-y-5">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-1">
                  {inputFields.map((field) => (
                    <div key={field.name}>
                      <label
                        htmlFor={field.name}
                        className="text-[14px] block font-semibold text-black-3"
                      >
                        {field.label}
                      </label>
                      <Field
                        id={field.name}
                        name={field.name}
                        type={field.type}
                        className="mt-3 py-1 px-3 text-secondary text-[14px] font-bold focus:outline-none rounded-[4px] w-full border border-[#E9ECEF] placeholder-secondary"
                      />
                      <ErrorMessage
                        name={field.name}
                        component="div"
                        className="mt-1 text-sm text-red-500"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-sm font-medium text-secondary lg:pb-5">
                  Password should be at least 8 characters long, containing at
                  least 1 lowercase, 1 uppercase, and 1 number.
                </p>
                <Button
                  text="Save Changes to Password"
                  type="submit"
                  className="text-[#0D6EFD] font-semibold text-title-p rounded-[4px] px-3 py-1 border border-[#0D6EFD] focus:outline-none"
                />
              </Form>
            )}
          </Formik>
        </div>

        <div className="mt-6 bg-white rounded-xl border border-[#E6E9EC]">
          <h2 className="text-title-p bg-[#F8F8F8] text-primary font-semibold rounded-t-xl border-b border-[#E9ECEF] p-3">
            Reset Question History
          </h2>
          <div className="p-3">
            <p className="text-[15px] text-black-2 font-normal pb-5">
              This option permanently resets your question and answer history.
              This means that your performance data will be reset, access to the
              questions will be reset, and all timed tests will be deleted. It
              is similar to having a new account. Your personal notes will
              remain saved.
              <strong>Please note that this is irreversible.</strong>
            </p>
            <Button
              text="Reset Question History"
              onClick={() => setResetHistoryModalOpen(true)}
              className="text-[#DC3545] font-semibold text-title-p rounded-[4px] px-3 py-1 border border-[#DC3545] focus:outline-none"
            />
            {isResetHistoryModalOpen && (
              <ConfirmModal
                isLoading={isLoading}
                onConfirm={handleResetQuestionsHistory}
                onClose={() => setResetHistoryModalOpen(false)}
              />
            )}
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg border mb-25 border-[#E6E9EC]">
          <h2 className="text-title-p bg-[#F8F8F8] text-primary font-semibold border-b rounded-t-xl border-[#E9ECEF] p-3">
            Plan & Billing
          </h2>
          <div className="flex flex-col justify-center p-3 space-y-6 xl:flex-row xl:px-11 py-7 xl:space-y-0">
            <div className="flex flex-wrap justify-between w-full gap-y-2 xl:w-1/2 xl:space-y-0">
              <div className="space-y-2 md:w-full xl:space-y-5 xl:w-auto">
                <span className="text-[13px] font-semibold text-black">
                  Plan
                </span>
                <div className="text-[15px] xl:font-semibold text-[#6D6D6D]">
                  {PLAN || "--"}
                </div>
              </div>
              <div className="space-y-2 md:w-full xl:space-y-5 xl:w-auto">
                <span className="text-[13px] font-semibold text-black">
                  Payment
                </span>
                <div className="text-[15px] xl:font-semibold text-[#6D6D6D]">
                  {PAYMENT || "--"}
                </div>
              </div>
              <div className="space-y-2 md:w-full xl:space-y-5 xl:w-auto">
                <span className="text-[13px] font-semibold text-black">
                  Next Billing Cycle
                </span>
                <div className="text-[15px] xl:font-semibold text-[#6D6D6D]">
                  {isCANCELLED && user?.userType?.plan !== "FREE"
                    ? "Cancelled"
                    : NEXT_BILLING_DATE}
                </div>
              </div>
              <div className="space-y-2 md:w-full xl:space-y-5 xl:w-auto">
                <span className="text-[13px] font-semibold text-black">
                  End of Contract
                </span>
                <div className="text-[15px] xl:font-semibold text-[#6D6D6D]">
                  {calculateEndOfContract()}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end justify-between w-full cursor-pointer gap-x-4 xl:flex-row xl:flex-wrap xl:w-1/2 xl:justify-end">
              {USER_PLAN !== "FREE" && (
                <div className="flex flex-col items-center justify-end gap-y-1">
                  <button
                    onClick={handleAutoRenewToggle}
                    disabled={isAutoRenewLoading}
                    className={`relative inline-flex h-4.5 w-10 items-center rounded-full transition-colors focus:outline-none ${
                      isAutoRenewEnabled ? "bg-[#3A57E8]" : "bg-[#8f8f92]"
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        isAutoRenewEnabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                  <span className="text-[11px] font-medium text-[#8f8f92]">
                    AUTO-RENEW
                  </span>
                </div>
              )}
              {!PRO_USER && (
                <div>
                  <Button
                    onClick={() => setIsFreePlaneModalOpen(true)}
                    text="Upgrade"
                    className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                  />
                  {isFreePlaneModalOpen && (
                    <FreePlane onClose={() => setIsFreePlaneModalOpen(false)} />
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-[#E6E9EC] mx-8 mt-4 py-4 font-medium text-center text-[14px] text-black-2">
            For any billing questions please
            <a
              href="mailto:contact@medquest.ma"
              className="text-[#0038FF] hover:underline ml-1"
            >
              contact us
            </a>
            <span className="text-black"> at contact@medquest.ma</span>
          </div>
        </div>
      </>
    </DefaultLayout>
  );
};

export default Settings;
