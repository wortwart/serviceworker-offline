'use strict';
const cacheName = 'app-v1'; // change when cached content is updated
const pathRoot = '/test/progressive/demo/' // change to your directory
const filesToCache = [
	'',
	'index.html',
	'app.js',
	'style.css'
];

// Triggers when installing
self.addEventListener('install', ev => {
	console.info('ServiceWorker ' + cacheName + ': installation');
	ev.waitUntil(
		caches
			.open(cacheName)
			.then(cache => {
				// cache all files from list
				console.info('ServiceWorker ' + cacheName + ': caching of app');
				cache.addAll(filesToCache.map(el => {
					return pathRoot + el;
				}));
			})
			.catch(err => {
				console.error('Error!', err);
			})
	);
});

// Triggers after install has finished
self.addEventListener('activate', ev => {
	console.info('ServiceWorker ' + cacheName + ': activation');
	ev.waitUntil(
		caches
			.keys()
			.then(keyList => {
				// delete unused caches
				keyList.forEach(key => {
					if (key !== cacheName) {
						console.info('ServiceWorker ' + cacheName + ': delete ' + key);
						caches.delete(key);
					}
				});
			})
	);
	return self.clients.claim();
});

// Triggers when a URL is requested
self.addEventListener('fetch', ev => {
	console.info('ServiceWorker ' + cacheName + ': get ' + ev.request.url);
	ev.respondWith(
		caches
		.match(ev.request)
		.then(response => {
			if (response) { // is it in the cache?
				console.info('ServiceWorker ' + cacheName + ': loading from cache ' + response.url);
				// If it's an HTML page change the response
				// insert a hint above the <h1>
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
			return fetch(ev.request) // Not found in cache: fetch it
			.then(response => {
				console.info('ServiceWorker ' + cacheName + ': Loading from network ' + response.url);
				if (!response.ok) {
					if (response.type === 'opaque')
						console.warn('No access to data', ev.request.url);
					else
						console.warn('URL error', response.status, response.url);
				}
				return response;
			})
			.catch(err => {
				console.error('ServiceWorker ' + cacheName + ': Loading from network has failed', err);
			});
		})
	)
});
