'use client'

import { useFormContext } from 'react-hook-form'
import styles from './FormDropdown.module.css'

type DropdownOption = {
  value: string;
  label: string;
};

type DropdownSize = 'small' | 'medium' | 'large';

interface FormDropdownProps {
  name: string;
  label: string;
  options: DropdownOption[];
  required?: boolean;
  placeholder?: string;
  size?: DropdownSize;
}


export default function FormDropdown({
  name,
  label,
  options,
  required = false,
  placeholder = '選択してください',
  size = 'medium',
}: FormDropdownProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext()
  const errorMessage = errors[name]?.message as string | undefined
  const sizeClass = styles[`size${size.charAt(0).toUpperCase() + size.slice(1)}`];

  return (
    <div className={styles.container}>
      <label
        htmlFor={name}
        className={styles.label}
      >
        {label}
        {required && <span className={styles.requiredMark}>*</span>}
      </label>
      <select
        id={name}
        {...register(name)}
        className={`${styles.select} ${sizeClass} ${errorMessage ? styles.errorInput : ''}`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errorMessage && (
        <p className={styles.errorMessage}>{errorMessage}</p>
      )}
    </div>
  )
}
