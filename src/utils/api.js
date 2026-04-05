const BASE = 'https://rihan1.vercel.app/api'

async function get(path) {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`API error ${res.status}`)
  return res.json()
}

export const api = {
  home: () => get('/home'),
  animeList: (page = 1) => get(`/anime?page=${page}`),
  animeTop: () => get('/anime/top'),
  animeSearch: (q, page = 1) => get(`/anime/search?q=${encodeURIComponent(q)}&page=${page}`),
  animeGenre: (genre, page = 1) => get(`/anime/genre/${genre}?page=${page}`),
  // season = season number filter (for SxE slugs)
  // seasonSlug = the actual series slug for that season (for separate-page seasons)
  animeDetail: (id, season, seasonSlug) => {
    const params = new URLSearchParams()
    if (season !== undefined && season !== null) params.set('season', String(season))
    if (seasonSlug && seasonSlug !== id) params.set('seasonSlug', seasonSlug)
    const qs = params.toString()
    return get(`/anime/${id}${qs ? '?' + qs : ''}`)
  },
  episode: (id) => get(`/episode/${id}`),
  video: (url) => get(`/video?url=${encodeURIComponent(url)}`),
  genres: () => get('/genres'),
  cartoons: (page = 1) => get(`/cartoons?page=${page}`),
  movies: (page = 1) => get(`/movies?page=${page}`),
  byLanguage: (lang, page = 1) => get(`/language/${lang}?page=${page}`),
}
