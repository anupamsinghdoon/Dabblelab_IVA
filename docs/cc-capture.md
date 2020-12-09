# Credit Card Capture

To avoid TTS issues, DTMF will be used to capture credit card numbers. The following is an example [collect action](#) that illustrates the general approach.

```json
{
	"actions": [
		{
			"collect": {
				"name": "collect_cc",
				"questions": [
					{
						"confirm": {
							"on_confirm": {
								"say": "Perfect. Let's continue."
							},
							"max_attempts": {
								"redirect": "task://fallback",
								"num_attempts": 2
							},
							"messages": [
								{
									"say": "I heard <say-as interpret-as='digits'>{credit_card_number}</say-as>. Is that correct?"
								}
							],
							"on_reject": {
								"messages": [
									{
										"say": "I'm sorry, let's try again. What is your credit card number?"
									},
									{
										"say": "My bad, can you tell me again. What is your credit card number?"
									}
								]
							}
						},
						"question": "Please say or use your telephone keypad to provide credit card number.",
						"voice_digits": {
							"finish_on_key": "#",
							"num_digits": 16
						},
						"name": "credit_card_number",
						"type": "CREDIT_CARD_NUMBER"
					}
				],
				"on_complete": {
					"redirect": "task://capture_cc_confirm"
				}
			}
		}
	]
}
```