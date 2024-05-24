import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import dayjs from "dayjs";
import Image from "next/image";
import { cookies } from "next/dist/client/components/headers";
import { EmptyMemories } from "@/components/EmptyMemories";
import { api } from "@/lib/api/api";
import RemoveButton from "@/components/RemoveButton";

interface MemoryProps {
  coverUrl: string;
  content: string;
  id: string;
  isPublic: boolean;
  createAt: string;
}

export default async function Page({ params }: { params: { id: string } }) {
  const isAuth = cookies().has("token");

  if (isAuth === false) {
    return <EmptyMemories />;
  }

  const token = cookies().get("token")?.value;

  const response = await api.get(`/memories/${params.id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const memory: MemoryProps = response.data;

  return (
    <div className="flex flex-1 flex-col gap-4 p-8">
      <Link
        href="/"
        className="flex items-center gap-1 text-sm text-gray-200 hover:text-gray-100"
      >
        <ChevronLeft className="h-4 w-4" />
        voltar a timeline
      </Link>

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
          {memory.content}
        </p>
      </div>

      <RemoveButton id={memory.id} token={token} />
    </div>
  );
}
