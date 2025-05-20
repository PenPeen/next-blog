import RegisterForm from "@/components/ui/RegisterForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
  description: "Register to PenBlog App",
};

export default function RegisterPage() {
  return (
    <>
      <RegisterForm />
    </>
  );
}
