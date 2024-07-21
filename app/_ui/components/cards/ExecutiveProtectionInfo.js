export function ExecutiveProtectionInfo({ Icon, title, descriptions }) {
  return (
    <section className="bg-white border-2 border-input-border rounded-xl p-8 flex">
      <Icon style={{ color: "#00000040", fontSize: "24px" }} />
      <div className="ml-4">
        <h3 className="text-black text-heading-5 text-left">{title}</h3>
        <p className="text-text-description text-Base-normal text-left mt-1">
          {descriptions}
        </p>
      </div>
    </section>
  );
}
