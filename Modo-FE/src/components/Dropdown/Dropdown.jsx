import { useRef, useEffect } from "react";
import styles from "./Dropdown.module.css";
import arrowDownIcon from "../../assets/icon/arrow-down.svg";
import arrowUpIcon from "../../assets/icon/arrow-up.svg";

export default function Dropdown({
  placeholder,
  selectedValue,
  options,
  isOpen,
  onToggle,
  onSelect,
  stepClass,
  children,
}) {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        onToggle(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onToggle]);

  const stepClassNames = stepClass
    ? stepClass
        .split(" ")
        .map((cls) => styles[cls])
        .filter(Boolean)
        .join(" ")
    : "";

  return (
    <div className={`${styles.dropdownWrapper} ${stepClassNames}`} ref={dropdownRef}>
      <button
        className={`${styles.dropdownButton} ${selectedValue ? styles.selected : ""}`}
        onClick={() => onToggle(!isOpen)}
      >
        <span className={styles.dropdownPlaceholder}>
          {selectedValue ? selectedValue : placeholder}
        </span>
        <img
          src={isOpen ? arrowUpIcon : arrowDownIcon}
          alt="드롭다운"
          className={styles.dropdownArrow}
        />
      </button>
      {isOpen && (
        <div className={styles.dropdownList}>
          {options.map((option) => (
            <button
              key={option}
              className={styles.dropdownItem}
              onClick={() => onSelect(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
      {children}
    </div>
  );
}
