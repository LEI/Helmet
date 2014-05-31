'use strict';

angular.module('helmetApp')

/*
 *	Text To Speech
 */
.service('TextToSpeech', [
	'$q',
function($q) {
	if ('speechSynthesis' in window) {
		this.message = new SpeechSynthesisUtterance();
		this.voices = speechSynthesis.getVoices();
		this.message.lang = 'fr-FR';
		// voiceURI 'native'
		// volume (1) [0-1]
		// rate (1) [0.1-10]
		// pitch (2) [0,2]
	} else {
		alert('Synthèse vocale impossible');
	}
	this.say = function(text) {
		var deferred = $q.defer();
		if (this.message !== undefined) {
			this.message.onend = function(e) { deferred.resolve(e); };
			this.message.text = text;
			speechSynthesis.speak(this.message);
		} else {
			deferred.reject('Synthèse vocale impossible');
		}
		return deferred.promise;
	}
	this.setVoice = function(name) {
		if (this.message !== undefined) {
			this.message.voice = voices.filter( function(voice) {
				return voice.name == name;
			})[0];
		}
	}
}])

/*
 *	Speech Recognition
 */
.service('SpeechRecognition', [
	'$rootScope',
function($rootScope) {
	var sr = window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;
	if (sr !== null) {
		sr = new SpeechRecognition();
		sr.continuous = true;
		sr.interimResults = true;
	} else {
		alert('Reconnaissance vocale impossible');
	}
	this.onStart = function() {};
	this.onEnd = function() {};
	this.onResult = function(event) {
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
	this.onError = function(event) {
		console.log('Erreur ' + event.message);
	};
	this.start = function () {
		try {
			sr.start();
		} catch(e) {
			alert(e.message);
		}
	};
	this.stop = function () {
		sr.stop();
	};
	sr.onstart = this.onStart;
	sr.onend = this.onEnd;
	sr.onresult = this.onResult;
	sr.onerror = this.onError;
}]);
