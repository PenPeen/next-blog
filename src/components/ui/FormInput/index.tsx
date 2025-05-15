"use client";

import { useFormContext } from "react-hook-form";
import { useState } from "react";
import styles from "./FormInput.module.css";

export interface FormInputProps {
  name: string;
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "password" | "number";
  required?: boolean;
  helpText?: string;
  autoComplete?: string;
}

export default function FormInput({
  name,
  label,
  placeholder,
  type = "text",
  required = false,
  helpText,
  autoComplete,
}: FormInputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const [isFocused, setIsFocused] = useState(false);

  const errorMessage = errors[name]?.message as string | undefined;
  const { onBlur: registerOnBlur, ...registerRest } = register(name);

  return (
    <div className={styles.formField}>
      <label htmlFor={name} className={styles.fieldLabel}>
        {label}
        {required && <span className={styles.requiredMark}>*</span>}
      </label>
      <input
        id={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={`${styles.fieldInput} ${
          errorMessage ? styles.fieldInputError : ""
        } ${isFocused ? styles.fieldInputFocused : ""}`}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          setIsFocused(false);
          registerOnBlur(e);
        }}
        {...registerRest}
      />
      {helpText && <p className={styles.helpText}>{helpText}</p>}
      {errorMessage && (
        <p className={styles.errorMessage}>{errorMessage}</p>
      )}
    </div>
  );
}
