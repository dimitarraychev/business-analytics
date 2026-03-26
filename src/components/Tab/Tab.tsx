import "./Tab.css";

interface TabProps {
  text: string;
  title: string;
  isSelected?: boolean;
  onClick?: () => void;
}

const Tab = ({ text, title, isSelected, onClick }: TabProps) => {
  return (
    <div
      className={isSelected ? "tab" : "tab tab-ghost"}
      title={title}
      onClick={onClick}
    >
      {text}
    </div>
  );
};

export default Tab;
