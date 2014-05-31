# Helmet

	bower install

## AngularJS

http://www.learn-angular.org/

http://www.ng-newsletter.com/posts/how-to-learn-angular.html

### Bluetooth

https://github.com/don/BluetoothSerial

http://don.github.io/slides/2014-04-07-apachecon-bluetooth

## AndroidManifest.xml

Ajouter ces lignes si l'application ne fonctionne pas correctement

	<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
	<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
	<uses-permission android:name="android.permission.ACCESS_LOCATION_EXTRA_COMMANDS" />
    <uses-permission android:name="fr.faclab.helmet.permission.MAPS_RECEIVE" />
    <permission android:name="fr.faclab.helmet.permission.MAPS_RECEIVE" android:protectionLevel="signature" />
    <meta-data android:name="com.google.android.v3.API_KEY" android:value="AIzaSyBeWwtoeeOeLsLI1LqOiwERKcm00fq6Vbg" />

## Cordova

	cordova create helmet fr.faclab.helmet Helmet

	adb logcat CordovaLog:D *:S


http://github.com/poiuytrez/SpeechRecognizer

http://blog.safaribooksonline.com/2013/10/30/html5-web-speech-angularjs-directive/

https://github.com/TalAter/annyang