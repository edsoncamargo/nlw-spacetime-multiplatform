import { View, TouchableOpacity, ScrollView, Text, Image } from "react-native";

import Logo from "../../src/assets/images/logo.svg";
import { Link, useRouter, useSearchParams } from "expo-router";

import Icon from "@expo/vector-icons/Feather";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import ptBR from "dayjs/locale/pt-br";
import { api } from "../../src/lib/api";
import { useRoute } from "@react-navigation/native";

dayjs.locale(ptBR);

interface MemoryProps {
  coverUrl: string;
  content: string;
  id: string;
  isPublic: boolean;
  createAt: string;
}

export default function Memory() {
  const route = useRoute<any>();
  const { id } = route.params;
  const [isLoading, setIsLoading] = useState(false);

  const { top, bottom } = useSafeAreaInsets();
  const router = useRouter();
  const [memory, setMemory] = useState<MemoryProps>(null);

  async function loadMemories() {
    try {
      const token = await SecureStore.getItemAsync("token");
      const response = await api.get(`/memories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMemory(response.data);

      if (!response.data) router.push("/");
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadMemories();
  }, []);

  useEffect(() => {}, [memory]);

  const handleDelete = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      setIsLoading(true);
      await api.delete(`/memories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      router.push("/");
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

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

      {memory ? (
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
              {memory.content}
            </Text>

            <TouchableOpacity
              onPress={() => handleDelete()}
              disabled={isLoading}
            >
              <Text className="w-auto px-8 text-left text-red-500 transition-all hover:text-red-300 hover:underline">
                {isLoading ? "carregando..." : "apagar mémoria"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View></View>
      )}
    </ScrollView>
  );
}
function setState(): [any, any] {
  throw new Error("Function not implemented.");
}
