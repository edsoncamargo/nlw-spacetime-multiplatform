import { EmptyMemories } from "@/components/EmptyMemories";
import { api } from "@/lib/api/api";
import { cookies } from "next/dist/client/components/headers";
import dayjs from "dayjs";
import ptBR from "dayjs/locale/pt-br";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

dayjs.locale(ptBR);

interface Memory {
  coverUrl: string;
  excerpt: string;
  id: string;
  createAt: string;
}

export default async function Home() {
  const isAuth = cookies().has("token");

  if (isAuth === false) {
    return <EmptyMemories />;
  }

  const token = cookies().get("token")?.value;
  const response = await api.get("/memories", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const memories: Memory[] = response.data;

  if (memories.length === 0) {
    return <EmptyMemories />;
  }

  return (
    <div className="flex flex-col gap-10 p-8">
      {memories.map((memory) => {
        return (
          <div key={memory.id} className="space-y-4">
            <time className="-ml-8 flex items-center gap-2  text-sm text-gray-100 before:h-px before:w-5 before:bg-gray-50">
              {dayjs(memory.createAt).format("D[ de ]MMMM[, ]YYYY")}
            </time>

            <Image
              src={memory.coverUrl}
              alt=""
              width={592}
              height={280}
              className="aspect-video w-full rounded-lg object-cover"
            />

            <p className="text-lg leading-relaxed text-gray-100">
              {memory.excerpt}
            </p>

            <Link
              href={`/memories/${memory.id}`}
              className="align-center flex flex-row gap-2 text-gray-200 underline hover:text-gray-100"
            >
              <span className="text-sm">Ler mais</span>
              <ArrowRight className="h-4 w-4"></ArrowRight>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
