# Helmet

	git clone git@github.com:LEI/Helmet.git

	bower install

	cordova create helmet fr.faclab.helmet Helmet

	cordova run android

	adb logcat CordovaLog:D *:S

### AndroidManifest.xml

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



https://code.google.com/p/tinkerit/wiki/Cantarino

http://github.com/poiuytrez/SpeechRecognizer

http://blog.safaribooksonline.com/2013/10/30/html5-web-speech-angularjs-directive/

https://github.com/TalAter/annyang


## Arduino

[Code up-to-date](https://github.com/LEI/Helmet/blob/master/arduino/uno/uno.ino)

*~~Les ports data de l'Arduino (RX & TX) sont utilisés par le port USB lorsque celui-ci est connecté à un ordinateur. Cette ligne de donnée étant occupée, la library [SoftwareSerial](http://arduino.cc/en/Reference/SoftwareSerial) est utilisée pour créer une ligne data sur les pins digitales 5 et 6 de l'Arduino.~~*
(Non valable pour Arduino Mega)

* Pour l'upload du programme sur le microcontrolleur, préférer le port série `/dev/cu.usbmodemxxxxx`
* Utiliser le même baudrate (bps) sur le port série USB que celui configuré dans le code (9600).
* Utiliser la commande suivante pour un monitoring du port série USB `screen /dev/tty.usbmodemxxxxx <bps>`