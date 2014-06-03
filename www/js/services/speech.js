'use strict';

angular.module('helmetApp')

/*
 *	Text To Speech
 */
.factory('TextToSpeech', [
	'$q',
function($q) {
	if ('speechSynthesis' in window) {
		var message = new SpeechSynthesisUtterance(),
			voices = speechSynthesis.getVoices();
		message.lang = 'fr-FR';
		// voiceURI 'native'
		// volume (1) [0-1]
		// rate (1) [0.1-10]
		// pitch (2) [0,2]
	} else {
		//alert('Synthèse vocale impossible');
	}
	return {
		active: false,
		say: function(text) {
			var deferred = $q.defer();
			if (this.active) {
				message.text = text;
				message.onend = function(e) { deferred.resolve(e); };
				speechSynthesis.speak(message);
			}
			return deferred.promise;
		},
		setVoice: function(name) {
			message.voice = voices.filter( function(voice) {
				return voice.name == name;
			})[0];
		}
	};
}])

/*
 *	Speech Recognition
 */
.factory('SpeechRecognition', [
	'$rootScope',
function($rootScope) {
	window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;
	if (window.SpeechRecognition !== null) {
		var sr = new SpeechRecognition();
		sr.continuous = true;
		sr.interimResults = true;
		sr.onstart = function() {};
		sr.onend = function() {};
		sr.onresult = function(event) {
			var finalTranscript, interimTranscript = '';

			for (var i = event.resultIndex; i < event.results.length; ++i) {
				if (event.results[i].isFinal) {
					finalTranscript += event.results[i][0].transcript;
					console.log(event.results[i][0].confidence);
				} else {
					interimTranscript += event.results[i][0].transcript;
				}
			}

			var transcipt = {
				result: finalTranscript,
				interim: interimTranscript
			}
			console.log(transcript);
			return transcript;
			/*final_transcript = capitalize(final_transcript);
			final_span.innerHTML = linebreak(final_transcript);
			interim_span.innerHTML = linebreak(interim_transcript);*/
		};
		sr.onerror = function(event) {
			console.log('Erreur ' + event.message);
		};
	} else {
		//alert('Reconnaissance vocale impossible');
	}
	return {
		start: function () {
			try {
				sr.start();
			} catch(e) {
				alert(e.message);
			}
		},
		stop: function () {
			sr.stop();
		}
	};
}]);
