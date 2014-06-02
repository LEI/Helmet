#include <SoftwareSerial.h>

int led = 13;
int rx = 0,
    tx = 1,
    
    rn52_rx = 5,
    rn52_tx = 6,

    rn52cmd = 2,
    rn52evtreg = 4;

SoftwareSerial SerialRN52( rn52_rx, rn52_tx ); // RX, TX

/********* FUNCTIONS **********/

/**
 * Enter or leave RN-52 Command Mode
 */
int rn52_commandmode( bool on = false ) {
	if(on) {
		digitalWrite( rn52cmd, LOW );
	} else {
		digitalWrite( rn52cmd, HIGH );
	}
}

/********* MAIN **********/

void setup() {
	pinMode(led, OUTPUT);

	/**
	 * Configure pins
	 */
 	pinMode( rn52cmd, OUTPUT );   // RN-52 Command Mode
 	pinMode( rn52evtreg, INPUT ); // RN-52 Event Register

 	/**
	 * Command monitoring (returns)
	 */
	 Serial.begin( 115200 );
         SerialRN52.begin( 115200 );
}

void loop() {
	// Basic programm (blink)
	digitalWrite( led, HIGH );   // turn the LED on (HIGH is the voltage level)
	delay(1000);               // wait for a second
	digitalWrite( led, LOW );    // turn the LED off by making the voltage LOW
	delay(1000);               // wait for a second

	// Main programm
//	rn52_commandmode( true );
        digitalWrite( rn52cmd, LOW );

        Serial.print( SerialRN52.read() );
       
//	rn52_commandmode( false );
        digitalWrite( rn52cmd, HIGH );

        Serial.print( SerialRN52.read() );
}