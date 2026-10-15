export const LANGS = ['en', 'de', 'es'] as const;
export type Lang = (typeof LANGS)[number];
export type Tri = Record<Lang, string>;

export const AREAS = {
  eixample: { en: 'Eixample', de: 'Eixample', es: 'Eixample' },
  gracia: { en: 'Gràcia & Carmel', de: 'Gràcia & Carmel', es: 'Gràcia y el Carmel' },
  gothic: { en: 'Gothic Quarter', de: 'Gotisches Viertel', es: 'Barrio Gótico' },
  born: { en: 'El Born & Ciutadella', de: 'El Born & Ciutadella', es: 'El Born y la Ciutadella' },
  raval: { en: 'Raval & La Rambla', de: 'Raval & La Rambla', es: 'El Raval y La Rambla' },
  montjuic: { en: 'Montjuïc', de: 'Montjuïc', es: 'Montjuïc' },
  seafront: { en: 'Seafront', de: 'Am Meer', es: 'Frente marítimo' },
  beyond: { en: 'Beyond the city', de: 'Außerhalb der Stadt', es: 'Fuera de la ciudad' },
} satisfies Record<string, Tri>;

export const THEMES = {
  gaudi: { en: 'Gaudí & Modernisme', de: 'Gaudí & Modernisme', es: 'Gaudí y Modernismo' },
  art: { en: 'Museums & Art', de: 'Museen & Kunst', es: 'Museos y arte' },
  history: { en: 'History & Religion', de: 'Geschichte & Religion', es: 'Historia y religión' },
  parks: { en: 'Parks & Views', de: 'Parks & Aussicht', es: 'Parques y vistas' },
  walks: { en: 'Neighborhoods & Walking', de: 'Viertel & Spaziergänge', es: 'Barrios y paseos' },
  daytrips: { en: 'Day Trips', de: 'Ausflüge', es: 'Excursiones' },
} satisfies Record<string, Tri>;

// Shown as a label on each card (not a filter).
export const COSTS = {
  free: { en: 'Free', de: 'Kostenlos', es: 'Gratis' },
  paid: { en: 'Paid', de: 'Kostenpflichtig', es: 'De pago' },
  mixed: { en: 'Free / Paid', de: 'Kostenlos / Kostenpflichtig', es: 'Gratis / De pago' },
  freeSlots: {
    en: 'Paid, with free time slots',
    de: 'Kostenpflichtig, mit kostenlosen Zeitfenstern',
    es: 'De pago, con franjas gratuitas',
  },
  transport: {
    en: 'Paid transport / optional tickets',
    de: 'Kostenpflichtige Anreise / optionale Tickets',
    es: 'Transporte de pago / entradas opcionales',
  },
} satisfies Record<string, Tri>;

export type AreaId = keyof typeof AREAS;
export type ThemeId = keyof typeof THEMES;
export type CostId = keyof typeof COSTS;
