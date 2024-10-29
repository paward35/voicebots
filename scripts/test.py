import boto3

lex_client = boto3.client('lexv2-models')
s3_client = boto3.client('s3')

# Define file and bucket details
file_path = 'bots/outbound/test.csv'
bucket_name = 'ml-data-02'
s3_key = 'lex/outbound/test.csv'  # The key (path) where the file will be stored in S3

# Upload file
try:
    s3_client.upload_file(file_path, bucket_name, s3_key)
    print(f"File uploaded successfully to s3://{bucket_name}/{s3_key}")
except Exception as e:
    print(f"An error occurred: {e}")

response = lex_client.start_test_set_generation(
    testSetName='test_new_example',
    storageLocation={
        's3BucketName': bucket_name,
        's3Path': "gen/" + s3_key,
    },
    generationDataSource={
        'conversationLogsDataSource': {
            'botId': 'string',
            'botAliasId': 'string',
            'localeId': 'string',
        }
    },
    roleArn='string',
    testSetTags={
        'string': 'string'
    }
)

print(response)