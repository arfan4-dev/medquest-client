import { Radio, RadioGroup } from "@headlessui/react";
import { useEffect, useState } from "react";
import { HiMiniCheckBadge } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import CancellationPolicy from "../../components/CancellationPolicy";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import useCheckoutSession from "../../hooks/useCheckoutSession";
import { getCurrentUser } from "../../store/features/auth/auth.service";

const pricing = {
  frequencies: [
    { value: "monthly", label: "Monthly", priceSuffix: "/month" },
    { value: "yearly", label: "Yearly", priceSuffix: "/year" },
  ],
  tiers: [
    {
      name: "Compare plans",
      Description: "Choose your plan according to your needs",
      id: "tier-comparison",
      features: [
        { name: "Number of Questions" },
        { name: "Monthly Test Creation" },
        { name: "Performance Analytics" },
        { name: "Timed Test Mode" },
        { name: "University-Specific Questions" },
        { name: "24/7 customer support" },
      ],
      isComparison: true,
    },
    {
      name: "Free",
      id: "tier-free",
      price: { monthly: "0", yearly: "0" },
      yearlyPriceSuffix: "MAD",
      features: [
        { name: "4000+ Questions" },
        { name: "Up to 10 (100 Qs max per test)" },
        { name: "—" },
        { name: "—" },
        { name: "—" },
        { name: "—" },
      ],
      buttonText: "Already on this plan",
      buttonDisabled: true,
    },
    {
      name: "Basic",
      id: "tier-basic",
      price: { monthly: "169", yearly: "99" },
      yearlyPriceSuffix: "MAD",
      features: [
        {
          name: (
            <>
              <div>40,000+ Questions</div>
              <div style={{ color: "#858BA0" }}>Pages Add-ons on Demand</div>
            </>
          ),
        },
        { name: "Unlimited" },
        {
          name: (
            <>
              <div>General rankings</div>
              <div>Weekly, Monthly, Semester</div>
            </>
          ),
        },
        {
          name: (
            <HiMiniCheckBadge
              size={22}
              style={{ color: "#3A57E8", margin: "auto" }}
            />
          ),
        },
        { name: "—" },
        { name: "—" },
      ],
      buttonText: "Choose This Plan",
      buttonDisabled: false,
    },
    {
      name: "Pro",
      id: "tier-pro",
      price: { monthly: "319", yearly: "199" },
      yearlyPriceSuffix: "MAD",
      features: [
        {
          name: (
            <>
              <div>80,000+ Questions</div>
              <div style={{ color: "#858BA0" }}>Pages Add-ons on Demand</div>
            </>
          ),
        },
        { name: "Unlimited" },
        {
          name: (
            <>
              <div>Rankings by school and topic</div>
              <div>Weekly, Monthly, Semester</div>
            </>
          ),
        },
        {
          name: (
            <HiMiniCheckBadge
              size={22}
              style={{ color: "#3A57E8", margin: "auto" }}
            />
          ),
        },
        {
          name: (
            <HiMiniCheckBadge
              size={22}
              style={{ color: "#3A57E8", margin: "auto" }}
            />
          ),
        },
        {
          name: (
            <HiMiniCheckBadge
              size={22}
              style={{ color: "#3A57E8", margin: "auto" }}
            />
          ),
        },
      ],
      buttonText: "Choose This Plan",
      buttonDisabled: false,
    },
  ],
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Subscription = () => {
  const [frequency, setFrequency] = useState(pricing.frequencies[1]);
  const { createCheckoutSession, isLoading } = useCheckoutSession();
  const dispatch = useDispatch();
  const { user = {} } = useSelector((state) => state?.user?.selectedUser || {});
  const { id: userId = "", firstName = "" } = user || {};

  console.log(firstName, "User name");
  const plan = user?.userType?.plan || "";
  const PREMIUM_USER =
    plan === "PRO" && user?.userType?.billingCycle === "yearly";

  const handleChoosePlan = async (planName) => {
    const selectedPlan = pricing.tiers.find((tier) => tier.name === planName);
    if (!selectedPlan) return;

    try {
      const sessionData = await createCheckoutSession(
        selectedPlan.name,
        frequency.value,
        firstName
      );

      if (sessionData?.url) {
        window.location.href = sessionData.url;
      }
    } catch (err) {
      console.error("Error during checkout session:", err);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      await dispatch(getCurrentUser());
    };
    if (!user?.id) {
      fetchUser();
    }
  }, [dispatch]);

  return (
    <>
      <Header />
      <div className="bg-gray-900">
        <main>
          <div className="max-w-screen-xl px-6 mx-auto mt-12 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-title-lg font-semibold text-[#3A57E8]">
                Choose Your Plan
              </h1>
            </div>

            <Link to={-1} className="relative inline-block my-6 md:my-0">
              <Button
                text="Back"
                type="button"
                leftIconStyle="text-[#ADB5BD] text-[25px]"
                className="bg-white  border flex items-center my-3 border-[#E9ECEF] text-secondary rounded-[4px] py-2 px-4 hover:bg-gray-100 focus:outline-none hover:shadow-md"
              />
            </Link>

            <div className="flex justify-center lg:mt-7">
              <fieldset aria-label="Payment frequency">
                <RadioGroup
                  value={frequency}
                  onChange={setFrequency}
                  className="grid grid-cols-2 gap-x-1 border rounded-md border-[#3A57E8]"
                >
                  {pricing.frequencies.map((option) => (
                    <Radio
                      key={option.value}
                      value={option}
                      className="cursor-pointer px-8 py-3 data-[checked]:bg-[#3A57E8] data-[checked]:text-white text-title-p font-semibold text-[#3A57E8]"
                    >
                      {option.label}
                    </Radio>
                  ))}
                </RadioGroup>
              </fieldset>
            </div>

            <div className="max-w-screen-xl py-6 mx-auto my-10 overflow-x-auto">
              <table className="min-w-full border-collapse border border-[#E6E9F5]">
                <thead>
                  <tr>
                    {pricing?.tiers?.map((tier) => (
                      <th
                        key={tier.id}
                        className={classNames(
                          "bg-gray-200 border border-[#E6E9F5]",
                          plan === tier?.name?.toUpperCase() &&
                            !tier.isComparison
                            ? "bg-gray-300"
                            : ""
                        )}
                        style={{
                          width: "calc(100% / " + pricing.tiers.length + ")",
                        }}
                      >
                        <div className="p-8">
                          <div
                            className={classNames(
                              tier.name === "Compare plans"
                                ? "font-bold text-[#3A57E8] lg:text-title-md text-left"
                                : "text-[#3A57E8] font-bold lg:text-[40px] text-center"
                            )}
                          >
                            {tier.name}
                          </div>
                          <div className="text-[#858BA0] text-sm font-medium text-left">
                            {tier.Description}
                          </div>
                          {tier.isComparison ? null : (
                            <div>
                              <p className="flex justify-center text-[#858BA0] font-medium items-center gap-2 my-4">
                                <span className="text-[14px]">
                                  {tier.yearlyPriceSuffix}
                                </span>
                                <span className="flex items-start justify-start lg:text-[32px]">
                                  {tier.price[frequency.value]}
                                </span>
                                <span>
                                  {pricing.frequencies[0].priceSuffix}
                                </span>
                              </p>
                              <button
                                className={classNames(
                                  "mt-2 md:py-2 p-2 md:px-4 md:text-base text-sm text-nowrap rounded",
                                  tier.name === "Free"
                                    ? "bg-[#939393] text-white cursor-not-allowed"
                                    : plan === tier.name.toUpperCase() &&
                                      frequency.value ===
                                        user?.userType?.billingCycle
                                    ? "bg-[#939393] text-white cursor-not-allowed"
                                    : "bg-[#3A57E8] text-white"
                                )}
                                onClick={() => handleChoosePlan(tier.name)}
                                disabled={
                                  tier.name === "Free" ||
                                  (plan === tier.name.toUpperCase() &&
                                    frequency.value ===
                                      user?.userType?.billingCycle) ||
                                  PREMIUM_USER ||
                                  isLoading
                                }
                              >
                                {tier.name === "Free"
                                  ? "Free Plan"
                                  : plan === tier.name.toUpperCase() &&
                                    frequency.value ===
                                      user?.userType?.billingCycle
                                  ? "Already on this plan"
                                  : tier.buttonText}
                              </button>
                            </div>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {pricing.tiers[0].features.map((feature, index) => (
                    <tr key={index} className="border border-[#E6E9F5]">
                      {pricing.tiers.map((tier) => (
                        <td
                          key={tier.id}
                          className={classNames(
                            "border font-medium text-[#3A57E8] text border-[#E6E9F5] p-7",
                            tier.name === "Compare plans"
                              ? "font-medium text-[#3A57E8] text-title-xsm text-lest"
                              : "text-[#3A57E8] font-medium text-[14px] text-center"
                          )}
                          style={{
                            width: "calc(100% / " + pricing.tiers.length + ")",
                          }}
                        >
                          {tier.isComparison
                            ? feature.name
                            : tier.features[index].name}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
      <CancellationPolicy />
      <Footer />
    </>
  );
};

export default Subscription;
