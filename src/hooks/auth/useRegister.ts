import { CreateUserDocument } from '@/app/graphql';
import { useMutation } from '@apollo/client';
import { useRouter } from "next/navigation";
import { useState } from 'react';

export function useRegister() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null | undefined>(null);
  const [createUserMutation] = useMutation(CreateUserDocument);

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await createUserMutation({
        variables: {
          userInput: { name, email, password }
        }
      });

      if (data?.createUser?.user) {
        router.push("/");
      } else {
        setError(data?.createUser?.message);
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : '予期せぬエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, error };
}
