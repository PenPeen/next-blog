"use client";

import { useFormContext } from "react-hook-form";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import styles from "./ThumbnailFileInput.module.css";

export interface ThumbnailFileInputProps {
  name: string;
  label: string;
  required?: boolean;
  helpText?: string;
  accept?: string;
  previewUrl?: string;
}

export function ThumbnailFileInput({
  name,
  label,
  required = false,
  helpText,
  accept = "image/*",
  previewUrl,
}: ThumbnailFileInputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const [preview, setPreview] = useState<string | null>(previewUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const errorMessage = errors[name]?.message as string | undefined;
  const { onBlur: registerOnBlur, onChange: registerOnChange, ref: registerRef, ...registerRest } = register(name);

  useEffect(() => {
    if (previewUrl) {
      setPreview(previewUrl);
    }
  }, [previewUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    } else {
      if (!previewUrl) {
        setPreview(null);
      }
    }

    if (registerOnChange) {
      registerOnChange(e);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    if (fileInputRef.current) {
      registerRef(fileInputRef.current);
    }
  }, [registerRef]);

  const defaultThumbnailImage = "/default-thumbnail.png";

  return (
    <div className={styles.formField}>
      <label htmlFor={name} className={styles.fieldLabel}>
        {label}
        {required && <span className={styles.requiredMark}>*</span>}
      </label>
      <div className={styles.thumbnailContainer}>
        <div className={styles.thumbnailPreviewWrapper}>
          <Image
            src={preview || defaultThumbnailImage}
            alt="サムネイル画像"
            width={300}
            height={200}
            className={styles.thumbnailPreview}
            data-testid="thumbnail-preview"
          />
        </div>
        <button
          type="button"
          className={styles.uploadButton}
          onClick={handleButtonClick}
          data-testid="thumbnail-upload-button"
        >
          <svg
            className={styles.uploadIcon}
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
          画像をアップロード
        </button>
        <input
          id={name}
          ref={fileInputRef}
          type="file"
          accept={accept}
          className={styles.fileInput}
          onBlur={registerOnBlur}
          onChange={handleChange}
          data-testid="thumbnail-input"
          {...registerRest}
        />
      </div>
      {helpText && <p className={styles.helpText}>{helpText}</p>}
      {errorMessage && (
        <p className={styles.errorMessage}>{errorMessage}</p>
      )}
    </div>
  );
}

export default ThumbnailFileInput;
