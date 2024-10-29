import boto3
import os 

# Explicitly specify credentials
aws_access_key_id = os.getenv("AWS_ACCESS_KEY_ID")
aws_secret_access_key = os.getenv("AWS_SECRET_ACCESS_KEY") 
region_name = "us-east-1"  # Specify your region

# Create an STS client with explicit credentials
client = boto3.client(
    'sts',
    aws_access_key_id=aws_access_key_id,
    aws_secret_access_key=aws_secret_access_key,
    region_name=region_name
)

# Test the credentials by getting caller identity
try:
    response = client.get_caller_identity()
    print("AWS Configuration is valid.")
    print("User ID:", response['UserId'])
    print("Account:", response['Account'])
    print("ARN:", response['Arn'])
except Exception as e:
    print("An error occurred:", str(e))
