"use client";

import { useFormContext } from "react-hook-form";
import { InputHTMLAttributes, useState } from "react";
import styles from "./FormCheckBox.module.css";

export type FormCheckBoxProps = {
  name: string;
  label: string;
  required?: boolean;
  helpText?: string;
  defaultChecked?: boolean;
} & InputHTMLAttributes<HTMLInputElement>;

export default function FormCheckBox({
  name,
  label,
  required = false,
  helpText,
  defaultChecked = false,
  ...rest
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
          {...rest}
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
