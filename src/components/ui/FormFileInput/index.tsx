"use client";

import { useFormContext } from "react-hook-form";
import { useState, useRef, useEffect, InputHTMLAttributes } from "react";
import styles from "./FormFileInput.module.css";

export type FormFileInputProps = {
  name: string;
  label: string;
  required?: boolean;
  helpText?: string;
  accept?: string;
  variant?: "default" | "dropzone";
} & InputHTMLAttributes<HTMLInputElement>;

export default function FormFileInput({
  name,
  label,
  required = false,
  helpText,
  accept = "image/*",
  variant = "default",
  ...rest
}: FormFileInputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const [isFocused, setIsFocused] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const errorMessage = errors[name]?.message as string | undefined;
  const { onBlur: registerOnBlur, onChange: registerOnChange, ref: registerRef, ...registerRest } = register(name);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileName(file.name);
    } else {
      setFileName(null);
    }

    if (registerOnChange) {
      registerOnChange(e);
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    if (fileInputRef.current) {
      registerRef(fileInputRef.current);
    }
  }, [registerRef]);

  const isDropzone = variant === "dropzone";

  const contentWrapperClassName = isDropzone
    ? `${styles.dropzone} ${errorMessage ? styles.dropzoneError : ""} ${isFocused ? styles.dropzoneFocused : ""}`
    : `${styles.fileInputWrapper} ${errorMessage ? styles.fileInputWrapperError : ""} ${isFocused ? styles.fileInputWrapperFocused : ""}`;

  return (
    <div className={styles.formField}>
      <label htmlFor={name} className={styles.fieldLabel}>
        {label}
        {required && <span className={styles.requiredMark}>*</span>}
      </label>

      <div className={contentWrapperClassName} onClick={isDropzone ? handleClick : undefined}>
        {isDropzone ? (
          <>
            <p className={styles.dropzoneText}>
              {fileName ? fileName : "ファイルを選択"}
            </p>
            <div className={styles.dropzoneContent}>
              <svg
                className={styles.dropzoneIcon}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className={styles.dropzoneText}>
                <span className={styles.dropzoneTextBold}>クリックしてアップロード</span>
                またはドラッグ＆ドロップ
              </p>
              <p className={styles.dropzoneSubtext}>
                SVG, PNG, JPG または GIF
              </p>
            </div>
          </>
        ) : (
          <>
            <div className={styles.fileInputLabel}>
              {fileName ? fileName : "ファイルを選択"}
            </div>
            <button type="button" className={styles.browseButton} onClick={handleClick}>
              参照
            </button>
          </>
        )}

        <input
          id={name}
          ref={fileInputRef}
          type="file"
          accept={accept}
          className={styles.fileInput}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            registerOnBlur(e);
          }}
          onChange={handleChange}
          {...registerRest}
          {...rest}
        />
      </div>

      {helpText && <p className={styles.helpText}>{helpText}</p>}
      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
    </div>
  );
}
