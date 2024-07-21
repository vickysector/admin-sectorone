export function DetailItems({ items }) {
  return (
    <>
      <div>
        <h2 className="text-black text-heading-4">{items.title}</h2>

        <section className="grid grid-cols-3 mt-6">
          {items.data.map((data) => (
            <div key={data.id}>
              <h3 className="text-LG-strong text-black">{data.key}</h3>
              <p className="text-LG-normal text-text-description mt-1 break-words pr-6">
                {data.value}
              </p>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
