import React from 'react'
import Image from 'next/image'
import styles from './Card.module.css'

type CardVariant = 'default' | 'post'

type CardProps = {
  img: string
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

  return (
    <div className={`${styles.card} ${getVariantClass()}`}>
      <div className={styles.imageContainer} style={{ aspectRatio: imageAspectRatio }}>
        <Image
          src={img}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <div className={styles.content}>
        <div className={styles.title} style={{ fontSize: titleSize }}>{title}</div>
        <p className={styles.description} style={{ fontSize: descriptionSize }}>{description}</p>
      </div>
    </div>
  )
}
