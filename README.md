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



	D/BluetoothSerial(15942): action = connectInsecure
	D/BluetoothSerialService(15942): connect to: 00:23:7F:EB:26:43
	D/BluetoothSerialService(15942): setState() 0 -> 2
	I/BluetoothSerial(15942): MESSAGE_STATE_CHANGE: 2
	I/BluetoothSerial(15942): BluetoothSerialService.STATE_CONNECTING
	I/BluetoothSerialService(15942): BEGIN mConnectThread SocketType:Insecure
	E/        ( 4670): ### ASSERT : external/bluetooth/bluedroid/main/../btif/src/btif_dm.c line 1213 unhandled search services event (6) ###
	W/BluetoothAdapter(15942): getBluetoothService() called with no BluetoothManagerCallback
	D/BTIF_SOCK( 4670): service_uuid: 00001101-0000-1000-8000-00805f9b34fb
	D/BluetoothSocket(15942): connect(), SocketState: INIT, mPfd: {ParcelFileDescriptor: FileDescriptor[337]}
	W/bt-sdp  ( 4670): process_service_search_attr_rsp
	E/bt-btif ( 4670): DISCOVERY_COMP_EVT slot id:12, failed to find channle,                                       status:1, scn:0
	W/bt-btif ( 4670): invalid rfc slot id: 12
	E/BluetoothSerialService(15942): java.io.IOException: read failed, socket might closed or timeout, read ret: -1
	W/System.err(15942): java.io.IOException: read failed, socket might closed or timeout, read ret: -1
	W/System.err(15942): 	at android.bluetooth.BluetoothSocket.readAll(BluetoothSocket.java:505)
	W/System.err(15942): 	at android.bluetooth.BluetoothSocket.readInt(BluetoothSocket.java:516)
	W/System.err(15942): 	at android.bluetooth.BluetoothSocket.connect(BluetoothSocket.java:320)
	W/System.err(15942): 	at com.megster.cordova.BluetoothSerialService$ConnectThread.run(BluetoothSerialService.java:371)
	D/BluetoothSerialService(15942): start
	D/BluetoothSerialService(15942): setState() 2 -> 0
	I/BluetoothSerial(15942): MESSAGE_STATE_CHANGE: 0
	I/BluetoothSerial(15942): BluetoothSerialService.STATE_NONE
	D/CordovaLog(15942): file:///android_asset/www/js/controllers/bluetooth.js: Line 50 : Unable to connect to device
