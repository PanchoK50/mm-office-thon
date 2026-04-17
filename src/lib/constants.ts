export const DONATION_TIERS = [500, 1000, 5000, 7500, 15000] as const

export const GENERATIONS = Array.from({ length: 45 }, (_, i) => `G${i + 1}`)
export const MIN_CUSTOM_AMOUNT = 10
export const MAX_CUSTOM_AMOUNT = 50000

export type SponsoringTier = {
  id: string
  name: string
  price: number
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
    price: 0,
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
  /** Warmmiete inkl. BK-VZ, ohne MwSt (€/month) */
  monthlyRent: number
  sponsorGoal: number
  sponsors: RoomSponsor[]
  order: number
  imagePlaceholder: string | null
}

export const ROOMS: Room[] = [
  {
    id: 13,
    name: "Coworking",
    type: "Title Room",
    sqm: 56.72,
    monthlyRent: 1353.34,
    sponsorGoal: 15_000,
    sponsors: [{ name: "Lio", amount: 16_240 }],
    order: 1,
    imagePlaceholder: null,
  },
  {
    id: 14,
    name: "Common Space",
    type: "Title Room",
    sqm: 56.04,
    monthlyRent: 1337.11,
    sponsorGoal: 15_000,
    sponsors: [
      { name: "Thomas", amount: 10_000 },
      { name: "Alumni Association", amount: 5_000 },
    ],
    order: 2,
    imagePlaceholder: null,
  },
  {
    id: 12,
    name: "Deep Work / Focus",
    type: "Title Room",
    sqm: 42.12,
    monthlyRent: 1004.98,
    sponsorGoal: 15_000,
    sponsors: [],
    order: 3,
    imagePlaceholder: null,
  },
  {
    id: 9,
    name: "Incubation Space",
    type: "Title Room",
    sqm: 53.44,
    monthlyRent: 1275.07,
    sponsorGoal: 15_000,
    sponsors: [{ name: "Anonymous", amount: 5_000, anonymous: true }],
    order: 4,
    imagePlaceholder: null,
  },
  {
    id: 8,
    name: "Meeting Rooms",
    type: "Meeting Room",
    sqm: 52.44,
    monthlyRent: 1251.21,
    sponsorGoal: 7_500,
    sponsors: [],
    order: 5,
    imagePlaceholder: null,
  },
]

export const TOTAL_MONTHLY_RENT = ROOMS.reduce((s, r) => s + r.monthlyRent, 0)

export const ADDITIONAL_ROOMS = [
  { id: 3, sqm: 56.10, monthlyRent: 1338.54 },
  { id: 19, sqm: 42.20, monthlyRent: 1006.89 },
]
