import React, { useEffect, useState } from "react";
import { FaChevronDown, FaMinus, FaPlus } from "react-icons/fa";
import { IoSearchSharp } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { SlArrowRight } from "react-icons/sl";
import { useDispatch, useSelector } from "react-redux";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import CreateQuizModal from "../../components/CreateQuizModal";
import Skeleton from "../../components/Skeleton";
import DefaultLayout from "../../layouts/DefaultLayout";
import { getCurrentUser } from "../../store/features/auth/auth.service";
import { getSubjectQuestions } from "../../store/features/quiz/quiz.service";
import RecentTest from "./RecentTest";
import { categoryItems } from "./Topic-constant";

const universityNames = categoryItems.map((item) => item.name);

const Topic = () => {
  const { user = {} } = useSelector((state) => state?.user?.selectedUser || {});

  const userType =
    user?.userType?.plan === "FREE" ||
    (user?.userType?.plan?.toUpperCase() === "BASIC" &&
      user?.userType?.isActive === true);

  const { subjectQuestions = [] } = useSelector(
    (state) => state?.quiz?.subjectQuestions || []
  );

  const [selectedLeftCategories, setSelectedLeftCategories] = useState([]); //Subjects
  const [selectedLeftSubcategories, setSelectedLeftSubcategories] = useState(
    {}
  ); // cities
  const [expandedCategories, setExpandedCategories] = useState([]); //boolean for open or close the + buttons

  const [selectedCategories, setSelectedCategories] = useState(["All"]);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        if (!user?.id) {
          const userResponse = await dispatch(getCurrentUser());
          if (userResponse.type === "getCurrentUser/fulfilled") {
            const fetchedUser = userResponse.payload.user;

            if (fetchedUser?.id) {
              const { city, year } = fetchedUser;
              const subjectResponse = await dispatch(
                getSubjectQuestions({
                  city,
                  year,
                  plan: fetchedUser?.userType?.plan || "",
                })
              );
              if (subjectResponse.type === "getSubjectQuestions/fulfilled") {
                const questions =
                  subjectResponse.payload?.data?.subjectQuestions;
                initializeSelection(questions);
              }
            }
          }
        } else if (user?.id && subjectQuestions?.length === 0) {
          const { city, year } = user;
          const subjectResponse = await dispatch(
            getSubjectQuestions({ city, year, plan: user?.userType?.plan })
          );
          if (subjectResponse.type === "getSubjectQuestions/fulfilled") {
            const questions = subjectResponse.payload?.data?.subjectQuestions;
            initializeSelection(questions);
          }
        } else {
          initializeSelection(subjectQuestions);
        }
      } catch (error) {
        console.error("Error initializing data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const initializeSelection = (questions) => {
      // For free/basic users, don't select topics by default
      // if (userType) {
      //   setSelectedLeftCategories([]);
      // } else {
      //   // For premium users, select all topics by default
      //   setSelectedLeftCategories(questions.map((_, index) => index));
      // }
      // Always select all schools by default for all user types
      setSelectedLeftSubcategories(
        questions.reduce((acc, category, index) => {
          acc[index] = category.schools.map((school) => school.school);
          return acc;
        }, {})
      );
    };

    initializeData();
  }, []);

  const [isModalOpen, setModalOpen] = useState(false);
  const [formdata, setFormData] = useState({
    name: "",
    mode: "Tutor",
    questionCount: 10,
    university: user?.university || "",
    timerDuration: "",
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    subjects: "",
    university: "",
  });

  const openModal = () => {
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      setModalOpen(true);
    } else {
      setFormErrors(errors);
    }
  };

  const closeModal = () => setModalOpen(false);

  const validateForm = () => {
    const errors = {};

    if (!formdata.name.trim()) {
      errors.name = "Quiz name is required";
    } else if (formdata.name.length < 3) {
      errors.name = "Quiz name must be at least 3 characters";
    }

    if (selectedLeftCategories.length === 0) {
      errors.subjects =
        subjectQuestions?.length > 0
          ? "Please select at least one subject"
          : "You cannot create a quiz because subjects are not available for your year";
    }

    if (selectedCategories.length === 0) {
      errors.university = "Please select at least one university";
    }
    if (
      formdata.mode === "Timed" &&
      (!formdata.timerDuration ||
        formdata.timerDuration < 1 ||
        formdata.timerDuration > 90)
    ) {
      errors.timerDuration =
        "Please enter a valid time between 1 and 90 minutes";
    }

    return errors;
  };

  // const togleCategory = (category) => {
  //   if (userType) return;

  //   if (selectedCategories.includes(category)) {
  //     setSelectedCategories(
  //       selectedCategories.filter((item) => item !== category)
  //     );

  //     setSelectedLeftCategories([]);
  //     setSelectedLeftSubcategories({});
  //   } else {
  //     setSelectedCategories([...selectedCategories, category]);

  //     setSelectedLeftCategories([]);
  //     setSelectedLeftSubcategories({});
  //   }
  //   setFormErrors((prev) => ({ ...prev, university: "" }));
  // };

  const filterSelectedSchoolsByUniversities = (
    selectedCategories,
    currentSubcategories
  ) => {
    const updatedSubcategories = {};

    Object.entries(currentSubcategories).forEach(([categoryIndex, schools]) => {
      // If "All" is selected, keep all schools
      if (selectedCategories.includes("All")) {
        updatedSubcategories[categoryIndex] = schools;
        return;
      }

      // Filter schools based on selected universities
      const filteredSchools = schools.filter((school) =>
        selectedCategories.some((university) => {
          const universityObj = categoryItems.find(
            (item) => item.name === university
          );
          return school === universityObj?.city;
        })
      );

      // Only keep the category if it has matching schools
      if (filteredSchools.length > 0) {
        updatedSubcategories[categoryIndex] = filteredSchools;
      }
    });

    return updatedSubcategories;
  };

  // Update the togleCategory function
  const togleCategory = (category) => {
    if (userType) return;

    let newSelectedCategories;
    if (selectedCategories.includes(category)) {
      newSelectedCategories = selectedCategories.filter(
        (item) => item !== category
      );
    } else {
      newSelectedCategories = [...selectedCategories, category];
    }

    setSelectedCategories(newSelectedCategories);

    // Filter schools based on new university selection
    const updatedSubcategories = filterSelectedSchoolsByUniversities(
      newSelectedCategories,
      selectedLeftSubcategories
    );

    // Update selected categories based on remaining schools
    const remainingCategories = Object.keys(updatedSubcategories).map(Number);
    setSelectedLeftCategories(remainingCategories);
    setSelectedLeftSubcategories(updatedSubcategories);

    setFormErrors((prev) => ({ ...prev, university: "" }));
  };
  const [visibleItems, setVisibleItems] = useState(4);
  const loadMoreItems = () => {
    setVisibleItems((prevVisibleItems) => prevVisibleItems + 2);
  };

  const removeCategory = (category) => {
    if (userType) return;
    setSelectedCategories(
      selectedCategories.filter((item) => item !== category)
    );
  };

  const filteredCategories = universityNames.filter((category) =>
    category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLeftCategoryCheckbox = (category, index) => {
    if (userType) {
      // For free/basic users - only handle topic selection, don't modify schools
      if (selectedLeftCategories.includes(index)) {
        setSelectedLeftCategories(
          selectedLeftCategories.filter((i) => i !== index)
        );
      } else {
        setSelectedLeftCategories([...selectedLeftCategories, index]);
      }
    } else {
      // For pro users - keep existing behavior
      const updatedSubcategories = { ...selectedLeftSubcategories };

      if (selectedLeftCategories.includes(index)) {
        setSelectedLeftCategories(
          selectedLeftCategories.filter((i) => i !== index)
        );
        delete updatedSubcategories[index];
      } else {
        const visibleSchools = getFilteredSchools(category).map(
          (sub) => sub.school
        );
        updatedSubcategories[index] = visibleSchools;
        setSelectedLeftCategories([...selectedLeftCategories, index]);
      }

      setSelectedLeftSubcategories(updatedSubcategories);
    }
    setFormErrors((prev) => ({ ...prev, subjects: "" }));
  };
  // const handleLeftCategoryCheckbox = (category, index) => {
  //   if (userType) return;
  //   const updatedSubcategories = { ...selectedLeftSubcategories };

  //   if (selectedLeftCategories.includes(index)) {
  //     setSelectedLeftCategories(
  //       selectedLeftCategories.filter((i) => i !== index)
  //     );
  //     delete updatedSubcategories[index];
  //   } else {
  //     const visibleSchools = getFilteredSchools(category).map(
  //       (sub) => sub.school
  //     );
  //     updatedSubcategories[index] = visibleSchools;
  //     setSelectedLeftCategories([...selectedLeftCategories, index]);
  //   }

  //   setSelectedLeftSubcategories(updatedSubcategories);
  //   setFormErrors((prev) => ({ ...prev, subjects: "" }));
  // };

  const handleLeftSubcategoryCheckbox = (categoryIndex, subcategoryName) => {
    if (userType) return;

    const updatedSubcategories = { ...selectedLeftSubcategories };

    if (!updatedSubcategories[categoryIndex]) {
      updatedSubcategories[categoryIndex] = [];
    }

    if (updatedSubcategories[categoryIndex]?.includes(subcategoryName)) {
      updatedSubcategories[categoryIndex] = updatedSubcategories[
        categoryIndex
      ].filter((name) => name !== subcategoryName);

      if (updatedSubcategories[categoryIndex].length === 0) {
        delete updatedSubcategories[categoryIndex];
        setSelectedLeftCategories(
          selectedLeftCategories.filter((i) => i !== categoryIndex)
        );
      }
    } else {
      updatedSubcategories[categoryIndex].push(subcategoryName);
      if (!selectedLeftCategories.includes(categoryIndex)) {
        setSelectedLeftCategories([...selectedLeftCategories, categoryIndex]);
      }
    }

    setSelectedLeftSubcategories(updatedSubcategories);
    setFormErrors((prev) => ({ ...prev, subjects: "" }));
  };

  const toggleCategory = (index) => {
    if (expandedCategories.includes(index)) {
      setExpandedCategories(expandedCategories.filter((i) => i !== index));
    } else {
      setExpandedCategories([...expandedCategories, index]);
    }
  };

  const subjects = selectedLeftCategories.map((index) => ({
    name: subjectQuestions.length !== 0 && subjectQuestions[index].subjectName,
    city: selectedLeftSubcategories[index] || [],
  }));

  const values = {
    name: formdata.name,
    university: selectedCategories,
    mode: formdata.mode,
    questionCount: formdata.questionCount,
    subject: subjects,
  };

  if (formdata.mode === "Timed") {
    values.timerDuration = formdata.timerDuration;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length === 0) {
      openModal();
    } else {
      setFormErrors(errors);
    }
  };

  const [showUniversities, setShowUniversities] = useState(false);

  const handleToggle = () => {
    if (userType) return;
    setShowUniversities(!showUniversities);
  };

  const handleQuizNameChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formdata, name: value });
    if (value.trim()) {
      setFormErrors((prev) => ({ ...prev, name: "" }));
    }
  };

  const handleTimerDurationChange = (e) => {
    // Only allow numbers
    const value = e.target.value.replace(/[^0-9]/g, "");

    if (value === "") {
      setFormData({ ...formdata, timerDuration: "" });
    } else if (parseInt(value) >= 1 && parseInt(value) <= 90) {
      setFormData({ ...formdata, timerDuration: value });
      setFormErrors((prev) => ({ ...prev, timerDuration: "" }));
    } else {
      setFormData({ ...formdata, timerDuration: value });
      setFormErrors((prev) => ({
        ...prev,
        timerDuration: "Please enter a valid time between 1 and 90 minutes",
      }));
    }
  };

  const getFilteredSchools = (category) => {
    if (selectedCategories.length === 0) return category.schools;

    if (selectedCategories.includes("All")) return category.schools;

    return category.schools.filter((school) =>
      selectedCategories.some((university) => {
        const universityObj = categoryItems.find(
          (item) => item.name === university
        );

        return school.school === universityObj?.city;
      })
    );
  };

  const calculateFilteredTotal = (category, selectedCategories) => {
    if (selectedCategories.length === 0 || selectedCategories.includes("All")) {
      return category.schools.reduce(
        (total, school) => total + school.count,
        0
      );
    }

    const filteredTotal = category.schools
      .filter((school) =>
        selectedCategories.some((university) => {
          const universityObj = categoryItems.find(
            (item) => item.name === university
          );
          return school.school === universityObj?.city;
        })
      )
      .reduce((total, school) => total + school.count, 0);

    return filteredTotal || 0;
  };

  return (
    <DefaultLayout>
      <div className="">
        <Breadcrumb pageName="Topics" />

        <div className="mb-13">
          <p className="text-[14px] text-black-2 font-medium">
            Welcome to the Question Bank.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-5 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg">
              <div className="flex flex-wrap gap-4 justify-between lg:gap-7">
                <div className="w-[200px]">
                  <label
                    htmlFor="noOfQuestions"
                    className="block text-[14px] font-semibold text-[#111827]"
                  >
                    Quiz Name
                  </label>
                  <input
                    type="text"
                    placeholder="Create a test name"
                    value={formdata.name}
                    onChange={handleQuizNameChange}
                    className={`mt-1 px-4 py-2 w-full text-[#838f9b] text-title-p focus:outline-none rounded-[4px] border ${
                      formErrors.name ? "border-red-500" : "border-[#CED4DA]"
                    } placeholder-secondary`}
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors.name}
                    </p>
                  )}
                </div>

                <div className="w-[200px] relative">
                  <label
                    htmlFor="noOfQuestions"
                    className="block text-[14px] font-semibold text-[#111827]"
                  >
                    No. of questions
                  </label>
                  <select
                    value={formdata.questionCount}
                    onChange={(e) =>
                      setFormData({
                        ...formdata,
                        questionCount: e.target.value,
                      })
                    }
                    className="mt-1 px-4 py-2 w-full h-[42px] text-[#838f9b] text-title-p focus:outline-none rounded-[4px] border border-[#CED4DA] bg-white appearance-none pr-8"
                  >
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                    <option value="40">40</option>
                    <option value="50">50</option>
                  </select>
                  <span className="absolute top-[38px] right-3 text-[#9CA3AF] pointer-events-none">
                    <FaChevronDown />
                  </span>
                </div>

                <div
                  className="w-[200px]"
                  title={
                    user?.userType?.plan === "FREE"
                      ? "Selection is not available for your plan.Please upgrade your plan"
                      : undefined
                  }
                >
                  <label
                    htmlFor="time"
                    className={`block text-[14px] font-semibold ${
                      user?.userType?.plan === "FREE"
                        ? "text-[#9CA3AF]"
                        : "text-[#111827]"
                    }`}
                  >
                    Time (minutes)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    disabled={
                      user?.userType?.plan === "FREE" || values.mode !== "Timed"
                    }
                    placeholder="Enter time in minutes"
                    value={formdata.timerDuration}
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    name="timerDuration"
                    onChange={handleTimerDurationChange}
                    className={`mt-1 px-4 py-2 w-full text-[#838f9b] text-title-p focus:outline-none rounded-[4px] border ${
                      formErrors.timerDuration
                        ? "border-red-500"
                        : "border-[#CED4DA]"
                    } placeholder-secondary`}
                  />
                  {formErrors.timerDuration && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors.timerDuration}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end items-center mb-2">
                <div>
                  <button
                    type="submit"
                    className="bg-[#007AFF] mt-4 text-[12px] flex items-center gap-3 font-semibold text-white px-4 py-3 rounded-md"
                  >
                    Create New Quiz
                    <SlArrowRight className="text-white" />
                  </button>
                  <CreateQuizModal
                    formdata={formdata}
                    values={values}
                    isOpen={isModalOpen}
                    closeModal={closeModal}
                    setFormData={setFormData}
                  />
                </div>
              </div>
            </form>

            <div className="bg-white rounded-lg border border-[#E6E9EC]">
              <div className="flex justify-between items-center p-4 border-b border-[#DEE2E6]">
                <h2 className="font-semibold text-title-sm text-primary">
                  Categories - {user?.year?.replace(/(\D)(\d)/, "$1 $2") || ""}
                </h2>
                <h2 className="text-[13px] text-primary font-bold">
                  Attempted
                </h2>
              </div>

              {formErrors.subjects && (
                <p className="text-red-500 text-sm p-4 border-b border-[#DEE2E6]">
                  {formErrors.subjects}
                </p>
              )}

              <div
                className="grid gap-3"
                title={
                  userType
                    ? "Selection is not available for your plan.Please upgrade your plan"
                    : undefined
                }
              >
                {isLoading ? (
                  <Skeleton variant="light" />
                ) : subjectQuestions?.length === 0 ? (
                  <div className="p-4 text-sm font-medium">
                    No subjects found for this year
                  </div>
                ) : (
                  subjectQuestions?.map((category, index) => (
                    <div
                      key={index}
                      className={`${
                        calculateFilteredTotal(category, selectedCategories) ===
                        0
                          ? "hidden"
                          : "block"
                      }`}
                    >
                      <div className="flex justify-between items-center border-b border-[#DEE2E6] py-2 px-4">
                        <div
                          className="flex items-center"
                          // title={
                          //   userType
                          //     ? "Selection is not available for your plan.Please upgrade your plan"
                          //     : undefined
                          // }
                        >
                          <input
                            type="checkbox"
                            className="mr-3 w-4 h-4 cursor-pointer"
                            // disabled={userType}
                            checked={selectedLeftCategories.includes(index)}
                            onChange={() =>
                              handleLeftCategoryCheckbox(category, index)
                            }
                          />
                          <span className="text-[14px] text-primary lg:min-w-0  lg:max-w-full text-wrap">
                            {category?.subjectName}
                          </span>
                          <span
                            className="cursor-pointer text-[10px] bg-[#EBEEFD] p-1 text-[#3A57E8] border border-[#3A57E8] ml-3"
                            onClick={() => toggleCategory(index)}
                          >
                            {expandedCategories.includes(index) ? (
                              <FaMinus />
                            ) : (
                              <FaPlus />
                            )}
                          </span>
                        </div>
                        <span className="text-white text-[10px] font-semibold text-nowrap bg-[#007AFF] min-w-11 text-center py-1 rounded-md">
                          1 of&nbsp;
                          {calculateFilteredTotal(category, selectedCategories)}
                        </span>
                      </div>
                      {expandedCategories.includes(index) &&
                        category?.schools && (
                          <div>
                            {getFilteredSchools(category).map(
                              (subcategory, subIndex) => (
                                <div
                                  key={subIndex}
                                  className="flex justify-between items-center pl-12 py-2 px-4 border-b border-[#DEE2E6]"
                                >
                                  <div
                                    className="flex justify-start items-center"
                                    title={
                                      userType
                                        ? "Selection is not available for your plan.Please upgrade your plan"
                                        : undefined
                                    }
                                  >
                                    <input
                                      type="checkbox"
                                      className="mr-3 cursor-pointer"
                                      checked={
                                        selectedLeftSubcategories[
                                          index
                                        ]?.includes(subcategory?.school) ||
                                        false
                                      }
                                      disabled={userType}
                                      onChange={() =>
                                        handleLeftSubcategoryCheckbox(
                                          index,
                                          subcategory?.school
                                        )
                                      }
                                    />
                                    <span className="text-[14px] text-primary">
                                      {subcategory?.school}
                                    </span>
                                  </div>
                                  <span className="text-white text-[10px] font-semibold bg-[#007AFF] px-2 py-1 rounded-md">
                                    1 of {subcategory?.count}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-y-6">
            <div className="bg-white rounded-lg border border-[#E6E9EC]">
              <h2 className="text-title-sm text-primary font-semibold border-b border-[#E9ECEF] px-6 py-5">
                Test Mode
              </h2>
              <div
                className="grid grid-cols-2 px-4 py-6"
                title={
                  user?.userType?.plan === "FREE"
                    ? "Timed Mode is not available for your plan.Please upgrade your plan"
                    : undefined
                }
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    disabled={user?.userType?.plan === "FREE"}
                    name="mode"
                    value="Timed"
                    checked={formdata.mode === "Timed"}
                    onChange={(e) => {
                      if (user?.userType?.plan !== "FREE") {
                        setFormData({ ...formdata, mode: e.target.value });
                      }
                    }}
                    className="w-[16px] h-[16px] mr-2"
                  />
                  <label className="text-[15px] font-medium text-primary">
                    Timed
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="mode"
                    value="Tutor"
                    checked={formdata.mode === "Tutor"}
                    onChange={(e) =>
                      setFormData({ ...formdata, mode: e.target.value })
                    }
                    className="w-[16px] h-[16px] mr-2"
                  />
                  <label className="text-[15px] font-medium text-primary">
                    Tutor
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-[#E6E9EC]">
              <h2 className="text-title-sm text-primary font-semibold border-b border-[#DEE2E6] px-6 py-4">
                University
              </h2>
              <div
                className={`flex items-center flex-wrap border-b border-[#DEE2E6] px-7 `}
                title={
                  userType
                    ? "University selection is not available for your plan. Please upgrade your plan"
                    : undefined
                }
              >
                {selectedCategories.map((category, index) => (
                  <div
                    key={index}
                    className="bg-[#E5E6E6] flex items-center px-3 py-1 rounded-lg mr-6 my-2"
                  >
                    <span className="text-[14px]">{category}</span>
                    <button
                      className="ml-2"
                      onClick={() => removeCategory(category)}
                    >
                      <RxCross2 />
                    </button>
                  </div>
                ))}
              </div>
              <div className="relative  cursor-pointer border m-4 rounded border-[#9DA2AC]">
                <input
                  type="text"
                  onClick={handleToggle}
                  placeholder="Search"
                  title={
                    userType
                      ? "University search is not available for your plan. Please upgrade your plan"
                      : undefined
                  }
                  className="px-7 py-2 w-full rounded-md cursor-pointer focus:outline-none placeholder-secondary"
                  value={searchTerm}
                  disabled={userType}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (!userType) {
                      setShowUniversities(true);
                    }
                  }}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary">
                  <IoSearchSharp size={17} className="text-secondary" />
                </span>
              </div>

              {showUniversities && (
                <div className="space-y-2">
                  {filteredCategories
                    .slice(0, visibleItems)
                    .map((category, index) => (
                      <div
                        key={index}
                        className="flex items-center px-4 py-3 border-b border-[#DEE2E6]"
                      >
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={selectedCategories.includes(category)}
                          onChange={() => togleCategory(category)}
                        />
                        <label className="text-[14px] text-primary">
                          {category}
                        </label>
                      </div>
                    ))}

                  {visibleItems < filteredCategories.length && (
                    <div className="py-3 pl-4 text-left">
                      <button
                        onClick={loadMoreItems}
                        className="bg-[#007AFF] text-[14px]  font-semibold text-white px-4 py-2 rounded-md"
                      >
                        Load More
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {formErrors?.university && (
              <p className="text-sm text-red-500">{formErrors.university}</p>
            )}
            <h2 className="font-semibold text-title-sm text-primary">
              Recent Tests
            </h2>

            <RecentTest />
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Topic;
