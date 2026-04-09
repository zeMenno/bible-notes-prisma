/* Minimal service worker for PWA install eligibility (Chromium). No offline caching. */
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", () => {
  // Satisfies installability (fetch handler) without intercepting responses.
});
