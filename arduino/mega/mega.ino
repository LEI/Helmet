// -> D
//BTA=000666524220
//BTName=RN52-4220
//Authen=1
//Authen=1
//COD=240704
//DiscoveryMask=FF
//ConnectionMask=FF
//PinCod=1234
//AudioRoute=00
//ExtFeatr

// -> Q
// 0002

int cmdPin = 2,
		evtPin = 4,
		bpsPin = 3,
    resetPin = 5;

void setup() {

	pinMode(evtPin,INPUT);
	pinMode(resetPin,INPUT);

	/* baud rate 115200 */
	pinMode(bpsPin,INPUT);

	/* baud rate 9600 */
//  pinMode(bpsPin,OUTPUT);
//  digitalWrite(bpsPin,LOW);

	Serial.begin(9600);
	Serial1.begin(115200);

	delay(1000);

	Serial.println("serial bluetooth started");
}

void loop() {

	// Serial USB
	if (Serial.available() > 0) {

		char inChar = Serial.read();

		switch (inChar) {
			case '0':
				Serial.println("*DATA MODE*");
				pinMode(cmdPin,INPUT);
				break;
			case '1':
				Serial.println("*CMD MODE*");
				pinMode(cmdPin,OUTPUT);
				digitalWrite(cmdPin,LOW);
				break;
			case '2':
				Serial.println('SD,02');
				Serial1.write('SD,02');
				break;
                        case 'D':
				Serial.println('D: settings');
				Serial1.write('D');
				break;
                        case 'R':
                                Serial.print("*Reset RN52*");
                                pinMode(resetPin, OUTPUT);
                                digitalWrite(resetPin, LOW); delay(1000);
                                pinMode(resetPin, INPUT); delay(1000);
                                pinMode(resetPin, OUTPUT);
                                digitalWrite(resetPin, LOW); delay(1000);
                                pinMode(resetPin, INPUT); delay(1000);
                                
			default:
				Serial.println( inChar );
				Serial1.write( inChar );
		}

	}
        
        // RN52 return
	if (Serial1.available() > 0) {
		int inByte = Serial1.read();
		Serial.write((char)inByte);

	}


//    String str = bluetooth.readString();
//    Serial.println(str);


		// Donnees envoyees depuis le module bluetooth
		//Serial.println("--- bluetooth available ---");

//    int nbBytes = bluetooth.available();
//    char inData[nbBytes];
//    for (int i = 0; i < nbBytes; i++) {
//      inData[i] = bluetooth.read();
//    }

		/*byte bytesReceived = Serial.readBytesUntil('\n', inData, nbBytes);
		inData[bytesReceived] = '\0';
		for (int i = 0; i < nbBytes; i++) {
			inData[i] = bluetooth.read();
		}
		Serial.flush();
		Serial.println();
		Serial.println(inData);*/

//    while(bluetooth.available() > 0) { //&& bluetooth.read() != '\n'
//      byte inChar = bluetooth.read();
//      Serial.write( inChar );
//      Serial.print(" ");
//      Serial.print( inChar );
//      Serial.print(" ");
//      Serial.println( (byte)inChar );
//      //Serial.write( bluetooth.read() );
//    }
	//delay(100);
}
