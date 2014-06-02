int led = 13;
int digit_rx = 0,
	digit_tx = 1,
	rn52cmd = 2;

void setup() {
	pinMode(led, OUTPUT);

	/**
	 * Configure pins
	 */
	pinMode(digit_rx, INPUT); // Main data receiving
	pinMode(digit_tx, OUTPUT); // Main data transmitting
 	
 	pinMode(rn52cmd, INPUT);
}

void loop() {
	// Basic programm (blink)
	digitalWrite(led, HIGH);   // turn the LED on (HIGH is the voltage level)
	delay(1000);               // wait for a second
	digitalWrite(led, LOW);    // turn the LED off by making the voltage LOW
	delay(1000);               // wait for a second
}