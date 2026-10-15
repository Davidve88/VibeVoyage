// Cookieless analytics. Leave `id` empty to ship no tracking script at all.
// provider "cloudflare": id = Web Analytics token (dash.cloudflare.com > Web Analytics > Add a site).
// provider "umami":      id = Website ID from Umami (cloud.umami.is).
export const analytics: { provider: 'cloudflare' | 'umami'; id: string } = {
  provider: 'cloudflare',
  id: '',
};
