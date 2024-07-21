import NavLinks from "./nav-links";

export default function Sidenav() {
  return (
    <div className="h-full overflow-y-scroll">
      <div className="pt-9 text-center px-5">
        <NavLinks />
      </div>
    </div>
  );
}
