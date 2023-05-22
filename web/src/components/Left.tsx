import { cookies } from "next/dist/client/components/headers";
import { Copyright } from "./Copyright";
import { Hero } from "./Hero";
import { Profile } from "./Profile";
import { SignInButton } from "./SignInButton";

export default function Left() {
  const isAuth = cookies().has("token");

  return (
    <div className="flex-start relative flex max-h-screen flex-col justify-between overflow-hidden border-r border-white/10 bg-[url(../assets/images/stars.svg)] bg-cover p-16 px-28 py-16">
      <div className="absolute right-0 top-1/2 h-[288px] w-[526px] -translate-y-1/2 translate-x-1/2 rounded-full bg-purple-700 opacity-50 blur-full"></div>
      <div className="absolute bottom-0 right-2 top-0 w-2 bg-stripes"></div>

      {isAuth ? <Profile /> : <SignInButton />}

      <Hero />
      <Copyright />
    </div>
  );
}
