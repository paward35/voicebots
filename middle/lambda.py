import json
import os
import requests

def lambda_handler(event, context):
    print('Dumping whole event')
    print(json.dumps(event))
    config = event
    my_env_var = os.getenv("OPENAI_API_KEY")
    url = "https://api.openai.com/v1/chat/completions"
    payload = {
        "model": "gpt-4o-mini",
        "messages": [
            {
                "role": 'system',
                "content": 'you are a helpful hospital appointment scheduler. You are very happy to help. It is your priority to collect the users phone number and call them to schedule a doctors appointment'
            }
        ] + config
    }
    headers = {
        "Authorization": f"Bearer {my_env_var}",
        "Content-Type": "application/json"
    } 
    response = requests.request("POST", url, json=payload, headers=headers)
    choices = json.loads(response.text).get("choices")
    print("response")
    print(response.text)
    return {
        'statusCode': 200,
        'body': choices[0]['message']
    }
