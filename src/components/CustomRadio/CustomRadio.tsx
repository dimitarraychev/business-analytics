import "./CustomRadio.css";

interface Option {
  label: string;
  value: string;
  disabled?: boolean;
}

interface CustomRadioProps {
  name: string;
  value: string;
  label?: string;
  options: Option[];
  onChange: (value: any) => void;
}

const CustomRadio = ({
  name,
  label,
  value,
  options,
  onChange,
}: CustomRadioProps) => {
  return (
    <div className="custom-radio">
      {label != "" && <label htmlFor={name}>{label}</label>}
      <div className="customCheckBoxHolder">
        {options.map((option) => {
          const id = `${name}-${option.value}`;

          return (
            <div key={id}>
              <input
                className="customCheckBoxInput"
                type="radio"
                id={id}
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={() => onChange(option.value)}
              />

              <label className="customCheckBoxWrapper" htmlFor={id}>
                <div
                  className={
                    "customCheckBox" + `${option.disabled ? " disabled" : ""}`
                  }
                >
                  <div className="inner">{option.label}</div>
                </div>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomRadio;
