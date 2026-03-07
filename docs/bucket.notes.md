# CORS

[comment]: <> (file is located at "apps/server/bucket.cors.json")
```
{
  "CORSRules": [
    {
      "AllowedOrigins": ["allowedUrl"],
      "AllowedMethods": ["GET", "PUT", "HEAD"],
      "AllowedHeaders": ["*"],
      "ExposeHeaders": ["ETag", "Content-Length", "Content-Type"],
      "MaxAgeSeconds": 3000
    }
  ]
}

```
```
aws s3api put-bucket-cors \
  --bucket files-bucket \
  --cors-configuration file://bucket.cors.json \
  --endpoint-url https://s3.nl-ams.scw.cloud \
  --region nl-ams
```
