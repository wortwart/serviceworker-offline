'use strict';
const cacheName = 'app-v1';
const pathRoot = '/test/progressive/demo/'
const filesToCache = [
	'',
	'index.html',
	'app.js',
	'style.css'
];

self.addEventListener('install', ev => {
	console.info('ServiceWorker ' + cacheName + ': Installation');
	ev.waitUntil(
		caches
			.open(cacheName)
			.then(cache => {
				console.info('ServiceWorker ' + cacheName + ': Caching der App');
				cache.addAll(filesToCache.map(el => {
					return pathRoot + el;
				}));
			})
			.catch(err => {
				console.error('Fehler!', err);
			})
	);
});

self.addEventListener('activate', ev => {
	console.info('ServiceWorker ' + cacheName + ': Aktivierung');
	ev.waitUntil(
		caches
			.keys()
			.then(keyList => {
				keyList.forEach(key => {
					if (key !== cacheName) {
						console.info('ServiceWorker ' + cacheName + ': Lösche ' + key);
						caches.delete(key);
					}
				});
			})
	);
	return self.clients.claim();
});

self.addEventListener('fetch', ev => {
	console.info('ServiceWorker ' + cacheName + ': Hole ' + ev.request.url);
	ev.respondWith(
		caches
		.match(ev.request)
		.then(response => {
			if (response) {
				console.info('ServiceWorker ' + cacheName + ': Lade aus dem Cache ' + response.url);
				if (response.headers.get('Content-Type') === 'text/html') {
					return response.text().then(txt => {
						let head = {
							status: 200,
							statusText: "OK",
							headers: {'Content-Type': 'text/html'}
						};
						let body = txt.replace(/<h1>/, '<h2>Diese Seite kommt aus dem Cache!</h2><h1>');
						return new Response(body, head);
					});
				}
				return response;
			}
			return fetch(ev.request) // Nicht im Cache gefunden
			.then(response => {
				console.info('ServiceWorker ' + cacheName + ': Lade aus dem Netzwerk ' + response.url);
				if (!response.ok) {
					if (response.type === 'opaque')
						console.warn('Kein Zugriff auf Daten', ev.request.url);
					else
						console.warn('URL-Fehler', response.status, response.url);
				}
				return response;
			})
			.catch(err => {
				console.error('ServiceWorker ' + cacheName + ': Laden aus dem Netzwerk ist gescheitert', err);
			});
		})
	)
});
