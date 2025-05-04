'use client';

import Button from '../../ui/Button/Button'
import { logout } from '@/app/actions/auth'
import { useTransition } from 'react';

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(() => {
      logout();
    });
  };

  return (
    <Button
      type="neutral"
      handleClick={handleLogout}
      isDisabled={isPending}
    >
      {isPending ? "ログアウト中..." : "ログアウト"}
    </Button>
  );
}
