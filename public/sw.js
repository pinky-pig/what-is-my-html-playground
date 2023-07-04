const cacheName = "what-is-my-html-playground"

const contentToCache = [
	"./",
	"./assets/",
  "./arvin.svg",
	"./favicon.svg",
	"./index.html",
  "./manifest.webmanifest",
	"./pwa-192x192.png",
	"./pwa-512x512.png",
	"./registerSW.js",
	"./safari-pinned-tab.svg",
	"./sw.js",
];

self.addEventListener("install", (e) => {
	console.log("Service Worker installed");
	e.waitUntil(
		(async () => {

      const cache = await caches.open(cacheName);
      for (const item of contentToCache) {
        try {
          await cache.add(item);
          console.log("Cached: " + item);
        } catch (error) {
          console.log("Cache error for " + item + ": " + error);
        }
      }

			// const cache = await caches.open(cacheName);
			// await cache.addAll(contentToCache).catch(err => console.log(err));
		})()
	);
});

self.addEventListener("fetch", function (event) {
	event.respondWith(fetch(event.request).then((res) => {
		let response = res.clone();
        caches.open(cacheName).then((cache) => {
          cache.put(event.request, response);
        });
		return res
	}).catch((err) => {
		return caches.match(event.request)
	})
	);
});
