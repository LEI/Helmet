#include <LiquidCrystal.h>
#define BUFFER_SIZE 64

int cmdPin = 2,
    evtPin = 4,
    bpsPin = 3,
    resetPin = 5;
    
LiquidCrystal lcd(12, 11, 10, 8, 9 ,7);

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

        //cmdMode();
        lcd.begin(20,2);
}

unsigned char buf[BUFFER_SIZE] = {0}, str[BUFFER_SIZE] = {0};
unsigned char len = 0, count = 0;
unsigned char c;

void loop() {
  
        // RN52 return
	if (Serial1.available()) {
          while(Serial1.available() > 0) {
            c = Serial1.read();
            Serial.write(c);
            if (c != '\n' && c != '\r') {
              lcd.write(c);
            } else {
              lcd.write(" ");
            }
            
            
          }
	}

        while(Serial.available() > 0) {
          c = Serial.read();
          Serial.write(c);
          if(c == 0xA || c == 0xD) {
            sendData();
          } else {
            bufferData(c);
          }
          if (c == '&') {
            resetFactory();
          } else if (c == '#') {
             Serial1.write("SF,1\r");
             delay(20);
             Serial1.write("R,1\r");
          } else if (c == '*') {
            dataMode();
          } else if (c == '$') {
            cmdMode();
          }
        }
}

// ----------------------------------------------------------------------

void bufferData(char c) {
  if(len < BUFFER_SIZE) {
    buf[len++] = c;
  }
}

void sendData() {
  lcd.clear();
  for(byte i = 0; i < len; i++) {
    Serial1.write(buf[i]);
  }
  Serial1.write(0xD);
  len = 0;
  Serial1.flush();
}

void cmdMode() {
  Serial.println("[CMD MODE]");
  pinMode(cmdPin, OUTPUT);
  digitalWrite(cmdPin, LOW);
  delay(100);
}

void dataMode() {
  Serial.println("[DATA MODE]");
  pinMode(cmdPin, INPUT);
  delay(100);
}

void resetFactory() {
  Serial.println("Hard Reset");
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
  Serial.println(" -> OK");
}
