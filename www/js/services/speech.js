'use strict';

angular.module('helmetApp')

/*
 *	Text To Speech
 */
.factory('TextToSpeech', [
	'$q',
function($q) {
	if ('speechSynthesis' in window) {
		var message = new SpeechSynthesisUtterance();
		message.lang = 'fr-FR';
		// voiceURI 'native'
		// volume (1) [0-1]
		// rate (1) [0.1-10]
		// pitch (2) [0,2]
		return {
			voices: speechSynthesis.getVoices(),
			setVoice: function(name) {
				message.voice = voices.filter( function(voice) {
					return voice.name == name;
				})[0];
			},
			say: function(text) {
				var deferred = $q.defer();
				message.onend = function(e) { deferred.resolve(e); };
				message.text = text;
				speechSynthesis.speak(message);
				return deferred.promise;
			}
		}
	} else {
		alert('Synthèse vocale ' + speechSynthesis)
	}
}])

/*
 *	Speech Recognition
 */
.service('SpeechRecognition', [
	'$rootScope',
function($rootScope) {
	window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;
	if (window.SpeechRecognition !== null) {
		var sr = new SpeechRecognition();
		sr.continuous = true;
		sr.interimResults = true;
		sr.onstart = this.onStart = function() {};
		sr.onend = this.onEnd = function() {};
		sr.onresult = this.onResult = function(event) {
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
		sr.onerror = this.onError = function(event) {
			console.log('Erreur ' + event.message);
		};
		this.start = function () {
			try {
				rs.start();
			} catch(e) {
				alert(e.message);
			}
		};
		this.stop = function () {
			rs.stop();
		};
	} else {
		alert('Reconnaissance vocale ' + webkitSpeechRecognition);
	}
}]);
