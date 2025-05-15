'use client'

import React, { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import styles from "./UserDropDownMenu.module.css"
import { User } from "@/app/graphql"
import { usePathname } from "next/navigation"
import { logout } from "@/actions/logout"

type UserDropDownMenuProps = {
  user: User
}

export default function UserDropDownMenu({ user }: UserDropDownMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false)
    }
  }

  // NOTE: ドロップダウン以外の場所をクリックした時にメニューを閉じる
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className={styles.dropdownContainer} ref={dropdownRef}>
      <button
        className={styles.menuButton}
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Image
          src="/user.gif"
          alt="ユーザーメニュー"
          width={32}
          height={32}
          className={styles.userIcon}
        />
      </button>

      {isOpen && (
        <ul className={styles.dropdownMenu} role="menu">
          <li className={styles.userInfoContainer} role="menuitem">
            <div className={styles.userAvatar}>
              <Image
                src="/user.gif"
                alt={user.name}
                width={40}
                height={40}
                className={styles.userAvatarImage}
              />
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user.name}</span>
              <span className={styles.userEmail}>{user.email}</span>
            </div>
          </li>
          <li role="menuitem">
            {
              pathname.indexOf("/account") === 0 ? (
                <Link href="/" className={styles.menuItem}>
                  TOPページ
                </Link>
              ) : (
                <Link href="/account" className={styles.menuItem}>
                  マイページ
                </Link>
              )
            }
          </li>
          <li role="menuitem">
            <Link href="/account/profile" className={styles.menuItem}>
              プロフィール
            </Link>
          </li>
          <li role="menuitem">
            <button onClick={logout} className={styles.menuItem}>
              ログアウト
            </button>
          </li>
        </ul>
      )}
    </div>
  )
}
