import { useEffect, useState } from "react";
import { ImageBackground } from "react-native";
import { SplashScreen, Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { styled } from "nativewind";
import * as SecureStore from "expo-secure-store";

import blurBg from "../src/assets/images/bg-blur.png";
import Stripes from "../src/assets/images/stripes.svg";

const StyledStripes = styled(Stripes);

import { BaiJamjuree_700Bold } from "@expo-google-fonts/bai-jamjuree";
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";

export default function Layout() {
  const [isUserAuth, setUserAuth] = useState<null | boolean>(null);

  const [hasLoadedFonts] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold,
  });

  SecureStore.getItemAsync("token").then((token) => {
    setUserAuth(!!token);
  });

  if (hasLoadedFonts === false) {
    return <SplashScreen />;
  }

  return (
    <ImageBackground
      source={blurBg}
      className="relative flex-1 bg-gray-900"
      imageStyle={{ position: "absolute", left: "-100%" }}
    >
      <StyledStripes className="absolute left-2" />
      <StatusBar style="light" translucent />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "transparent" },
          animation: "fade",
        }}
      >
        <Stack.Screen name="index" redirect={isUserAuth}></Stack.Screen>
        <Stack.Screen name="memories"></Stack.Screen>
        <Stack.Screen name="new"></Stack.Screen>
      </Stack>
    </ImageBackground>
  );
}
