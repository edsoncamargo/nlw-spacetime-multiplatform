import Image from "next/image";
import logo from "../assets/images/logo.svg";
import Link from "next/link";

export function Hero() {
  return (
    <div className="space-y-5">
      <Image src={logo} alt="NLW Spacetime logo" />

      <div className="max-w-[420px] space-y-1">
        <h1 className="mt-5 text-4xl font-bold leading-tight text-gray-50">
          Sua cápsula do tempo
        </h1>

        <p
          className="text-lg  leading-relaxed
      "
        >
          Colecione momentos marcantes da sua jornada e compartilhe (se quiser)
          com o mundo!
        </p>
      </div>

      <Link
        href="/memories/new"
        className="inline-block cursor-pointer rounded-full bg-green-500 px-5 py-3 font-alt text-sm font-bold uppercase leading-none text-black transition-colors hover:bg-gray-600 hover:text-gray-50
    "
      >
        CADASTRAR LEMBRANÇAS
      </Link>
    </div>
  );
}
