/* FUNDRAISING_GOAL is defined near the bottom of this file, after ROOMS,
   because it's derived from the Kaution (security deposit) plus the sum
   of each room's sponsorGoal (= 12 months of Warmmiete brutto).
   All monthly rents are Warmmiete inkl. BK-VZ, inkl. 19 % MwSt.
   Kaution = 3 × Kaltmiete netto (ohne MwSt) for all rooms combined.
   Values taken from Kostenaufstellung_OG2_Berechnung.xlsx. */

export const GENERATIONS = Array.from({ length: 45 }, (_, i) => `G${i + 1}`)
export const MIN_CUSTOM_AMOUNT = 10
export const MAX_CUSTOM_AMOUNT = 50000

/* ---------------- Bank details ---------------- */

/* Thomas Stiftung is the legal entity that rents the office on behalf of
   Manage and More and receives donations. Surfaced in the donation modal
   and in the footer so visitors can transfer without opening the flow. */
export const BANK_DETAILS = {
  accountHolder: "Stiftung Thomas Kirchner Bildungsförderungs gGmbH",
  accountType: "KontoKorrent",
  accountNumber: "1050692621 (EUR)",
  iban: "DE46 3003 0900 1050 6926 21",
  bic: "MEFIDEMM300",
  reference: "Spende Manage and More Büro"
} as const

/* ---------------- Contribution tiers (donation modal) ---------------- */

export type ContributionTier = {
  id: "gold" | "silver" | "bronze" | "founding" | "wall"
  name: string
  /** Minimum euro amount required to qualify for this tier. */
  price: number
  /** Optional eye-catch tag (e.g. "Most popular"). */
  tag?: string
  /** The distinctive benefit, surfaced as a hero callout on the card. */
  headline: {
    /** Which icon to pair with the hero callout. */
    icon: "community" | "office" | "meeting" | "workspace" | "photo" | "wall"
    /** Optional size label shown as a prominent pill (e.g. "50+ sqm"). */
    size?: string
    /** Primary hero line — should differ across tiers to aid scanning. */
    title: string
    /** Supporting subline — OK to repeat across tiers (common benefit). */
    subtitle?: string
  }
  /** Supporting benefits shown as a compact checklist. */
  benefits: string[]
}

/**
 * Tiers, in ascending-threshold order, all in one place.
 * The modal renders only the four named-benefit tiers as cards;
 * Wall of Fame is surfaced as a disclaimer row under the cards.
 */
export const CONTRIBUTION_TIERS: ContributionTier[] = [
  {
    id: "wall",
    name: "Wall of Fame",
    price: 50,
    headline: {
      icon: "wall",
      title: "Wall of Fame entry",
    },
    benefits: [
      "Fingerprint in grey with name & generation on the Wall of Fame",
    ],
  },
  {
    id: "founding",
    name: "Founding Member",
    price: 1_000,
    headline: {
      icon: "workspace",
      size: "~2 sqm",
      title: "Workspace",
      subtitle: "Branded after your startup / choice",
    },
    benefits: [
      "Photo on the Founding Member wall",
      "Fingerprint in black with name & generation on the Wall of Fame",
    ],
  },
  {
    id: "bronze",
    name: "Bronze",
    price: 5_000,
    headline: {
      icon: "meeting",
      size: "~12 sqm",
      title: "Meeting room",
      subtitle: "Named after your startup / choice",
    },
    benefits: [
      "Priority Access, key card first",
      "Photo on the Founding Member wall",
      "Fingerprint in blue on the Wall of Fame",
    ],
  },
  {
    id: "silver",
    name: "Silver",
    price: 10_000,
    headline: {
      icon: "office",
      size: "25+ sqm",
      title: "Incubation office",
      subtitle: "Named after your startup / choice",
    },
    benefits: [
      "Priority Access, key card first",
      "Photo on the Founding Member wall",
      "Fingerprint in gold at the centre of the wall",
    ],
  },
  {
    id: "gold",
    name: "Gold",
    price: 15_000,
    tag: "Top tier",
    headline: {
      icon: "community",
      size: "50+ sqm",
      title: "Community room",
      subtitle: "Named after your startup / choice",
    },
    benefits: [
      "Priority Access, key card first",
      "Photo on the Founding Member wall",
      "Fingerprint on a metal disk at the wall's centre",
    ],
  },
]

export type SponsoringTier = {
  id: string
  name: string
  price: number | "X"
  available: number | null
  taken: number
  benefits: string[]
}

export const SPONSORING_TIERS: SponsoringTier[] = [
  {
    id: "title-room",
    name: "Title Room",
    price: 15_000,
    available: 4,
    taken: 2,
    benefits: [
      "Room permanently bears your name",
      "Custom branding: your logo and design in the room",
      "Daily visibility to every MM scholar, future founder, and potential employee",
      "Prominent placement on the Wall of Fame",
    ],
  },
  {
    id: "meeting-room",
    name: "Meeting Room",
    price: 7_500,
    available: 3,
    taken: 0,
    benefits: [
      "Your logo on the meeting room door",
      "Visibility during every pitch, interview, and first meeting",
      "Recruiting visibility at decision-making moments",
      "Prominent placement on the Wall of Fame",
    ],
  },
  {
    id: "gruendungsmitglied",
    name: "Gründungsmitglied",
    price: 5_000,
    available: null,
    taken: 0,
    benefits: [
      "Official Founding Member status",
      "Company logo displayed prominently and permanently on the Wall of Fame",
      "Visible to everyone who enters the office",
    ],
  },
  {
    id: "wall-of-fame",
    name: "Wall of Fame",
    price: "X",
    available: null,
    taken: 0,
    benefits: [
      "Included in a shared artwork installation",
      "A fingerprint in MM style with your name, company logo, and generation",
      "Permanently commemorated alongside all other contributors",
    ],
  },
]

export type RoomSponsor = {
  name: string
  amount: number
  anonymous?: boolean
}

export type Room = {
  id: number
  name: string
  type: string
  sqm: number
  /** Warmmiete inkl. BK-VZ, inkl. 19 % MwSt (€/month) */
  monthlyRent: number
  sponsorGoal: number
  sponsors: RoomSponsor[]
  order: number
  imagePlaceholder: string | null
}

/* Ordered by relevance for fundraising fill-order (community → incubation).
   The hero milestone strip pours donations across ROOMS in this array order,
   and room-progress-section sorts by `order` — both pick this sequence up.

   Each `sponsorGoal` is the Jahres-Warmmiete brutto (Row 22 of the
   Kostenaufstellung). monthlyRent is Warmmiete/Monat brutto (Row 16). */

/** 3 × Kaltmiete netto for all 5 rooms (ohne MwSt). Fundraising step 0. */
export const KAUTION = 15_536.01

export const ROOMS: Room[] = [
  {
    id: 14,
    name: "Common Space",
    type: "Title Room",
    sqm: 56.04,
    monthlyRent: 1591.16,
    sponsorGoal: 19_093.93,
    sponsors: [
      { name: "Thomas", amount: 10_000 },
      { name: "Alumni Association", amount: 5_000 },
    ],
    order: 1,
    imagePlaceholder: "/office/room1.jpg",
  },
  {
    id: 13,
    name: "Coworking",
    type: "Title Room",
    sqm: 56.72,
    monthlyRent: 1610.47,
    sponsorGoal: 19_325.70,
    sponsors: [{ name: "Lio", amount: 16_240 }],
    order: 2,
    imagePlaceholder: "/office/room2.jpg",
  },
  {
    id: 12,
    name: "Deep Work / Focus",
    type: "Title Room",
    sqm: 42.12,
    monthlyRent: 1195.93,
    sponsorGoal: 14_351.11,
    sponsors: [],
    order: 3,
    imagePlaceholder: "/office/room3.jpg",
  },
  {
    id: 8,
    name: "Meeting Rooms",
    type: "Meeting Room",
    sqm: 52.44,
    monthlyRent: 1488.94,
    sponsorGoal: 17_867.28,
    sponsors: [],
    order: 4,
    imagePlaceholder: "/office/room4.jpg",
  },
  {
    id: 9,
    name: "Incubation Space",
    type: "Title Room",
    sqm: 53.44,
    monthlyRent: 1517.33,
    sponsorGoal: 18_208.00,
    sponsors: [{ name: "Adrian", amount: 10_000 }],
    order: 5,
    imagePlaceholder: "/office/room5.jpg",
  },
]

export const TOTAL_MONTHLY_RENT = ROOMS.reduce((s, r) => s + r.monthlyRent, 0)

export const FUNDRAISING_GOAL =
  KAUTION + ROOMS.reduce((s, r) => s + r.sponsorGoal, 0)

export const ADDITIONAL_ROOMS = [
  { id: 3, sqm: 56.10, monthlyRent: 1338.54 },
  { id: 19, sqm: 42.20, monthlyRent: 1006.89 },
]
