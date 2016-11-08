+function() {
	'use strict';

	// check and watch if we are online
	var isOnline;
	var stat = document.getElementById('status');
	var amIOnline = function() {
		stat.textContent = navigator.onLine? 'online' : 'offline';
	}
	window.addEventListener('online', amIOnline);
	window.addEventListener('offline', amIOnline);
	amIOnline();

	// ServiceWorker registration
	if ('serviceWorker' in navigator) {
		if (navigator.serviceWorker.controller) {
			console.log('ServiceWorker runs');
		} else {
			console.log('Registering ServiceWorker ...');
			navigator.serviceWorker
			.register('./serviceworker.js')
			.then(function(swRegistration) {
				// swRegistration is of type ServiceWorkerRegistration
				// https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration
				console.log('ServiceWorkerRegistration', swRegistration);
				if (swRegistration.active) {
					console.log('ServiceWorker', swRegistration.active);
					// swRegistration.active is of type ServiceWorker
					// https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorker
					swRegistration.active.addEventListener('statechange', function(ev) {
						console.log(ev);
					});
				} else {
					console.warn('ServiceWorker not yet active');
				}
				// navigator.serviceWorker is of type ServiceWorkerContainer
				// https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer
				navigator.serviceWorker.addEventListener('controllerchange', function(ev) {
					// navigator.serviceWorker.controller is of type ServiceWorker
					console.log('ServiceWorkerContainer', navigator.serviceWorker.controller);
				});
			})
			.catch(function(err) {
				console.error('ServiceWorker has not been registered!', err)
			});
		}
	} else {
		alert('This Browser does not support ServiceWorkers.');
	}
}();