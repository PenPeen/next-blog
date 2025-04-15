import React from 'react'
import Image from 'next/image'
import styles from './Card.module.css'

type CardVariant = 'default' | 'post'

type CardProps = {
  img?: string
  title: string
  description: string
  variant?: CardVariant
  imageAspectRatio?: string
  titleSize?: string
  descriptionSize?: string
}

export default function Card({
  img,
  title,
  description,
  variant = 'default',
  imageAspectRatio,
  titleSize,
  descriptionSize
}: CardProps) {
  const getVariantClass = () => {
    return variant === 'post' ? styles.postVariant : ''
  }

  const imageContainerClassName = imageAspectRatio
    ? `${styles.imageContainer} ${styles[`aspectRatio-${imageAspectRatio?.replace('/', '-')}`] || ''}`
    : styles.imageContainer

  const titleClassName = titleSize
    ? `${styles.title} ${styles[`titleSize-${titleSize}`] || ''}`
    : styles.title

  const descriptionClassName = descriptionSize
    ? `${styles.description} ${styles[`descriptionSize-${descriptionSize}`] || ''}`
    : styles.description

  return (
    <div className={`${styles.card} ${getVariantClass()}`}>
      {img && (
        <div className={imageContainerClassName}>
          <Image
            src={img}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className={styles.content}>
        <div className={titleClassName}>{title}</div>
        <p className={descriptionClassName}>{description}</p>
      </div>
    </div>
  )
}
