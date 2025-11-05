## CORS
```
{
  "CORSRules": [
    {
      "AllowedOrigins": ["http://localhost:5173"],
      "AllowedMethods": ["GET", "PUT", "HEAD"],
      "AllowedHeaders": ["*"],
      "ExposeHeaders": ["ETag"],
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
