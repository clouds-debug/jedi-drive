const items = [
  { value: "94%", label: "сдают с первого раза" },
  { value: "1 200+", label: "выпускников" },
  { value: "12", label: "инструкторов" },
  { value: "2 языка", label: "ru · ge" },
];

export function Stats() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-6">
        <div className="flex flex-wrap items-center justify-around gap-6">
          {items.map((item, i) => (
            <div key={item.label} className="flex items-center gap-9">
              <div>
                <div className="text-[20px] font-medium text-navy">{item.value}</div>
                <div className="text-[11px] text-ink-mute uppercase tracking-[0.06em] mt-0.5">{item.label}</div>
              </div>
              {i < items.length - 1 && <div className="hidden sm:block w-px h-9 bg-line" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
