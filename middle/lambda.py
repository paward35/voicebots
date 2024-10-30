import json
import os
import requests

def lambda_handler(event, context):
    print(json.dumps(event))
    print('test')
    config = event
    my_env_var = os.getenv("OPENAI_API_KEY")
    url = "https://api.openai.com/v1/chat/completions"
    payload = {
        "model": "gpt-4o-mini",
        "messages": [
            {
                "role": "system",
                "content": config["system"]["content"]
            },
            {
                "role": "user",
                "content": config["user"]["content"]
            }
        ]
    }
    headers = {
        "Authorization": f"Bearer {my_env_var}",
        "Content-Type": "application/json"
    } 
    response = requests.request("POST", url, json=payload, headers=headers)
    choices = json.loads(response.text).get("choices")
    return {
        'statusCode': 200,
        'body': choices[0]['message']
    }
