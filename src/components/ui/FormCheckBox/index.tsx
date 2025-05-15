"use client";

import { useFormContext } from "react-hook-form";
import { useState } from "react";
import styles from "./FormCheckBox.module.css";

export interface FormCheckBoxProps {
  name: string;
  label: string;
  required?: boolean;
  helpText?: string;
  defaultChecked?: boolean;
}

export default function FormCheckBox({
  name,
  label,
  required = false,
  helpText,
  defaultChecked = false,
}: FormCheckBoxProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const [isFocused, setIsFocused] = useState(false);

  const errorMessage = errors[name]?.message as string | undefined;
  const { onBlur: registerOnBlur, ...registerRest } = register(name);

  return (
    <div className={styles.formField}>
      <div className={styles.checkboxContainer}>
        <input
          id={name}
          type="checkbox"
          defaultChecked={defaultChecked}
          className={`${styles.checkboxInput} ${
            errorMessage ? styles.checkboxInputError : ""
          } ${isFocused ? styles.checkboxInputFocused : ""}`}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            registerOnBlur(e);
          }}
          {...registerRest}
        />
        <label htmlFor={name} className={styles.checkboxLabel}>
          {label}
          {required && <span className={styles.requiredMark}>*</span>}
        </label>
      </div>
      {helpText && <p className={styles.helpText}>{helpText}</p>}
      {errorMessage && (
        <p className={styles.errorMessage}>{errorMessage}</p>
      )}
    </div>
  );
}
