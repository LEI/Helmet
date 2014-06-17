#define BUFFER_SIZE 64

int cmdPin = 2,
		evtPin = 4,
		bpsPin = 3,
    resetPin = 5;

void setup() {

	pinMode(evtPin,INPUT);
	pinMode(resetPin,INPUT);

//        resetFactory();

	/* baud rate 115200 */
	pinMode(bpsPin,INPUT);

	/* baud rate 9600 */
//  pinMode(bpsPin,OUTPUT);
//  digitalWrite(bpsPin,LOW);

	Serial.begin(9600);
	Serial1.begin(115200);

	delay(1000);

	Serial.println("serial bluetooth started");

        pinMode(cmdPin, OUTPUT);
        digitalWrite(cmdPin, LOW);

}

unsigned char buf[BUFFER_SIZE] = {0};
unsigned char len = 0;

void loop() {
  
        // RN52 return
	if (Serial1.available()) {
          while(Serial1.available() > 0) {
		Serial.write(Serial1.read());
          }
	}

        while(Serial.available() > 0) {
          unsigned char c = Serial.read();
          Serial.print((char)c);
          if(c == 0xA || c == 0xD) {
            sendData();
          } else {
            bufferData(c);
          }
        }
}

// ----------------------------------------------------------------------

void bufferData(char c) {
  if(len < BUFFER_SIZE) {
    buf[len++] = c;
  }
  if(c == 'X') {
    resetFactory();
  }
}

void sendData() {
  for(byte i = 0; i < len; i++) {
    Serial1.write(buf[i]) ;
    //Serial.write((char)buf[i]) ;
  }
  
  Serial1.write(0xD);
  Serial.write(0xD);
  len = 0;
  Serial1.flush();
  
  Serial.println();
}

void resetFactory() {
  // LOW
  pinMode(resetPin, OUTPUT); digitalWrite(resetPin, LOW);
  delay(1000);
  // HIGH
  pinMode(resetPin, INPUT);
  delay(1000);
  // LOW
  pinMode(resetPin, OUTPUT); digitalWrite(resetPin, LOW);
  delay(1000);
  // HIGH
  pinMode(resetPin, INPUT);
  delay(1000);
  Serial1.write('\r');
  Serial.print("Reset terminé");
}
