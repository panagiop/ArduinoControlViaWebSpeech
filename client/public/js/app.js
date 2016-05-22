(function() {
	'use strict';

	function Controller($window, mySocket) {
		var self = this;

		self.speechRecognition = function() {
			var recognition = new webkitSpeechRecognition();

			recognition.continuous = true;
			recognition.interimResults = true;

			recognition.onresult = function(event) {
			    var colour = event.results[event.results.length - 1][0].transcript;
			    colour = colour.toLowerCase();
			    colour = colour.replace(/\s/gi, '');

				mySocket.emit('led:color:change', colour);
			};

			recognition.start();
		};

		if ( !('webkitSpeechRecognition' in $window) ) {
      		alert("Sorry your browser doesn't support speech recognition API");
    	} else {
			self.speechRecognition();
		}
	}

	Controller.$inject = ['$window', 'mySocket'];

	angular.module('App', ['btford.socket-io'])
		.controller('Controller', Controller)
		.factory('mySocket', function (socketFactory) {
	        return socketFactory();
	    });
})();
