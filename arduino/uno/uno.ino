#include <SoftwareSerial.h>
#include <LiquidCrystal.h>
#define BUFFER_SIZE 64

int cmdPin = 2;

unsigned char buf[BUFFER_SIZE] = {0};
unsigned char len = 0;
unsigned char c;
boolean mode;
    
LiquidCrystal lcd(12, 11, 5, 4, 3, 7);

void setup() {
  Serial.begin(115200); // Init Serial monitor
//  lcd.begin(20,2);      // Init LCD
  
  mode = 'data';
  
//  lcd.setCursor(0, 0);
//  lcd.print("Hello");
          
//  Serial.println("Serial started");
  
//  dataMode();
}

void loop() {
   // If data available, read it
   if(Serial.available()) {
     // CMD return
     if(mode == 'cmd') {
       while(Serial.available() > 0) {
         Serial.read();
       }
     }
     
     // DATA return
     if(mode == 'data') {
       while(Serial.available() > 0) {
       
       }
     }
     
   // Otherwise ...
   } else {
     mode = 'data';
   }
   
   //////////////
   // Commands //
   //////////////
   
   // Cmd: D
   c = 'D';
   cmdMode();
   bufferData(c);
   sendDataSerial();
   dataMode();
   
}

void cmdMode() {
  mode = 'cmd';
  Serial.println("[CMD MODE]");
  pinMode(cmdPin, OUTPUT);
  digitalWrite(cmdPin, LOW);
  delay(100);
}

void dataMode() {
  pinMode(cmdPin, INPUT);
  Serial.println("[DATA MODE]");
  delay(100);
}

void bufferData(char c) {
  if(len < BUFFER_SIZE) {
    buf[len++] = c;
  }
}

void sendDataLCD() {
  lcd.clear();
  for(byte i = 0; i < len; i++) {
    lcd.write(buf[i]);
  }
  lcd.write(0xD);
  len = 0;
}

void sendDataSerial() {
  for(byte i = 0; i < len; i++) {
    Serial.write(buf[i]);
  }
  Serial.write(0xD);
  Serial.write(0xA);
  len = 0;
}
