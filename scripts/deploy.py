import boto3
import os 
from botocore.exceptions import ClientError
from cfn_tools import load_yaml
import json

# Explicitly specify credentials
aws_access_key_id = os.getenv("AWS_ACCESS_KEY_ID")
aws_secret_access_key = os.getenv("AWS_SECRET_ACCESS_KEY") 
region_name = "us-east-1"  # Specify your region
stack_name = "outbound-caller"

# Create an STS client with explicit credentials
cf_client = boto3.client(
    'cloudformation',
    aws_access_key_id=aws_access_key_id,
    aws_secret_access_key=aws_secret_access_key,
    region_name=region_name
)


def load_template(file_path):
    with open(file_path, 'r') as file:
        template_body = json.dumps(load_yaml(file.read()))
    return template_body


def check_stack_exists():
    try:
        # Check if stack exists by describing it
        cf_client.describe_stacks(StackName=stack_name)
        return True
    except ClientError as e:
        if 'does not exist' in str(e):
            return False
        else:
            # Raise other unexpected errors
            raise e
        

def update_stack(template_body):
    # Stack exists, so update it
    try:
        response = cf_client.update_stack(
            StackName=stack_name,
            TemplateBody=template_body,
            Capabilities=['CAPABILITY_NAMED_IAM']  # Modify based on your requirements
        )
        print(f"Updating stack '{stack_name}'...")
        waiter = cf_client.get_waiter('stack_update_complete')
        waiter.wait(StackName=stack_name)
        print(f"Stack '{stack_name}' updated successfully.")
    except ClientError as e:
        if "No updates are to be performed" in str(e):
            print(f"No updates required for stack '{stack_name}'.")
        else:
            print(f"Failed to update stack '{stack_name}': {e}")


def create_stack(template_body):
    # Stack does not exist, so create it
    try:
        response = cf_client.create_stack(
            StackName=stack_name,
            TemplateBody=template_body,
            Capabilities=['CAPABILITY_NAMED_IAM']  # Modify based on your requirements
        )
        print(f"Creating stack '{stack_name}'...")
        waiter = cf_client.get_waiter('stack_create_complete')
        waiter.wait(StackName=stack_name)
        print(f"Stack '{stack_name}' created successfully.")
    except ClientError as e:
        print(f"Failed to create stack '{stack_name}': {e}")


template_body = load_template('../bots/outbound/config.yaml')


if check_stack_exists():
    update_stack(template_body)
else:
    create_stack(template_body)
