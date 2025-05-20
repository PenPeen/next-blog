import LoginForm from '@/components/ui/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Login",
  description: "Login to PenBlog App",
};

export default function Page() {
  return (
    <LoginForm />
  );
}
