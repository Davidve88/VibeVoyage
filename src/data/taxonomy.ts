export const LANGS = ['en', 'de', 'es'] as const;
export type Lang = (typeof LANGS)[number];
export type Tri = Record<Lang, string>;

export const AREAS = {
  raval: { en: 'Raval & La Rambla', de: 'Raval & La Rambla', es: 'El Raval y La Rambla' },
  gothic: { en: 'Gothic Quarter & El Born', de: 'Gotisches Viertel & El Born', es: 'Barrio Gótico y El Born' },
  eixample: { en: 'Eixample', de: 'Eixample', es: 'Eixample' },
  gracia: { en: 'Gràcia & the north', de: 'Gràcia & Norden', es: 'Gràcia y el norte' },
  montjuic: { en: 'Montjuïc', de: 'Montjuïc', es: 'Montjuïc' },
  seafront: { en: 'Seafront', de: 'Am Meer', es: 'Frente marítimo' },
  daytrips: { en: 'Day trips', de: 'Ausflüge', es: 'Excursiones' },
} satisfies Record<string, Tri>;

export const THEMES = {
  gaudi: { en: 'Gaudí & Modernisme', de: 'Gaudí & Modernisme', es: 'Gaudí y Modernismo' },
  history: { en: 'History', de: 'Geschichte', es: 'Historia' },
  views: { en: 'Views', de: 'Aussicht', es: 'Vistas' },
  nature: { en: 'Nature & walks', de: 'Natur & Spaziergänge', es: 'Naturaleza y paseos' },
  food: { en: 'Food & markets', de: 'Essen & Märkte', es: 'Comida y mercados' },
  art: { en: 'Art & museums', de: 'Kunst & Museen', es: 'Arte y museos' },
} satisfies Record<string, Tri>;

export type AreaId = keyof typeof AREAS;
export type ThemeId = keyof typeof THEMES;
