import React from "react";

const Button = ({
  type = "button",
  disabled = false,
  text,
  onClick,
  className: styles,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  leftIconStyle = "",
  rightIconStyle = "",
  children,
}) => {
  return (
    <button
      disabled={disabled}
      type={type}
      onClick={onClick}
      className={`${styles} `}
    >
      {LeftIcon && (
        <LeftIcon
          className={`inline-block ${leftIconStyle} mr-0 items-center`}
        />
      )}
      {text ? text : children}
      {RightIcon && <RightIcon className={`inline-block ${rightIconStyle} `} />}
    </button>
  );
};

export default Button;
