# Helmet

	bower install

## AngularJS

http://www.learn-angular.org/

http://www.ng-newsletter.com/posts/how-to-learn-angular.html

### Bluetooth

https://github.com/don/BluetoothSerial

http://don.github.io/slides/2014-04-07-apachecon-bluetooth

## AndroidManifest.xml

Ajouter ces lignes si l'application ne fonctionne pas correctement (platforms/android/AndroidManifest.xml)

	<uses-feature android:name="android.hardware.bluetooth" android:required="true" />
    <uses-feature android:name="android.hardware.bluetooth_le" android:required="true" />
	<uses-feature android:name="android.hardware.location" android:required="true" />
	<uses-feature android:name="android.hardware.location.gps" android:required="true" />
	<uses-feature android:name="android.hardware.location.network" android:required="true" />
	<permission android:name="fr.faclab.helmet.permission.MAPS_RECEIVE" android:protectionLevel="signature" />
	<meta-data android:name="com.google.android.v3.API_KEY" android:value="AIzaSyBeWwtoeeOeLsLI1LqOiwERKcm00fq6Vbg" />
	<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
	<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
	<uses-permission android:name="android.permission.ACCESS_LOCATION_EXTRA_COMMANDS" />
	<uses-permission android:name="fr.faclab.helmet.permission.MAPS_RECEIVE" />
	<uses-permission android:name="android.permission.BLUETOOTH" />
	<uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
	<uses-permission android:name="android.permission.MOUNT_UMOUNT_FILESYSTEMS" />
	<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />

## Cordova

	cordova create helmet fr.faclab.helmet Helmet

	adb logcat CordovaLog:D *:S


http://github.com/poiuytrez/SpeechRecognizer

http://blog.safaribooksonline.com/2013/10/30/html5-web-speech-angularjs-directive/

https://github.com/TalAter/annyang