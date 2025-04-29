'use client';

import Button from '../../ui/Button/Button'
import { useAuth } from '@/hooks/auth/useAuth'

export default function LogoutButton() {
  const { logout } = useAuth();

  return (
    <Button type="neutral" handleClick={logout}>ログアウト</Button>
  );
}
