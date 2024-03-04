import boto3
import os
import random
import json
from datetime import datetime

s3_bucket_name = "scare-test"
s3_folder_name = "photo_data"
iot_topic_name = "ScarecrowFarmPest"

s3_client = boto3.client('s3')
iot_client = boto3.client('iot-data')

farm_pair = {"farm_id": "223e4567", "farm_name": "Bountiful Farmers Ltd."}

def lambda_handler(event, context):
    # List all objects in the S3 folder
    response = s3_client.list_objects(Bucket=s3_bucket_name, Prefix=s3_folder_name)

    # Filter out only the image files
    image_objects = [obj for obj in response.get('Contents', []) if obj['Key'].lower().endswith(('.jpg', '.jpeg', '.png', '.gif'))]

    if not image_objects:
        print("No images found in the folder.")
        return

    # Choose a random image
    random_image = random.choice(image_objects)
    image_url = f"https://{s3_bucket_name}.s3.amazonaws.com/{random_image['Key']}"

    # Add timestamp to the payload
    current_timestamp = datetime.utcnow().isoformat()

    # Randomly select a farm pair
    # random_farm_pair = random.choice(farm_pairs)

    # Construct the payload
    payload = {
        'timestamp': current_timestamp,
        'image_url': image_url,
        'farm_pair': farm_pair
    }

    # Publish the updated payload to the IoT topic
    iot_client.publish(
        topic=iot_topic_name,
        payload=json.dumps(payload),
        qos=1
    )

    print(f"Image URL with timestamp and farm pair published to {iot_topic_name}: {payload}")

    return {
        'statusCode': 200,
        'body': json.dumps('Image URL with timestamp and farm pair published successfully!')
    }