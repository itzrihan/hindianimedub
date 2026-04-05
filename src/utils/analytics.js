// Google Analytics 4 — G-BPVDN92KZF
// Tracks every SPA route change as a page_view

export const trackPageView = (url) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: url,
      page_location: window.location.href,
      page_title: document.title,
      send_to: 'G-BPVDN92KZF',
    })
  }
}

export const trackEvent = (eventName, params = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      send_to: 'G-BPVDN92KZF',
      ...params,
    })
  }
}
