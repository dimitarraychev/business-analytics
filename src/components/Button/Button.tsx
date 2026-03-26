import "./Button.css";

interface ButtonProps {
  text?: string;
  type?: "button" | "submit" | "reset" | undefined;
  isGhost?: boolean;
  isDisabled?: boolean;
  icon?: string;
  classNameProp?: string;
  title: string;
  onClick?: () => void;
}

const Button = ({
  text,
  title,
  type,
  icon,
  classNameProp,
  isGhost,
  isDisabled,
  onClick,
}: ButtonProps) => {
  const handleClick = () => {
    if (isDisabled) return;
    onClick && onClick();
  };

  return (
    <button
      className={`btn
    ${isGhost ? "btn-ghost" : ""}
    ${isDisabled ? "btn-disabled" : ""}
    ${classNameProp ? `btn-${classNameProp}` : ""}`.trim()}
      type={type || "button"}
      onClick={handleClick}
      title={title}
    >
      {text && text}
      {icon && <img className="btn-icon" src={icon} alt="text" />}
    </button>
  );
};

export default Button;
