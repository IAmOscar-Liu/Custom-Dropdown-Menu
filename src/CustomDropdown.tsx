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
  valueTemplate?: (value: { value: T | null | undefined }) => ReactNode;
  value?: T | null | undefined;
  onChange: (value: T) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const checkedByKeyboardRef = useRef<boolean>(false);

  useEffect(() => {
    if (!dropdownRef.current || !isOpen) return;

    const eventHandler = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof MouseEvent) {
        const dialogDimensions = dropdownRef.current!.getBoundingClientRect();
        if (
          e.clientX < dialogDimensions.left ||
          e.clientX > dialogDimensions.right ||
          e.clientY < dialogDimensions.top ||
          e.clientY > dialogDimensions.bottom
        ) {
          if (checkedByKeyboardRef.current) {
            checkedByKeyboardRef.current = false;
          } else {
            setIsOpen(false);
          }
        }
      } else {
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
      }
    };

    window.addEventListener("click", eventHandler);
    window.addEventListener("keydown", eventHandler);
    return () => {
      window.removeEventListener("click", eventHandler);
      window.removeEventListener("keydown", eventHandler);
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
    >
      <input
        type="checkbox"
        className={style.hiddenCheckbox}
        checked={isOpen}
        onChange={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (
            e.target === document.activeElement &&
            !isOpen &&
            e.code === "Space"
          )
            checkedByKeyboardRef.current = true;
        }}
      />
      <div className={style.box}>
        {valueTemplate ? (
          valueTemplate({ value })
        ) : (
          <>
            {value ? (
              <div className={style.valueItem}>{value.name}</div>
            ) : (
              <div className={`${style.valueItem} ${style.placeholder}`}>
                {placeholder || "Select"}
              </div>
            )}
          </>
        )}
      </div>
      <div className={style.optionlist}>
        <ul>
          {options.map((option, idx) => (
            <li
              key={option.id}
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
                  className={
                    option.id === value?.id
                      ? `${style.item} ${style.selected}`
                      : activeIdx === idx
                      ? `${style.item} ${style.active}`
                      : style.item
                  }
                >
                  {option.name}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CustomDropdown;
