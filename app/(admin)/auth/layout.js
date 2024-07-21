import Image from "next/image";

export default function UserAuthLayout({ children }) {
  return (
    <main>
      <nav className="py-3 px-8 border-b-2 border-b-input-border">
        <Image
          src={"/images/SectorOne.png"}
          alt="Logo Sector"
          width={96}
          height={38}
        />
      </nav>
      <section>{children}</section>
    </main>
  );
}
