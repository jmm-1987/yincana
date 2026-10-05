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
  passage?: string;
  directions?: string;
  story: string;
  question: string;
  hint: string;
  options: string[];
  answer: number;
};

export const CHALLENGES: Challenge[] = [
  {
    id: 1, step: 1, name: "Teatro Romano de Mérida", kind: "Test",
    story: "", question: "",
    passage: `Julia ya no recuerda la importancia del teatro romano de su ciudad, para ayudarla a recordar, debemos que subir hasta el lugar donde los espectadores contemplan las representaciones.

Desde la entrada, avanzando por el pasillo principal, comenzamos a subir por las gradas. Continuamos hasta la zona central de la cavea media. Allí, buscamos un asiento centrado, frente al escenario.

Una vez sentados, levantamos la vista. Contemplando el escenario, la orchestra y el teatro con sus impresionantes columnas.

El teatro romano es el elemento más representativo del Conjunto Monumental de Mérida. Se inauguró entre los años 16-15 a. C. y fue el cónsul Marco Agripa el promotor de su construcción.

Exsite un dicho: “las semillas pertenecen ocultas antes de volver a brotar”, los recuerdos también pueden permanecer dormidos hasta que alguien los despierta.

Julia recuerda una figura central entre las columnas del teatro romano, una diosa que simboliza la vida, las cosechas y la abundancia.

El nombre de esta diosa, nos permitirá avanzar hasta el siguiente destino.`,
    hint: "Su nombre suena a «cereal».",
    options: ["Diosa Ceres", "Diosa Venus", "Diosa Minerva"], answer: 0,
  },
  {
    id: 2, step: 2, name: "Anfiteatro Romano", kind: "Test",
    story: "", question: "",
    passage: `El siguiente recuerdo que ayudaremos a despertar en Julia, está mas cerca de lo que pensamos.

Sin salir de este emblemático lugar, nos dirigimos hacia la salida por las gradas de la cavea media. De camino, nos encontraremos unos pequeños arcos a nuestra derecha que nos llevarán hasta el Anfiteatro Romano. Desde allí, podemos contemplar la arena elíptica, las gradas, el foso central y los restos de muros y pasillos.
el Anfiteatro sirvió de escenario para espectáculos muy populares, La cabida aproximada de este coso gigantesco era de entre quince y dieciséis mil espectadores.

Los recuerdos de Julia del anfiteatro son escasos y su memoria está algo confundida.

En este lugar, luchaban grandes hombres en la arena, si ayudamos a Julia a recordar el nombre de estos valientes luchadores, lograremos recuperar otro recuerdo y avanzar en su memoria hasta el siguiente, ya que “recordar es volver a caminar por los lugares que forman parte de nuestra historia”.`,
    hint: "Su nombre viene de «gladius», la espada romana.",
    options: ["Los centuriones", "Los gladiadores", "Los pretorianos"], answer: 1,
  },
  {
    id: 3, step: 3, name: "Museo Nacional de Arte Romano", kind: "Test",
    story: "", question: "",
    passage: `Julia ha olvidado un lugar importante donde se guardan las mejores colecciones de esculturas, objetos y restos romanos de su ciudad.

Saliendo del recinto, al inicio de la calle José Ramón Mélida, encontraremos un edificio de ladrillo y hormigón con un arco de medio punto central. Esta obra del prestigioso arquitecto, Rafael Moneo, es el Museo de Arte Romano.
El Museo Nacional de Arte Romano es una Institución de muy larga andadura, se organiza en tres plantas divididas en diferentes áreas temáticas que giran alrededor de la vida romana.

Los pensamientos de Julia sobre el pasado romano están desordenados y necesita ayuda para colocarlos de nuevo.

En este magnífico edificio, se encuentra una de las piezas mas representativas del museo: el retrato del primer emperador romano que presenta la cabeza velada por el vuelo de la toga.

Sin levantar los ojos y profundizando la mirada en esta gran obra, intentaremos que Julia reviva los recuerdos de su ciudad y la historia que había en ella, porque “cuando la memoria calla, el alma de una persona habla a través de los ojos que lo aman”.

¿Quién fue este emperador? Su historia nos dará la pista para decubrir el siguiente monumento…`,
    hint: "La ciudad lleva su nombre: Augusta Emerita.",
    options: ["Emperador Trajano", "Emperador Nerón", "Emperador Augusto"], answer: 2,
  },
  {
    id: 4, step: 4, name: "Pórtico del Foro Municipal de Augusta Emérita", kind: "Test",
    story: "", question: "",
    passage: `Continuando nuestro viaje por Emerita Augusta, Julia recuerda que a la salida de museo, escondido entre las calles de la ciudad, se encuentra un lugar muy importante de hace casi 2000 años, pero no consigue ubicar donde está.

La ayudaremos a encontrar el camino, recorriendo la calle José Ramón Mélida, dejando atrás el museo, hasta llegar a la calle Sagasta. Continuaremos por ella prestando atención a nuestro alrededor ya que estamos cerca de encontrar el Pórtico del antiguo Foro Romano y de recuperar la siguiente pieza de la historia de Julia.

Se trata de la esquina de un pórtico monumental que formaba parte del grandioso programa propagandístico del antiguo Foro Municipal de Augusta Emerita.

Nos detenemos ante este gran Pórtico y observamos detenidamente los medallones en los que se alternan diferentes cabezas. A Julia le resulta familiar sus rostros, pero hay uno que especialmente llama su atención…

Al igual que esta figura protegía del mal y velaba por la ciudad, nosotros podemos proteger la memoria para que nuestra historia no caiga en el olvido.

Ayudaremos a Julia a buscar entre los medallones del Foro. ¿De quien se trata? Recuperaremos un nuevo recuerdo y estaremos un paso mas cerca de reconstruir su historia.`,
    hint: "Tiene serpientes en lugar de pelo.",
    options: ["Medusa", "Júpiter", "Hércules"], answer: 0,
  },
  {
    id: 5, step: 5, name: "Templo de Diana", kind: "Acertijo",
    story: "", question: "",
    passage: `Julia siente que su historia esta cada vez mas cerca, pero aún quedan recuerdos escondidos por las calles de su ciudad.

Continuaremos nuestro camino por la calle Sagasta, a tan solo unos pasos, al inicio de la calle Romero Leal, unas enormes columnas aparecerán ante nosotros.

Observaremos este magnífico monumento que Julia no logra recordar, aunque sabe que la ha visto infinidad de veces, el monumento ante el que nos encontramos es el Templo de Diana.
Su estado de conservación excepcional se debe a que, durante siglos, el templo sirvió de cimiento y armazón del palacio renacentista del Conde de los Corbos.

Contemplamos el templo de Diana y lo rodeamos lentamente, admirando su grandeza.

Julia lo observa y siente que una parte de este lugar ya la ha visto antes… Una de estas piezas fue rescatada para protegerla y exhibirla de forma directa en el Museo de Arte Romano.

Para continuar el camino junto a Julia, debemos resolver este acertijo:

“Del templo de Diana formé parte, pero aquí ya no estoy. Entre piezas del pasado en el museo me encuentro hoy. Alta y firme durante siglos resistí.”
¿Que parte del templo soy?

Hagamos memoria, si conseguimos recordar qué pieza vimos en el museo, podremos continuar nuestro camino hacia otra etapa de la historia.`,
    hint: "Mira hacia arriba: el templo está lleno de ellas.",
    options: ["La escalinata", "La columna", "El tejado"], answer: 1,
  },
  {
    id: 6, step: 6, name: "Parque de las Méridas del Mundo", kind: "Test",
    story: "", question: "",
    passage: `Dejamos atrás por un momento la Mérida romana y avanzamos hacia otra etapa de la historia de la ciudad de Julia, dirigiendonos hacia la etapa árabe de la ciudad.

Desde el Templo de Diana y continuamos por la calle Romero Leal hasta llegar al final, en la intersección, tomamos la calle Cava y seguimos dirección al río Guadiana.

Julia siente que una historia diferente le espera, a tan solo unos metros nos encontraremos un bonito parque: Las Méridas del Mundo.
El Parque de las Méridas del Mundo está situado junto a la muralla del Alcazaba y cerca del Puente Romano.

Julia recuerda que hay mas ciudades con el mismo nombre que la suya, la ayudaremos a recordar esos nombres porque, “cuando la memoria comienza a perderse, son las pequeñas historias las que nos ayudan a saber quienes somos y de donde venimos”.

En este parque buscaremos un obelisco dedicado a todas las ciudades llamadas igual. Lo observaremos con atención e intentaremos descubrir cuales son las ciudades que comparten el mismo nombre. Si logramos averiguarlas, estaremos muy cerca de completar los recuerdos de Julia.`,
    hint: "Uno está en Asia y dos en América.",
    options: ["México, Venezuela y Filipinas", "Argentina, Chile y Perú", "Portugal, Italia y Francia"], answer: 0,
  },
  {
    id: 7, step: 7, name: "Loba Capitolina", kind: "Test",
    story: "", question: "",
    passage: `Seguimos acercándonos al final de nuestro camino. Continuando dirección al río Guadiana, donde Julia recuerda haber visto muchas veces una figura muy especial.

En una pequeña rotonda, a la entrada del Puente Romano se encuentra una réplica regalada por la ciudad de Roma a la maravillosa ciudad donde Julia creció, esta es la Loba Capitolina.
Fue un regalo de la ciudad de Roma a Mérida en el año 1997 para recordar los vínculos históricos y culturales de Augusta Emerita con el Imperio Romano.

Hay recuerdos que pertenecen a una persona y otros que forman parte de la memoria de toda una ciudad. Descubirlos y transmitirlos es también una forma de evitar que caigan en el olvido.

Julia conserva una bonita historia de una loba que crió y amantó a dos niños, pero sus nombres se han borrado de su memoria. Si conseguimos descubrir cómo se llamaban aquellos gemelos vinculados a Roma, habremos ayudado a Julia a recuperar otra parte de su historia.`,
    hint: "Uno de ellos dio nombre a Roma.",
    options: ["Cástor y Pólux", "Rómulo y Remo", "Marco y Tito"], answer: 1,
  },
  {
    id: 8, step: 8, name: "Puente Romano", kind: "Test",
    story: "", question: "",
    passage: `El siguiente destino, está justo detrás de nosotros. Julia se gira y observa el impresionante Puente Romano. Lo reconoce, pero esos recuerdos estan confusos. Ha olvidado cuantas veces lo cruzó cuando era pequeña.
La construcción del Puente Romano está vinculada a la fundación de Augusta Emerita. Su imagen actual es el resultado de más de dos mil años de historia

Julia contempla el Puente Romano con añoranza e intenta recordar. Sabe que ha sido durante siglos una importante vía de comunicación de Mérida y sus numerosos arcos atraviesan el río Guadiana.

Pero ha algo que su memoria ha olvidado… ¿Cuántos arcos tiene el Puente Romano de Mérida?

Los contaremos con atención. Y la respuesta nos ayudará a descubir el último destino.`,
    hint: "Son más de cincuenta.",
    options: ["40 arcos", "60 arcos", "80 arcos"], answer: 1,
  },
  {
    id: 9, step: 9, name: "Plaza de España de Mérida", kind: "Acertijo",
    story: "", question: "",
    passage: `Julia vuelve a recordar aquellas tardes junto al río Guadiana, pero de repente otra imagen aparece en su memoria: una gran plaza en el corazón de su ciudad.

Subiermos por la calle del Puente y, casi sin darnos cuenta llegaremos a la Plaza de España de Mérida, el último destino de nuestro recorrido.

Al llegar, Julia observa la plaza con emoción. Aquí jugó muchas veces cuando era niña, recorrió sus rincones y vivió momentos que, hoy aparecen borrosos en su memoria pero que forman parte de su historia.
Desde su ordenamiento como tal, en época de los Reyes Católicos, la plaza ha sido lugar de mercado y donde se hallaban los pilares o fuentes de agua corriente

Estamos muy cerca de completar nuestro viaje y de ayudar a Julia a completar todos sus recuerdos.

Para completar su memoria debemos solucionar este acertijo:

En el corazón de la plaza me encontrarás, y el sonido de mis aguas te guiará. De mármol estoy vestida y llevo muchos años observando la vida. Julia jugaba cerca de mí cuando era pequeña, pero hoy su memoria apenas recuerda. Acécate, observa con atención y busca entre mis figuras una solución. Pequeños personajes sobre el agua verás, ¿sobre que animales montados están?`,
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
  r.splice(6, 0, MEMORY);
  r.splice(3, 0, MOSAIC);
  return r;
}

export const CONCLUSION =
  "Hoy hemos recorrido los lugares que forman la historia de Julia. Quizas algún día olvide el camino, los nombres o incluso algunos de sus recuerdos, pero mientras haya aguien dispuesto a caminar a su lado, su historia nunca caerá en el olvido. Por ello, la labor de las asociaciones familiares y personas con Alzheimer es tan importante. A través de la estimulación cognitiva, el trabajo de de la memoria, la atención y el acompañamiento, ayudan a personas como Julia a mantener sus capacidades durante el mayor tiempo sopible y a seguir conectadas con su historia, su entorno y las personas que forman parte de su vida. Puede que algunos recuerdos se borren, pero el cariño, el acompañamiento y las emociones permanecen a lo largo de la vida.";