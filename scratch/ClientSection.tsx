import Image from "next/image";

type Client = {
  name: string;
  /** Path logo (SVG/PNG transparan). Kalau kosong, tampil teks nama. */
  logo?: string;
  width?: number;
  height?: number;
};

const defaultClients: Client[] = [
  { name: "Client One" },
  { name: "Client Two" },
  { name: "Client Three" },
  { name: "Client Four" },
  { name: "Client Five" },
  { name: "Client Six" },
];

type Props = {
  title?: string;
  clients?: Client[];
  /** Durasi satu putaran penuh, dalam detik */
  duration?: number;
};

function Marker({ className }: { className: string }) {
  return (
    <span aria-hidden className={`absolute z-10 size-1.5 bg-[#ff3d00] ${className}`} />
  );
}

function Cell({ client }: { client: Client }) {
  return (
    <div className="group flex h-28 w-44 flex-none items-center justify-center border-r border-neutral-200 px-4 lg:h-32">
      {client.logo ? (
        <Image
          src={client.logo}
          alt={client.name}
          width={client.width ?? 120}
          height={client.height ?? 40}
          className="h-8 w-auto object-contain opacity-80 grayscale transition group-hover:opacity-100 group-hover:grayscale-0"
        />
      ) : (
        <span className="text-lg font-bold tracking-tight text-neutral-800">
          {client.name}
        </span>
      )}
    </div>
  );
}

export default function ClientSection({
  title = "Powering ideas for\nthe best & brightest",
  clients = defaultClients,
  duration = 30,
}: Props) {
  // Ulangi daftar sampai cukup lebar, lalu gandakan untuk loop mulus (-50%)
  const repeat = Math.max(2, Math.ceil(10 / clients.length));
  const set = Array.from({ length: repeat }).flatMap(() => clients);

  return (
    <section aria-label="Klien kami" className="relative bg-white py-16">
      <style>{`
        @keyframes client-marquee { to { transform: translateX(-50%); } }
        .client-track { animation: client-marquee var(--dur) linear infinite; will-change: transform; }
        .client-viewport:hover .client-track { animation-play-state: paused; }
        .client-viewport {
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
        }
        @media (prefers-reduced-motion: reduce) {
          .client-track { animation: none; }
          .client-viewport { overflow-x: auto; -webkit-mask-image: none; mask-image: none; }
        }
      `}</style>

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
        <span aria-hidden className="pointer-events-none absolute inset-y-[-48px] left-4 border-l border-dashed border-neutral-300 sm:left-6" />
        <span aria-hidden className="pointer-events-none absolute inset-y-[-48px] right-4 border-l border-dashed border-neutral-300 sm:right-6" />

        <div className="relative flex flex-col border border-neutral-200 lg:flex-row">
          <Marker className="-left-[3px] -top-[3px]" />
          <Marker className="-left-[3px] -bottom-[3px]" />
          <Marker className="-right-[3px] -bottom-[3px]" />

          <div className="flex shrink-0 items-center border-b border-neutral-200 p-6 lg:w-60">
            <p className="whitespace-pre-line font-mono text-xs uppercase leading-relaxed tracking-wide text-neutral-800">
              {title}
            </p>
          </div>

          <div className="client-viewport min-w-0 flex-1 overflow-hidden">
            <div
              className="client-track flex w-max"
              style={{ ["--dur" as string]: `${duration}s` }}
            >
              {[0, 1].map((copy) => (
                <div key={copy} className="flex" aria-hidden={copy === 1}>
                  {set.map((client, i) => (
                    <Cell key={`${copy}-${i}`} client={client} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
