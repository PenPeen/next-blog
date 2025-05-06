"use client";

import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoginDocument, LogoutDocument, User } from "@/app/graphql";

interface UseAuthReturn {
  user: User | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth(): UseAuthReturn {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loginMutation] = useMutation(LoginDocument);
  const [logoutMutation] = useMutation(LogoutDocument);
  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const { data } = await loginMutation({
        variables: { email, password }
      });

      if (data?.login?.user) {
        setUser(data.login.user as User);

        router.push("/account");
        return { success: true };
      }

      return { success: false, error: "ログインに失敗しました" };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "ログイン中にエラーが発生しました",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);

    try {
      await logoutMutation();
      setUser(null);
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user,
  };
}
