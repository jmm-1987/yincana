import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Compass,
  Heart,
  Gamepad2,
  MapPin,
  Pause,
  Play,
  Sparkles,
  Users,
} from "lucide-react";
import teatro from "@/assets/place-teatro.jpg";
import { SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Yincanas para sensibilizar · Federación Extremeña de Alzheimer" },
      {
        name: "description",
        content:
          "Una iniciativa de la Federación Extremeña de Alzheimer para sensibilizar jugando. Descubre Extremadura con yincanas que invitan a compartir, comprender y acompañar.",
      },
      { property: "og:title", content: "Jugamos para recordar. Exploramos para comprender." },
      {
        property: "og:description",
        content:
          "Yincanas por Extremadura para sensibilizar sobre el Alzheimer. Una iniciativa de la Federación Extremeña de Alzheimer.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/` },
      { property: "og:locale", content: "es_ES" },
      { property: "og:site_name", content: "Federación Extremeña de Alzheimer" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/` }],
  }),
  component: Welcome,
});

const destinations = [
  {
    name: "Mérida",
    image: teatro,
    landmark: "Teatro romano",
    story: "Un viaje a la antigua Roma",
    description:
      "Ayuda a Julia a recuperar sus recuerdos entre templos, teatros y secretos romanos.",
    available: true,
  },
  {
    name: "Cáceres",
    image: "/images/destinations/caceres.jpg",
    landmark: "Plaza Mayor",
    story: "Historias entre murallas",
    description:
      "Callejuelas de piedra, torres medievales y rincones que guardan siglos de historias.",
  },
  {
    name: "Hervás",
    image: "/images/destinations/hervas.jpg",
    landmark: "Barrio judío",
    story: "Descubre sus calles con encanto",
    description: "Casas de madera, calles con encanto y una aventura a los pies de la montaña.",
  },
  {
    name: "Badajoz",
    image: "/images/destinations/badajoz.jpg",
    landmark: "Plaza Alta",
    story: "Una ciudad llena de color",
    description: "De la Plaza Alta a la alcazaba: descubre la ciudad con otra mirada.",
  },
  {
    name: "Don Benito",
    image: "/images/destinations/don-benito.jpg",
    landmark: "Iglesia de Santiago",
    story: "El corazón de las Vegas Altas",
    description: "Plazas, tradiciones y pequeñas sorpresas para grandes exploradores.",
  },
  {
    name: "Plasencia",
    image: "/images/destinations/plasencia.jpg",
    landmark: "Catedral Nueva",
    story: "Dos catedrales, mil secretos",
    description: "Sigue las huellas de la historia entre murallas y monumentos llenos de detalles.",
  },
  {
    name: "Trujillo",
    image: "/images/destinations/trujillo.jpg",
    landmark: "Plaza Mayor",
    story: "Una aventura con vistas",
    description: "Palacios, una plaza inolvidable y un castillo que invita a seguir explorando.",
  },
];

function DestinationSlider() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const city = destinations[active]!;
  const move = (step: number) =>
    setActive((index) => (index + step + destinations.length) % destinations.length);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPlaying(!preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!playing || hovered || focused) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setActive((index) => (index + 1) % destinations.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [playing, hovered, focused, active]);

  return (
    <div className="welcome-enter welcome-scene relative mx-auto w-full max-w-xl pb-2 pt-2">
      <div className="absolute -inset-3 rounded-[45%] bg-terra-soft" aria-hidden="true" />
      <section
        aria-label="Descubre los siete destinos de nuestras yincanas"
        aria-roledescription="carrusel"
        className="relative aspect-square overflow-hidden sm:aspect-[4/3] rounded-[2.5rem] shadow-soft"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
        }}
      >
        {destinations.map((destination, index) => (
          <div
            key={destination.name}
            aria-hidden={active !== index}
            className={`hero-slide absolute inset-0 ${active === index ? "opacity-100" : "opacity-0"}`}
          >
            <img
              src={destination.image}
              alt={`${destination.landmark} de ${destination.name}`}
              width={1024}
              height={640}
              fetchPriority={index === 0 ? "high" : "auto"}
              loading={index < 2 ? "eager" : "lazy"}
              className="welcome-photo h-full w-full object-cover"
            />
          </div>
        ))}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#20344a]/90 via-transparent to-transparent" />
        <div
          className="absolute bottom-32 left-6 right-6 text-white sm:bottom-20"
          aria-live={playing ? "off" : "polite"}
          aria-atomic="true"
        >
          <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
            <MapPin size={14} /> {city.name} · EXTREMADURA
          </span>
          <p className="mt-2 font-display text-3xl md:text-4xl">{city.landmark}</p>
          <p className="mt-2 text-xs text-white/85">
            {city.story} · {active + 1} / {destinations.length}
          </p>
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-white/20 bg-[#20344a]/55 p-1.5 text-white backdrop-blur-md sm:flex-nowrap">
          <button
            type="button"
            aria-label="Destino anterior"
            onClick={() => move(-1)}
            className="slider-control"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="order-last flex w-full items-center justify-center sm:order-none sm:w-auto">
            {destinations.map((destination, index) => (
              <button
                type="button"
                key={destination.name}
                aria-label={`Mostrar ${destination.name}`}
                aria-current={active === index ? "true" : undefined}
                onClick={() => setActive(index)}
                className="grid h-11 w-6 place-items-center sm:w-7"
              >
                <span
                  className={`h-2 rounded-full transition-all ${active === index ? "w-5 bg-white" : "w-1.5 bg-white/50"}`}
                />
              </button>
            ))}
          </div>
          <button
            type="button"
            aria-label={playing ? "Pausar carrusel" : "Activar avance automático"}
            onClick={() => setPlaying((value) => !value)}
            className="slider-control"
          >
            {playing ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button
            type="button"
            aria-label="Destino siguiente"
            onClick={() => move(1)}
            className="slider-control"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </section>
      <span className="welcome-float glass pointer-events-none absolute -left-2 top-8 hidden items-center gap-3 rounded-2xl px-4 py-3 sm:flex md:-left-5">
        <Heart size={25} className="text-primary" />
        <span className="text-sm font-bold">
          Una aventura compartida.
          <span className="block text-xs font-medium text-muted-foreground">
            Una mirada más cercana.
          </span>
        </span>
      </span>
    </div>
  );
}

function Welcome() {
  return (
    <>
      <div className="welcome-topbar relative overflow-hidden bg-primary text-primary-foreground">
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-25"
          viewBox="0 0 1440 48"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M-20 36C80-24 180 72 290 27S470-5 580 28 780 64 890 22 1100 4 1220 28 1390 52 1460 9"
            stroke="white"
            strokeWidth="2"
            strokeDasharray="5 9"
          />
          <circle cx="110" cy="22" r="6" fill="white" />
          <circle cx="480" cy="13" r="5" fill="white" />
          <circle cx="990" cy="6" r="7" fill="white" />
          <circle cx="1320" cy="38" r="5" fill="white" />
        </svg>
        <p className="relative mx-auto flex min-h-9 max-w-7xl items-center justify-center gap-3 px-5 py-2 text-center text-xs font-semibold tracking-wide">
          <Heart size={15} className="shrink-0" aria-hidden="true" /> Sensibilizar jugando.
          Compartir para comprender.{" "}
          <Sparkles size={15} className="hidden shrink-0 sm:block" aria-hidden="true" />
        </p>
      </div>
      <main className="welcome mx-auto max-w-7xl px-5 md:px-8">
        <header className="flex flex-wrap items-center justify-between gap-3 py-2 md:py-2">
          <div className="flex flex-1 basis-[280px] items-center gap-3 md:gap-5">
            <a
              href="/"
              aria-label="Federación Extremeña de Alzheimer, inicio"
              className="flex shrink-0 items-center"
            >
              <img
                src="/images/logonew02.png"
                alt="Federación de Asociaciones de Familiares de Enfermos de Alzheimer de Extremadura"
                width={280}
                height={100}
                className="h-auto w-[150px] sm:w-[220px] md:w-[240px]"
              />
            </a>
            <span className="inline-flex items-center gap-2 rounded-full bg-terra-soft px-3 py-2 text-[10px] font-bold tracking-wide text-primary sm:px-4 sm:text-xs">
              <Sparkles size={15} className="hidden shrink-0 sm:block" /> YINCANAS PARA SENSIBILIZAR
            </span>
          </div>
          <a
            href="#destinos"
            className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-bold hover:bg-terra-soft"
          >
            Explorar <ArrowUpRight size={16} />
          </a>
        </header>
        <section
          className="relative grid items-center gap-6 pb-5 pt-2 md:pb-6 md:pt-3 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:pb-8"
          aria-labelledby="welcome-title"
        >
          <div className="welcome-enter relative z-10">
            <h1
              id="welcome-title"
              className="mt-3 text-4xl font-semibold leading-[1.08] tracking-tight md:text-5xl lg:text-[3.5rem]"
            >
              Jugamos para recordar.{" "}
              <span className="italic text-primary">Exploramos para comprender.</span>
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground md:text-base">
              Una iniciativa de la Federación Extremeña de Alzheimer para descubrir nuestros pueblos
              y ciudades mientras compartimos una mirada más cercana a las personas que viven con
              Alzheimer y a sus familias.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="#destinos"
                className="press inline-flex items-center gap-3 rounded-2xl bg-gradient-primary px-5 py-3 font-bold text-primary-foreground shadow-glow"
              >
                <span className="welcome-map text-3xl leading-none" aria-hidden="true">
                  🗺️
                </span>
                Encuentra tu yincana <ArrowDown size={18} />
              </a>
              <Link
                to="/minijuegos"
                className="press inline-flex items-center gap-3 rounded-2xl border border-primary/25 bg-card px-5 py-3 text-primary shadow-soft hover:bg-terra-soft"
              >
                <Gamepad2 size={25} aria-hidden="true" />
                <span className="text-sm font-bold">
                  Minijuegos
                  <span className="block text-xs font-medium text-muted-foreground">
                    Para los peques
                  </span>
                </span>
              </Link>
            </div>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-muted-foreground">
              <span className="flex items-center gap-2">
                <Users size={16} className="text-primary" /> A tu aire o en familia
              </span>
              <span className="flex items-center gap-2">
                <Heart size={16} className="text-primary" /> Jugar, compartir y comprender
              </span>
            </div>
          </div>
          <DestinationSlider />
        </section>
        <section
          aria-labelledby="purpose-title"
          className="mb-2 grid gap-3 rounded-[1.75rem] border border-primary/15 bg-terra-soft p-4 md:grid-cols-[auto_1fr] md:gap-4 md:p-5"
        >
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-card text-primary">
            <Heart size={25} />
          </span>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[.15em] text-primary">
              CONOCER NOS ACERCA
            </p>
            <h2 id="purpose-title" className="mt-1 text-xl font-semibold md:text-2xl">
              Mucho más que una yincana
            </h2>
            <p className="mt-2 max-w-4xl text-sm leading-relaxed text-secondary-foreground">
              Cada recorrido es una invitación a sensibilizarnos sobre el Alzheimer, a hablar de la
              importancia de los recuerdos y a poner en el centro a las personas, sus familias y
              quienes las cuidan. Descubrimos Extremadura jugando para construir una comunidad más
              comprensiva y cercana.
            </p>
          </div>
        </section>
        <section
          id="destinos"
          className="scroll-mt-4 pb-8 pt-4"
          aria-labelledby="destinations-title"
        >
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-t border-border pt-5">
            <div>
              <p className="mb-2 text-xs font-extrabold uppercase tracking-[.2em] text-primary">
                ELIGE DÓNDE PARTICIPAR
              </p>
              <h2 id="destinations-title" className="text-2xl font-semibold md:text-3xl">
                Un destino. Una experiencia que nos une.
              </h2>
              <p className="mt-3 text-muted-foreground">
                Empieza por Mérida. Muy pronto, más lugares para jugar.
              </p>
            </div>
            <span className="rounded-full bg-card px-4 py-2 text-xs font-bold text-muted-foreground shadow-soft">
              7 destinos por descubrir
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {destinations.map((city, index) => (
              <article
                key={city.name}
                className={`destination-card group flex flex-col overflow-hidden rounded-[1.75rem] border bg-card shadow-soft ${city.available ? "border-primary/35" : "border-border"}`}
                style={{ animationDelay: `${index * 75}ms` }}
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={city.image}
                    alt={`${city.landmark} de ${city.name}`}
                    width={1000}
                    height={625}
                    loading="lazy"
                    className="destination-photo h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#20344a]/70 via-transparent to-transparent" />
                  <span
                    className={`absolute right-4 top-4 rounded-full px-3 py-1.5 text-[11px] font-bold ${city.available ? "bg-primary text-white" : "bg-white/95 text-foreground"}`}
                  >
                    {city.available ? "● Disponible" : "Próximamente"}
                  </span>
                  <span className="absolute bottom-4 left-5 flex items-center gap-1.5 text-xs font-medium text-white">
                    <MapPin size={13} /> {city.landmark}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-4 md:p-5">
                  <p className="text-xs font-bold text-primary">{city.story}</p>
                  <h3 className="mt-1 text-2xl font-semibold">{city.name}</h3>
                  <p className="mb-4 mt-2 text-sm leading-relaxed text-muted-foreground">
                    {city.description}
                  </p>
                  {city.available ? (
                    <Link
                      to="/merida"
                      className="press mt-auto flex items-center justify-between rounded-xl bg-terra-soft px-4 py-3 text-sm font-bold text-primary hover:bg-primary hover:text-white"
                    >
                      Explorar Mérida <ArrowUpRight size={18} />
                    </Link>
                  ) : (
                    <p className="mt-auto border-t border-border pt-4 text-xs font-medium text-muted-foreground">
                      Estamos preparando esta aventura.
                    </p>
                  )}
                </div>
              </article>
            ))}
            <div className="flex flex-col items-start justify-center rounded-[1.75rem] border border-primary/15 bg-terra-soft p-5 md:col-span-2 lg:col-span-2">
              <Compass size={36} className="mb-3 text-primary" />
              <h3 className="max-w-lg text-2xl font-semibold md:text-3xl">
                Compartir una aventura también es{" "}
                <span className="italic text-primary">una forma de acercarnos.</span>
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                Ven con curiosidad, tu móvil y ganas de compartir. Recorre Mérida, resuelve sus
                retos y forma parte de esta iniciativa de sensibilización sobre el Alzheimer.
              </p>
              <Link
                to="/merida"
                className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
              >
                Vamos a jugar <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
        </section>
        <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-border py-4 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center gap-4">
            <img
              src="/images/logonew02.png"
              alt="Federación Extremeña de Alzheimer"
              width={280}
              height={100}
              loading="lazy"
              className="h-auto w-[196px]"
            />
            <p>
              Una iniciativa de la Federación Extremeña de Alzheimer.
              <span className="mt-1 block">Sensibilizar jugando. Compartir para comprender.</span>
            </p>
          </div>
          <a
            href="/images/destinations/credits.html"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4"
          >
            Créditos de las fotografías
          </a>
        </footer>
      </main>
    </>
  );
}
