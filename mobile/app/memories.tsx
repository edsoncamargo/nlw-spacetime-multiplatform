import { View, TouchableOpacity, ScrollView, Text, Image } from "react-native";

import Logo from "../src/assets/images/logo.svg";
import { Link, useRouter } from "expo-router";

import Icon from "@expo/vector-icons/Feather";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { api } from "../src/lib/api";
import dayjs from "dayjs";
import ptBR from "dayjs/locale/pt-br";

dayjs.locale(ptBR);

interface Memory {
  coverUrl: string;
  excerpt: string;
  id: string;
  createAt: string;
}

export default function Memories() {
  const { top, bottom } = useSafeAreaInsets();
  const router = useRouter();
  const [memories, setMemories] = useState<Memory[]>([]);

  async function loadMemories() {
    const token = await SecureStore.getItemAsync("token");

    const response = await api.get("/memories", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setMemories(response.data);
  }

  useEffect(() => {
    loadMemories();
  }, []);

  async function signOut() {
    await SecureStore.deleteItemAsync("token");

    router.push("/");
  }

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingTop: top, paddingBottom: bottom + 24 }}
    >
      <View className="mb-9 mt-4 flex-row-reverse items-center justify-between px-8">
        <Logo />

        <View className="flex-row gap-2 ">
          <TouchableOpacity
            onPress={signOut}
            className="h-8 w-8 items-center justify-center rounded-full bg-red-500"
          >
            <Icon name="log-out" size={18} color="#000"></Icon>
          </TouchableOpacity>

          <Link href="/new" asChild>
            <TouchableOpacity className="h-8 w-8 items-center justify-center rounded-full bg-green-500">
              <Icon name="plus" size={16} color="#000"></Icon>
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      {memories.map((memory) => (
        <View key={memory.id} className="mb-4 space-y-10">
          <View className="space-y-4">
            <View className="flex-row items-center gap-2">
              <View className="h-px w-5 bg-gray-50"></View>
              <Text className="font-body text-xs font-bold leading-relaxed text-gray-100">
                {dayjs(memory.createAt).format("D[ de ]MMMM[, ]YYYY")}
              </Text>
            </View>

            <View className="space-y-4 px-8">
              <Image
                source={{
                  uri: memory.coverUrl,
                }}
                className="border-1 aspect-video w-full rounded-lg"
                alt=""
              />
            </View>

            <Text className="px-8 font-body text-base leading-relaxed text-gray-100">
              {memory.excerpt}
            </Text>

            <Link href="/memories/id" asChild>
              <TouchableOpacity className="mb-10 flex-row items-center gap-2 px-8">
                <Text className="font-body text-sm text-gray-200 underline">
                  Ler mais
                </Text>
                <Icon
                  name="arrow-right"
                  size={16}
                  className="text-gray-200"
                  color="#9e9ea0"
                ></Icon>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
function setState(): [any, any] {
  throw new Error("Function not implemented.");
}
