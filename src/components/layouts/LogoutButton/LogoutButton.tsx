'use client';

import Button from '@/components/ui/Button'
import { logout } from '@/actions/logout';

export default function LogoutButton() {
  return (
    <Button type="neutral" handleClick={logout}>ログアウト</Button>
  );
}
