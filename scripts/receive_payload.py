import json
import urllib.parse
import urllib.request
import boto3
import csv
import os



def lambda_handler(event, context):
    print("Starting Handler Function")
    
    # Extract image URL from the IoT Core payload
    image_url = event['image_url']

    # Encode the image URL to handle spaces and other special characters
    print("Encoding the image url", image_url)
    encoded_image_url = urllib.parse.quote(image_url, safe=':/')
    
    # print("encoded image URL: ", encoded_image_url)
    
    # Open and read the image file directly
    # print("Opening the requested URL with urllib.request.urlopen")
    with urllib.request.urlopen(encoded_image_url) as response:
        image_data = response.read()
    
    # print("Image Data Length: ", len(image_data))
    
    # Send image data to SageMaker endpoint for inference
    print("Creating Sagemaker client and invoking the endpoint passing the image data")
    
    sagemaker_client = boto3.client('sagemaker-runtime')
    
    response = sagemaker_client.invoke_endpoint(
        EndpointName='pest-clf-ib-resent-2024-02-17-15-45-03',
        Body=image_data,
        ContentType='image/jpeg'
    )
    
   
        
    # Extract inference results from the SageMaker response
    print("Extracting Sagemaker Inference")
    inference_results = json.loads(response['Body'].read().decode('utf-8'))
    
    print(inference_results)
    
    #Label list
    label = {"crow": 0, "pigeon": 1, "rabbit": 2, "rat": 3, "sparrow": 4, "squirrel": 5}
        
    # Create a dictionary using zip() to combine keys and values
    mapped_dict = dict(zip(label.values(), label.keys()))
        
    # Key with the highest prediction value
    max_inference = max(inference_results)
    
    predicted_result = str(max_inference)
    

    max_key = mapped_dict[inference_results.index(max_inference)]
    print(f"The image is: {max_key}")
    
    # Determine alarm signal based on max_key
    if max_key in ['crow', 'sparrow']:
        alarm_signal = 'SOUND'
    elif max_key in ['rabbit', 'rat']:
        alarm_signal = 'LIGHT'
    else:
        # Other possibilities
        alarm_signal = 'WATER'
    
    # Sending Email Notification to user
    sns_topic_arn = 'arn:aws:sns:us-east-1:381492146542:scarecrow-farm-topic'
    sns_client = boto3.client('sns') 
    
    message = f"""
        A {max_key} has been detected by the security system.
        This has triggered an alarm, and the response is {alarm_signal}.
        Please investigate promptly to ensure the safety and security of the area.
    """

    sns_client.publish(
        TopicArn=sns_topic_arn, 
        Message=message, 
        Subject='Scarecrow Alarm Notification'
        )
  
  
    # Extract the two dictionary contents from farm_pair
    farm_id = event['farm_pair']['farm_id']
    farm_name = event['farm_pair']['farm_name']
    
    # Store the complete payload in DynamoDB
    dynamodb_client = boto3.client('dynamodb')
    table_name = 'scaretests'
    dynamodb_client.put_item(
        TableName=table_name,
        Item={
            'farmID': {'S': farm_id},
            'farm_name': {'S': farm_name},
            'datetime': {'S': event['timestamp']},
            'Identified_pest' : {'S': max_key}, 
            'prediction': {'S': predicted_result}, 
            'signal': {'S': alarm_signal}
        }
    )
    

    response_payload = {
    'message': 'Processing complete!',
    'farm_id': farm_id,
    'farm_name': farm_name,
    'prediction': predicted_result,
    'alarm_signal': alarm_signal
}


    # Return response status
    return {
        'statusCode': 200,
        'body': json.dumps(response_payload)
    }