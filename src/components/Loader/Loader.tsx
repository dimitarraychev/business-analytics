import "./Loader.css";

interface LoaderProps {
  size: number;
}

const Loader = ({ size }: LoaderProps) => {
  return (
    <div
      className="dot-spinner"
      style={{ "--uib-size": `${size}rem` } as React.CSSProperties}
    >
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
    </div>
  );
};

export default Loader;
