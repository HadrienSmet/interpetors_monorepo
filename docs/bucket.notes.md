# CORS

## Example of CORS config
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
## In order to update CORS policies of the S3 compatible bucket:
- Move to "apps/server/"
- And run:
PRD:
```
aws s3api put-bucket-cors \
  --bucket files-bucket \
  --cors-configuration file://bucket.cors.json \
  --endpoint-url https://s3.nl-ams.scw.cloud \
  --region nl-ams
```
DEV/STG:
```
aws s3api put-bucket-cors \
  --bucket dev-files-bucket \
  --cors-configuration file://dev.bucket.cors.json \
  --endpoint-url https://s3.nl-ams.scw.cloud \
  --region nl-ams
```
