+function() {
	'use strict';
	var isOnline;
	var stat = document.getElementById('status');
	var amIOnline = function() {
		stat.textContent = navigator.onLine? 'online' : 'offline';
	}
	window.addEventListener('online', amIOnline);
	window.addEventListener('offline', amIOnline);
	amIOnline();

	if ('serviceWorker' in navigator) {
		if (navigator.serviceWorker.controller) {
			console.log('ServiceWorker läuft');
		} else {
			console.log('Registriere ServiceWorker ...');
			navigator.serviceWorker
			.register('./serviceworker.js')
			.then(function(swRegistration) {
				// swRegistration ist vom Typ ServiceWorkerRegistration
				// https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration
				console.log('ServiceWorkerRegistration', swRegistration);
				if (swRegistration.active) {
					console.log('ServiceWorker', swRegistration.active);
					// swRegistration.active ist vom Typ ServiceWorker
					// https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorker
					swRegistration.active.addEventListener('statechange', function(ev) {
						console.log(ev);
					});
				} else {
					console.warn('ServiceWorker noch nicht aktiv');
				}
				// navigator.serviceWorker ist vom Typ ServiceWorkerContainer
				// https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer
				navigator.serviceWorker.addEventListener('controllerchange', function(ev) {
					// navigator.serviceWorker.controller ist vom Typ ServiceWorker
					console.log('ServiceWorkerContainer', navigator.serviceWorker.controller);
				});
			})
			.catch(function(err) {
				console.error('ServiceWorker wurde nicht registriert!', err)
			});
		}
	} else {
		alert('Der Browser unterstützt keine ServiceWorker.');
	}
}();