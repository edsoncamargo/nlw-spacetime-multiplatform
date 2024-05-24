"use client";

import { api } from "@/lib/api/api";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  id: string;
  token: string | undefined;
};

export default function RemoveButton({ id, token }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      console.log;
      setIsLoading(true);
      await api.delete(`/memories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleted(true);
    }
  };

  if (isDeleted) router.push("/");

  return (
    <button
      className="w-auto text-left text-red-500 transition-all hover:text-red-300 hover:underline"
      onClick={() => handleDelete()}
      disabled={isLoading}
    >
      {isLoading ? "carregando..." : "apagar mémoria"}
    </button>
  );
}
