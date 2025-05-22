import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import Progress from "../../components/Progress";
import RecentTests from "../../components/RecentTests";
import DefaultLayout from "../../layouts/DefaultLayout";
import { getCurrentUser } from "../../store/features/auth/auth.service";

const Home = () => {
  const { user = {} } = useSelector((state) => state?.user?.selectedUser || {});
  const dispatch = useDispatch();

  const userType = user?.userType?.plan || "";
  const isUserPremium = userType === "FREE";
  useEffect(() => {
    const removeStartQuizItems = () => {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("quiz_")) {
          localStorage.removeItem(key);
        }
      });
    };

    removeStartQuizItems();

    const fetchUser = async () => {
      await dispatch(getCurrentUser());
    };

    if (!user.id) {
      fetchUser();
    }
  }, [dispatch]);
  return (
    <DefaultLayout>
      <Breadcrumb pageName={`Welcome ${user?.lastName || ""}!`} />
      <div className="flex justify-end my-4 gap-x-3 md:gap-x-5 gap-y-5 lg:mb-8">
        {isUserPremium && (
          <Link to="/subscription">
            <button className="bg-[#3A57E8] p-2 text-nowrap text-sm font-semibold md:text-title-p text-white md:py-[10px] md:px-8 rounded-[6px]">
              Get Full Subscription
            </button>
          </Link>
        )}
        <Link to="/question-bank">
          <button className="bg-[#3A57E8] p-2 text-sm text-nowrap font-semibold md:text-title-p text-white md:py-[10px] md:px-8 rounded-[6px]">
            Create Quiz
          </button>
        </Link>
      </div>
      <RecentTests />
      <Progress />
    </DefaultLayout>
  );
};

export default Home;
