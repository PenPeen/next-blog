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
  unoptimized?: boolean
  maxLines?: number
  titleMaxLines?: boolean
}

export default function Card({
  img,
  title,
  description,
  variant = 'default',
  imageAspectRatio,
  titleSize,
  descriptionSize,
  unoptimized = false,
  maxLines = 0,
  titleMaxLines = false
}: CardProps) {
  const getVariantClass = () => {
    return variant === 'post' ? styles.postVariant : ''
  }

  const imageContainerClassName = imageAspectRatio
    ? `${styles.imageContainer} ${styles[`aspectRatio-${imageAspectRatio?.replace('/', '-')}`] || ''}`
    : styles.imageContainer

  const titleClassName = `${styles.title} ${titleSize ? styles[`titleSize-${titleSize}`] || '' : ''} ${titleMaxLines ? styles.titleLineClamp2 : ''}`

  const getLineClampClass = () => {
    if (maxLines > 0 && maxLines <= 5) {
      return styles[`lineClamp${maxLines}`]
    }
    return ''
  }

  const descriptionClassName = `${styles.description} ${descriptionSize ? styles[`descriptionSize-${descriptionSize}`] || '' : ''} ${getLineClampClass()}`

  return (
    <div className={`${styles.card} ${getVariantClass()}`}>
      {img && (
        <div className={imageContainerClassName}>
          <Image
            src={img}
            alt={title}
            fill
            className={styles.naturalImage}
            unoptimized={unoptimized}
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
