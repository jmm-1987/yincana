export type Mode = "individual" | "familia";
export type NodeStatus = "locked" | "available" | "done" | "skipped";

export const MODES: { id: Mode; label: string; desc: string; mult: number }[] = [
  { id: "individual", label: "Individual", desc: "Ritmo libre, 100 pts por prueba", mult: 1 },
  { id: "familia", label: "Familias", desc: "Con pistas para los peques", mult: 1 },
];

export type Challenge = {
  id: number;
  name: string;
  kind: "Test" | "Acertijo" | "Comprobación";
  story: string;
  question: string;
  hint: string;
  options: string[];
  answer: number;
};

export const CHALLENGES: Challenge[] = [
  {
    id: 1,
    name: "Teatro y Anfiteatro Romano",
    kind: "Test",
    story:
      "Inaugurado hacia el 16-15 a.C., el teatro acogía a unos 6.000 espectadores. Hoy sigue vivo cada verano con el Festival de Teatro Clásico.",
    question: "¿Quién promovió la construcción del Teatro Romano?",
    hint: "Fue el gran amigo y yerno del emperador Augusto.",
    options: ["Marco Agripa", "Nerón", "Julio César"],
    answer: 0,
  },
  {
    id: 2,
    name: "Templo de Diana",
    kind: "Acertijo",
    story:
      "Su nombre es un error histórico: durante siglos se creyó dedicado a la diosa Diana. En el Renacimiento, un palacio se construyó dentro de sus columnas.",
    question: "Me llaman Diana, pero no lo soy. ¿A quién se rendía culto aquí realmente?",
    hint: "Piensa en el hombre más poderoso de Roma.",
    options: ["A Júpiter", "Al emperador (culto imperial)", "A Neptuno"],
    answer: 1,
  },
  {
    id: 3,
    name: "Pórtico del Foro",
    kind: "Test",
    story:
      "Este pórtico de mármol estaba decorado con clípeos de Júpiter Amón y Medusa, copiando el foro más famoso del Imperio.",
    question: "¿Qué foro imitaba la decoración de este pórtico?",
    hint: "Está en la capital del Imperio.",
    options: ["El Foro de Augusto en Roma", "El Ágora de Atenas", "El Foro de Pompeya"],
    answer: 0,
  },
  {
    id: 4,
    name: "Alcazaba Árabe y Puente Romano",
    kind: "Comprobación",
    story:
      "Abderramán II levantó la Alcazaba en el año 835 junto al Puente Romano, uno de los más largos que se conservan del mundo antiguo (unos 790 m).",
    question: "Asómate a la muralla: ¿qué río cruza el Puente Romano?",
    hint: "Su nombre viene del árabe 'wadi' (río) + Anas.",
    options: ["Tajo", "Guadiana", "Guadalquivir"],
    answer: 1,
  },
  {
    id: 5,
    name: "Arco de Trajano",
    kind: "Acertijo",
    story:
      "Mide unos 15 metros y, pese a su nombre, no hay pruebas de que tuviera relación con Trajano. Probablemente era la entrada a un recinto sagrado.",
    question: "Tócalo (con cariño): ¿de qué material está construido?",
    hint: "Abunda en la sierra extremeña y es muy duro.",
    options: ["Mármol", "Ladrillo", "Granito"],
    answer: 2,
  },
];
