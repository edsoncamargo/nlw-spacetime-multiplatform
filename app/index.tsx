import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { styled } from "nativewind";
import * as SecureStore from "expo-secure-store";

import { makeRedirectUri, useAuthRequest } from "expo-auth-session";

import Logo from "../src/assets/images/logo.svg";
import { api } from "../src/lib/api";

const StyledLogo = styled(Logo);

const discovery = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
  tokenEndpoint: "https://github.com/login/oauth/access_token",
  revocationEndpoint:
    "https://github.com/settings/connections/applications/7fe539046651df4c8ce1",
};

export default function App() {
  const router = useRouter();

  const [_, response, signInWithGithub] = useAuthRequest(
    {
      clientId: "7fe539046651df4c8ce1",
      scopes: ["identity"],
      redirectUri: makeRedirectUri({
        scheme: "st",
      }),
    },
    discovery
  );

  async function handleGithubOAuthCode(code: string) {
    const response = await api.post("/register", {
      code,
    });

    const token = response.data;
    await SecureStore.setItemAsync("token", token);

    router.push("/memories");
  }

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
      handleGithubOAuthCode(code);
    }
  }, [response]);

  return (
    <View className="flex-1 items-center px-6 py-10">
      <View className="flex-1 items-center justify-center gap-6">
        <StyledLogo />
        <View className="space-y-2">
          <Text className="text-center font-title text-2xl leading-tight text-gray-50">
            Sua cápsula do tempo
          </Text>

          <Text className="my-4 text-center font-body text-base leading-relaxed text-gray-100">
            Colecione momentos marcantes da sua jornada e compartilhe (se
            quiser) com o 🌍
          </Text>

          <TouchableOpacity
            activeOpacity={0.7}
            className="rounded-full bg-green-500 px-5 py-2"
            onPress={() => signInWithGithub()}
          >
            <Text className="text-center font-alt text-sm uppercase leading-none">
              Cadastrar lembrança
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text className="stext-center font-body text-sm leading-relaxed text-gray-200">
        Feito com 💜 no NLW da Rocketseat.
      </Text>

      <StatusBar style="light" translucent />
    </View>
  );
}
