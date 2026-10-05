export type Mode = "individual" | "familia";
export type NodeStatus = "locked" | "available" | "done" | "skipped";

export const MODES: { id: Mode; label: string; desc: string; mult: number }[] = [
  { id: "individual", label: "Individual", desc: "9 paradas a tu ritmo, 100 pts por prueba", mult: 1 },
  { id: "familia", label: "Familias", desc: "Con pistas y minijuegos para los peques", mult: 1 },
];

export type Challenge = {
  id: number;
  name: string;
  step?: number;
  kind: "Test" | "Acertijo" | "Puzle" | "Memoria";
  directions?: string;
  story: string;
  question: string;
  hint: string;
  options: string[];
  answer: number;
};

export const CHALLENGES: Challenge[] = [
  {
    id: 1, step: 1, name: "Teatro Romano", kind: "Test",
    directions: "Desde la entrada, avanza por el pasillo principal y sube por las gradas hasta la zona central de la cavea media. Busca un asiento centrado frente al escenario y levanta la vista.",
    story: "Julia ya no recuerda la importancia del teatro romano de su ciudad. Se inauguró entre los años 16-15 a. C. y Marco Agripa fue su promotor. Dicen que «las semillas permanecen ocultas antes de volver a brotar»: los recuerdos también pueden dormir hasta que alguien los despierta.",
    question: "Julia recuerda una diosa central entre las columnas, símbolo de la vida, las cosechas y la abundancia. ¿Quién es?",
    hint: "Su nombre suena a «cereal».",
    options: ["Diosa Ceres", "Diosa Venus", "Diosa Minerva"], answer: 0,
  },
  {
    id: 2, step: 2, name: "Anfiteatro Romano", kind: "Test",
    directions: "Sin salir del recinto, dirígete a la salida por las gradas de la cavea media. Unos pequeños arcos a tu derecha te llevarán al Anfiteatro.",
    story: "Contempla la arena elíptica, las gradas, el foso central y los restos de muros y pasillos. Aquí cabían entre quince y dieciséis mil espectadores. «Recordar es volver a caminar por los lugares que forman parte de nuestra historia».",
    question: "¿Cómo se llamaban los valientes luchadores de la arena?",
    hint: "Su nombre viene de «gladius», la espada romana.",
    options: ["Los centuriones", "Los gladiadores", "Los pretorianos"], answer: 1,
  },
  {
    id: 3, step: 3, name: "Museo Nacional de Arte Romano", kind: "Test",
    directions: "Saliendo del recinto, al inicio de la calle José Ramón Mélida, encontrarás un edificio de ladrillo con un gran arco central: la obra de Rafael Moneo.",
    story: "El museo se organiza en tres plantas en torno a la vida romana. Una de sus piezas más famosas es el retrato del primer emperador, con la cabeza velada por la toga. «Cuando la memoria calla, el alma de una persona habla a través de los ojos que la aman».",
    question: "¿Quién fue este primer emperador romano?",
    hint: "La ciudad lleva su nombre: Augusta Emerita.",
    options: ["Emperador Trajano", "Emperador Nerón", "Emperador Augusto"], answer: 2,
  },
  {
    id: 4, step: 4, name: "Pórtico del Foro Municipal", kind: "Test",
    directions: "Recorre la calle José Ramón Mélida dejando atrás el museo hasta la calle Sagasta. Sigue por ella atento a tu alrededor.",
    story: "Es la esquina de un pórtico monumental del antiguo Foro de Augusta Emerita. En sus medallones se alternan diferentes cabezas. Una de ellas protegía del mal y velaba por la ciudad.",
    question: "Observa los medallones: ¿de quién es el rostro que llama la atención de Julia?",
    hint: "Tiene serpientes en lugar de pelo.",
    options: ["Medusa", "Júpiter", "Hércules"], answer: 0,
  },
  {
    id: 5, step: 5, name: "Templo de Diana", kind: "Acertijo",
    directions: "Continúa por la calle Sagasta; a unos pasos, al inicio de la calle Romero Leal, aparecerán unas enormes columnas.",
    story: "Su excepcional conservación se debe a que durante siglos sirvió de armazón al palacio renacentista del Conde de los Corbos. Rodéalo despacio: una de sus piezas fue rescatada y hoy se exhibe en el Museo.",
    question: "«Del templo de Diana formé parte, pero aquí ya no estoy. Entre piezas del pasado en el museo me encuentro hoy. Alta y firme durante siglos resistí». ¿Qué parte del templo soy?",
    hint: "Mira hacia arriba: el templo está lleno de ellas.",
    options: ["La escalinata", "La columna", "El tejado"], answer: 1,
  },
  {
    id: 6, step: 6, name: "Parque de las Méridas del Mundo", kind: "Test",
    directions: "Desde el Templo de Diana sigue por Romero Leal hasta el final; en la intersección toma la calle Cava en dirección al río Guadiana.",
    story: "Dejamos la Mérida romana y vamos hacia su etapa árabe. Junto a la muralla de la Alcazaba y cerca del Puente Romano está este parque, con un obelisco dedicado a las ciudades que se llaman igual. «Son las pequeñas historias las que nos ayudan a saber quiénes somos».",
    question: "Observa el obelisco: ¿qué países tienen otra ciudad llamada Mérida?",
    hint: "Uno está en Asia y dos en América.",
    options: ["México, Venezuela y Filipinas", "Argentina, Chile y Perú", "Portugal, Italia y Francia"], answer: 0,
  },
  {
    id: 7, step: 7, name: "Loba Capitolina", kind: "Test",
    directions: "Continúa hacia el río Guadiana. En una pequeña rotonda, a la entrada del Puente Romano, está la figura.",
    story: "Es una réplica regalada por la ciudad de Roma a Mérida en 1997 para recordar sus vínculos históricos. Julia conserva la historia de una loba que crió a dos niños, pero sus nombres se han borrado de su memoria.",
    question: "¿Cómo se llamaban los gemelos que amamantó la loba?",
    hint: "Uno de ellos dio nombre a Roma.",
    options: ["Cástor y Pólux", "Rómulo y Remo", "Marco y Tito"], answer: 1,
  },
  {
    id: 8, step: 8, name: "Puente Romano", kind: "Test",
    directions: "Está justo detrás de ti: gírate y obsérvalo.",
    story: "Su construcción está ligada a la fundación de Augusta Emerita y su imagen actual es fruto de más de dos mil años de historia. Durante siglos fue una importante vía de comunicación sobre el Guadiana.",
    question: "Cuéntalos con atención: ¿cuántos arcos tiene el Puente Romano?",
    hint: "Son más de cincuenta.",
    options: ["40 arcos", "60 arcos", "80 arcos"], answer: 1,
  },
  {
    id: 9, step: 9, name: "Plaza de España", kind: "Acertijo",
    directions: "Sube por la calle del Puente y, casi sin darte cuenta, llegarás a la Plaza de España, el último destino.",
    story: "Aquí jugó Julia muchas veces de niña. Desde la época de los Reyes Católicos la plaza ha sido lugar de mercado y de fuentes de agua corriente.",
    question: "«En el corazón de la plaza me encontrarás y el sonido de mis aguas te guiará. De mármol estoy vestida… Pequeños personajes sobre el agua verás». ¿Sobre qué animales están montados?",
    hint: "Son mamíferos marinos muy listos.",
    options: ["Caballos", "Delfines", "Leones"], answer: 1,
  },
];

const MOSAIC: Challenge = {
  id: 101, name: "Minijuego: el mosaico", kind: "Puzle",
  story: "¡Los recuerdos de Julia se han desordenado como las teselas de un mosaico romano! Recompónlo para seguir.",
  question: "Toca dos piezas para intercambiarlas hasta completar el mosaico.",
  hint: "Empieza por las esquinas y el borde trenzado.",
  options: [], answer: -1,
};

const MEMORY: Challenge = {
  id: 102, name: "Minijuego: memoria", kind: "Memoria",
  story: "¡Entrenemos la memoria como hace Julia! Encuentra las parejas de objetos que has visto en el camino.",
  question: "Da la vuelta a dos cartas; si son iguales, se quedan descubiertas.",
  hint: "Fíjate bien dónde está cada dibujo antes de que se dé la vuelta.",
  options: [], answer: -1,
};

/** Route per mode: families get minigames interleaved between stops. */
export function getRoute(mode: Mode): Challenge[] {
  if (mode === "individual") return CHALLENGES;
  const r = [...CHALLENGES];
  r.splice(6, 0, MEMORY); // after step 6
  r.splice(3, 0, MOSAIC); // after step 3
  return r;
}

export const CONCLUSION =
  "Hoy hemos recorrido los lugares que forman la historia de Julia. Quizás algún día olvide el camino, los nombres o incluso algunos de sus recuerdos, pero mientras haya alguien dispuesto a caminar a su lado, su historia nunca caerá en el olvido. Por ello, la labor de las asociaciones de familiares y personas con Alzheimer es tan importante: a través de la estimulación cognitiva, el trabajo de la memoria, la atención y el acompañamiento, ayudan a personas como Julia a mantener sus capacidades el mayor tiempo posible. Puede que algunos recuerdos se borren, pero el cariño, el acompañamiento y las emociones permanecen a lo largo de la vida.";
