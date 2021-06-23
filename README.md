## Shorten URL service with AWS serverless
This is the service for URL shorten and redirection.

## Run
It supports three RESTful methods - POST, GET, and DELETE
```
# POST request for shortening URL
curl -X POST -H "Content-Type:application/json" https://api.awstiny.com/modify -d '{"url": "https://www.google.com", "expireAt": "2030-02-08 09:20:41" }'

# Response
{"id":"kq9xyuf2","shorUrl":"https://api.awstiny.com/t/kq9xyuf2"}

# GET request for this new shortened URL
 curl -L -X GET https://api.awstiny.com/t/kq9xyuf2

# Response (redirect to google.com)
<!doctype html><html itemscope="" itemtype="http://schema.org/WebPage" lang="en-IE"><head> .....

# DELETE request for this new shorten URL
curl -X DELETE https://api.awstiny.com/modify/kq9xyuf2

#Response
{"statusCode":200,"headers":{"Content-Type":"application/json"},"body":"\"Successfully delete the id - kq9xyuf2\""}

# Try to GET this deleted URL again
{"statusCode":404,"headers":{"Content-Type":"application/json"},"body":"{\"message\":\"Failed to redirect to the kq9xyuf2. The root causes can be: 1. The Url does not yet be registered in this service 2. The Url has been expired 3. The Url has been deleted\"}"}

```


## Build and Deploy
For how to build and deploy, please refer the document I attached in the link provided by HR.

## Unit Test 
The unit test engine is Jest 26.0.14. Please run the command:
```
npm run test
```

## End to end test (system test)
The execution file for system test is shorten_url/tests/end_to_end/system_test.sh
Please run the command in Linux/Unix environment:
```
./system_test.sh
```