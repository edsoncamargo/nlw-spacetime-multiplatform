import {
  View,
  TouchableOpacity,
  Switch,
  Text,
  TextInput,
  ScrollView,
  Image,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import Logo from "../src/assets/images/logo.svg";
import { Link, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

import Icon from "@expo/vector-icons/Feather";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import { api } from "../../src/lib/api";

export default function NewMemorie() {
  const router = useRouter();
  const { top, bottom } = useSafeAreaInsets();
  const [isPublic, setIsPublic] = useState(false);
  const [content, setContent] = useState<null | string>(null);
  const [preview, setPreview] = useState<string | null>(null);

  async function openImagePicker() {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        selectionLimit: 1,
      });

      if (result.assets[0]) {
        setPreview(result.assets[0].uri);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function handleCreateMemory() {
    const token = await SecureStore.getItemAsync("token");
    let coverUrl = "";

    try {
      if (preview) {
        const uploadFormData = new FormData();

        uploadFormData.append("file", {
          uri: preview,
          name: "image.jpeg",
          type: "image/jpeg",
        } as any);

        const uploadResponse = await api.post("/upload", uploadFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        coverUrl = uploadResponse.data;
      }
    } catch (error) {
      console.log(error);
    }

    await api.post(
      "/memories",
      {
        content,
        isPublic,
        coverUrl,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    router.push("/memories");
  }

  return (
    <ScrollView
      className="flex-1 px-8"
      contentContainerStyle={{ paddingTop: top, paddingBottom: bottom }}
    >
      <View className="mb-9 mt-4 flex-row-reverse items-center justify-between">
        <Logo />
        <Link href="/memories" asChild>
          <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-purple-500">
            <Icon name="arrow-left" size={16} color="#fff"></Icon>
          </TouchableOpacity>
        </Link>
      </View>

      <View
        className="align-between flex-1 flex-col justify-between"
        style={{ marginBottom: 24 }}
      >
        <View className="flex-col space-y-6">
          <View className="flex-row items-center gap-2">
            <Switch
              value={isPublic}
              onValueChange={setIsPublic}
              thumbColor={isPublic ? "#9b79ea" : "9e9e0"}
              trackColor={{ false: "#767677", true: "#372560" }}
            />
            <Text
              className="font-body text-base text-gray-200"
              onPress={() => setIsPublic(!isPublic)}
            >
              Tornar memória pública
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            className="h-32 items-center justify-center rounded-lg border border-dashed border-gray-500 bg-black/20"
            onPress={openImagePicker}
          >
            {preview ? (
              <Image
                source={{ uri: preview }}
                className="h-full w-full rounded-lg object-cover"
              />
            ) : (
              <View className="flex-row items-center gap-2">
                <Icon name="image" color="#fff" />
                <Text className="font-body text-sm text-gray-200">
                  Adicionar foto ou vídeo de capa
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TextInput
            multiline
            value={content}
            onChangeText={setContent}
            textAlignVertical="top"
            className="p-0 font-body text-lg text-gray-50"
            placeholderTextColor="#56566a"
            placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          className="mt-6 items-center rounded-full bg-green-500 px-5 py-2"
          onPress={handleCreateMemory}
        >
          <Text className="text-center font-alt text-sm uppercase leading-none">
            Salvar
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
