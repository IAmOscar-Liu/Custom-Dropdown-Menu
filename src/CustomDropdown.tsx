import { CSSProperties, ReactNode, useEffect, useRef, useState } from "react";
import style from "./CustomDropdown.module.css";

function CustomDropdown<T extends { id: string; name: string }>({
  width,
  style: customStyle,
  className,
  placeholder,
  options,
  optionTemplate,
  valueTemplate,
  value,
  onChange,
}: {
  width?: number;
  style?: CSSProperties;
  className?: string;
  placeholder?: string;
  options: T[];
  optionTemplate?: (value: {
    value: T;
    isActive: boolean;
    isSelected: boolean;
  }) => ReactNode;
  valueTemplate?: (value: { value: T | undefined }) => ReactNode;
  value?: T | undefined;
  onChange: (value: T) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dropdownRef.current || !isOpen) return;

    const clickEventHandler = (e: MouseEvent) => {
      const dialogDimensions = dropdownRef.current!.getBoundingClientRect();
      if (
        e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom
      ) {
        setIsOpen(false);
      }
    };

    const keydownEventHandler = (e: KeyboardEvent) => {
      const currentSelectedIdx = options.findIndex((o) => o.id === value?.id);

      if (e.code === "Enter") {
        setIsOpen(false);
      } else if (e.code === "ArrowUp") {
        if (currentSelectedIdx === -1) onChange(options[options.length - 1]);
        else if (currentSelectedIdx > 0)
          onChange(options[currentSelectedIdx - 1]);
      } else if (e.code === "ArrowDown") {
        if (currentSelectedIdx === -1) onChange(options[0]);
        else if (currentSelectedIdx < options.length - 1)
          onChange(options[currentSelectedIdx + 1]);
      }
    };

    window.addEventListener("click", clickEventHandler);
    window.addEventListener("keydown", keydownEventHandler);
    return () => {
      window.removeEventListener("click", clickEventHandler);
      window.removeEventListener("keydown", keydownEventHandler);
    };
  }, [isOpen, value]);

  return (
    <div
      ref={dropdownRef}
      style={{
        ...(width !== undefined ? { width } : {}),
        ...(customStyle || {}),
      }}
      className={
        className ? `${style.container} ${className}` : style.container
      }
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className={style.box}>
        {valueTemplate ? (
          valueTemplate({ value })
        ) : (
          <div>{value ? value.name : placeholder || "Please select"}</div>
        )}
      </div>
      {isOpen && (
        <div className={style.optionlist}>
          <ul>
            {options.map((option, idx) => (
              <li
                key={idx}
                onMouseEnter={() => setActiveIdx(idx)}
                onMouseLeave={() => setActiveIdx(-1)}
                onClick={() => onChange(option)}
              >
                {optionTemplate ? (
                  optionTemplate({
                    value: option,
                    isActive: activeIdx === idx,
                    isSelected: option.id === value?.id,
                  })
                ) : (
                  <div
                    style={{
                      background:
                        option.id === value?.id
                          ? "blue"
                          : activeIdx === idx
                          ? "gray"
                          : "inherit",
                    }}
                  >
                    {option.name}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CustomDropdown;
