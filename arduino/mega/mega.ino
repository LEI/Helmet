#include <LiquidCrystal.h>
#define BUFFER_SIZE 64

int cmdPin = 2;

unsigned char buf[BUFFER_SIZE] = {0};
unsigned char len = 0;
unsigned char c;
    
LiquidCrystal lcd(12, 11, 5, 4, 3, 7);

void setup() {
  /* baud rate 9600 */
//  pinMode(bpsPin,OUTPUT);
//  digitalWrite(bpsPin,LOW);
  /* baud rate 115200 */
//  pinMode(bpsPin,INPUT);

  Serial.begin(115200);
  
  cmdMode();
  
  delay(1000);
  
  lcd.write("Hello");
          
  Serial.println("Serial started");
  
  lcd.begin(20,2);
  lcd.write("Hello");
  
  dataMode();
}

void loop() {
   while(Serial.available() > 0) {
    // c = Serial.read();
     //Serial.print((char)c);
     lcd.write((char)Serial.read());
     
      /*if (c != '\n' && c != '\r') {
        lcd.write(c);
      } else {
        lcd.write(" ");
      }*/
      /*if(c == 0xA || c == 0xD) {
        sendData();
      } else {
        bufferData(c);
      }
     
     if (c == '$') {
       cmdMode();
       //Serial.println("D");
     } else if (c == '*') {
       dataMode();
     } else if (c == '#') {
       Serial.println("D");
     }*/
   }
}

void cmdMode() {
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

void sendData() {
  lcd.clear();
  for(byte i = 0; i < len; i++) {
    lcd.write(buf[i]);
  }
  lcd.write(0xD);
  len = 0;
}