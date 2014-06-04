#include <SoftwareSerial.h>

int rn52_rx = 5,
    rn52_tx = 6,

    rn52cmd = 2,
    rn52evt = 4,
    rn52lowbps = 7;

#define nbBytes 7

char inData[nbBytes];

SoftwareSerial SerialRN52( rn52_rx, rn52_tx ); // RX, TX


/********* SETUP **********/
void setup() {
	/**
	 * Configure pins
	 */
 	pinMode( rn52evt, INPUT ); // RN-52 Event Register
 
        pinMode( rn52_rx, INPUT );
        pinMode( rn52_tx, OUTPUT );
         
        pinMode( rn52lowbps, OUTPUT );
        digitalWrite( rn52lowbps, LOW );

 	/**
	 * Command monitoring (returns)
	 */
	Serial.begin( 9600 );
        SerialRN52.begin( 9600 );
}

/********* LOOP **********/
void loop() {
  
  /***************
   * COMMAND MODE (ON)
   */
  pinMode( rn52cmd, INPUT );
  Serial.print( "\r\n_________ RN-52 cmd ON _________ \r\n\r\n" );
  
  Serial.print( ">> RN-52 data >> \r\n\r\n" );
  if( SerialRN52.available() > 0 ) {
    
    // Serial sent by the RN52 module
    for( byte i = 0; i < nbBytes; i++ ) {
        inData[i] = SerialRN52.read();
    }
      
    inData[nbBytes] = '\0';
    
    Serial.print( inData );
//       Serial.println( SerialRN52.read() );
  
  } else
    Serial.print( "(aucune donnée reçue)" );
  Serial.print( "\r\n\r\n>> RN-52 data >> \r\n" );
  
  delay( 1000 );  
  
  /***************
   * COMMAND MODE (OFF)
   */
  pinMode( rn52cmd, OUTPUT );
  digitalWrite( rn52cmd, LOW );
  Serial.print( "\r\n_________ RN-52 cmd OFF _________ \r\n\r\n" );
  
  Serial.print( ">> RN-52 data >> \r\n\r\n" );
  if( SerialRN52.available() > 0 ) {
    
    // Serial sent by the RN52 module
    for( byte i = 0; i < nbBytes; i++ ) {
        inData[i] = SerialRN52.read();
    }
      
    inData[nbBytes] = '\0';
      
    Serial.print( inData );
//       Serial.println( SerialRN52.read() );
  
  } else
    Serial.print( "(aucune donnée reçue)" );
  Serial.print( "\r\n\r\n>> RN-52 data >> \r\n" );
  
  delay( 500 );
	
}
