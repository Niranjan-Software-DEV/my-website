export type Suspect = {
  id: string;
  name: string;
  role: string;
  photo: string;
  alibi: string;
  motive: string;
  /** position on the board in percentage (for red-string mapping) */
  x: number;
  y: number;
};

export type CaseDossier = {
  id: string;
  code: string;
  title: string;
  tagline: string;
  difficulty: "Rookie" | "Sleuth" | "Master Detective";
  duration: string;
  players: string;
  price: number;
  setting: string;
  victim: string;
  summary: string;
  clues: string[];
  seal: string;
  accent: string;
};

export const cases: CaseDossier[] = [
  {
    id: "case-1",
    code: "FILE No. 047-Λ",
    title: "The Last Train to Argent Bay",
    tagline: "A poisoned flask. A locked compartment. Six passengers, one truth.",
    difficulty: "Sleuth",
    duration: "2h 15m",
    players: "4–8",
    price: 48,
    setting: "The midnight express, somewhere between Blackmore and the coast",
    victim: "Sir Edmund Hale — railway magnate, found slumped in First Class",
    summary:
      "When the lights cut for nine seconds in Tunnel 7, Sir Edmund's brandy turned bitter with foxglove. Every passenger had reason, and every alibi unravels under the lamp.",
    clues: [
      "A monogrammed ticket stub, torn in two",
      "Lipstick on the rim of a second glass",
      "A pocket watch stopped at 11:47 — three minutes slow",
    ],
    seal: "EVIDENCE",
    accent: "#9c1b1b",
  },
  {
    id: "case-2",
    code: "FILE No. 113-Σ",
    title: "Ashes at Ravenwood Manor",
    tagline: "The urn was empty. The will was forged. The fire was no accident.",
    difficulty: "Master Detective",
    duration: "2h 45m",
    players: "5–10",
    price: 62,
    setting: "Ravenwood Manor, the night of the reading of the will",
    victim: "Lady Cordelia Ravenwood — heiress, last seen in the east wing library",
    summary:
      "The family gathered for the reading. By dawn the library smelled of smoke and salt, and Cordelia was a silhouette against the flames. Four bloodlines. One inheritance. Zero witnesses.",
    clues: [
      "A wax seal stamped with a raven missing one wing",
      "Soot on the inside of the locked garden door",
      "A child's music box, still warm to the touch",
    ],
    seal: "SEALED",
    accent: "#7a5a28",
  },
  {
    id: "case-3",
    code: "FILE No. 008-Δ",
    title: "The Crimson Sonata",
    tagline: "The violinist played on. The conductor did not rise for the encore.",
    difficulty: "Rookie",
    duration: "1h 45m",
    players: "3–6",
    price: 38,
    setting: "The Vendrig Opera House, final rehearsal of the season",
    victim: "Maestro Lucien Vendrig — found at the podium, baton still in hand",
    summary:
      "A perfect C-sharp, then silence. The maestro's final bow came from a length of concert wire. Backstage, every musician remembers the night differently — and one remembers nothing at all.",
    clues: [
      "A snapped E-string, frayed at the tuning peg",
      "Roses on the dressing room table, missing their thorns",
      "A program annotated in red ink: 'crescendo, then rest'",
    ],
    seal: "OPEN",
    accent: "#f6a826",
  },
];

export const suspects: Suspect[] = [
  {
    id: "s-1",
    name: "Vivienne Cross",
    role: "The Heiress",
    photo:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=faces",
    alibi: "Claims she was on the platform, buying the late edition.",
    motive: "Disinherited the week before the wedding.",
    x: 18,
    y: 22,
  },
  {
    id: "s-2",
    name: "Dr. Alistair Finch",
    role: "The Physician",
    photo:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=faces",
    alibi: "Tending to a faint passenger two cars back.",
    motive: "Hale ruined his practice with a single testimony.",
    x: 50,
    y: 14,
  },
  {
    id: "s-3",
    name: "Margot Hale",
    role: "The Widow",
    photo:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=faces",
    alibi: "Asleep in the adjoining cabin — door locked from inside.",
    motive: "A new will, signed but never witnessed.",
    x: 82,
    y: 24,
  },
  {
    id: "s-4",
    name: "Theodore Vane",
    role: "The Rival",
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=faces",
    alibi: "In the dining car, alone with a bottle of burgundy.",
    motive: "Lost the coastal contract by a single vote.",
    x: 16,
    y: 70,
  },
  {
    id: "s-5",
    name: "Iris Pemberton",
    role: "The Secretary",
    photo:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=faces",
    alibi: "Revising the minutes in the luggage car.",
    motive: "Knew where every body was buried — including the next one.",
    x: 84,
    y: 68,
  },
  {
    id: "s-6",
    name: "Constantine Roe",
    role: "The Stoker",
    photo:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=faces",
    alibi: "Shoveling coal — hands black to the wrist.",
    motive: "Hale owned the mine that took his brother.",
    x: 50,
    y: 80,
  },
];

/** Red-string connections between suspects (by id) with a label */
export const connections: { from: string; to: string; label: string }[] = [
  { from: "s-1", to: "s-2", label: "secret letters" },
  { from: "s-2", to: "s-3", label: "prescribed laudanum" },
  { from: "s-3", to: "s-4", label: "old debt" },
  { from: "s-4", to: "s-6", label: "the coastal vote" },
  { from: "s-5", to: "s-1", label: "forged signature" },
  { from: "s-5", to: "s-3", label: "witnessed nothing" },
  { from: "s-6", to: "s-2", label: "brother's death" },
];
