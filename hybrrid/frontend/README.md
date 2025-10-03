# Frontend Deployment (Static Hosting on S3/CloudFront)

## Configure API URL
- Set `NEXT_PUBLIC_API_URL` at build time to your backend URL (e.g., `https://api.example.com`).
  - Example build: `NEXT_PUBLIC_API_URL=https://api.example.com npm run build && npm run export`

## Build and Export
- Install deps and build:
```
npm install
npm run build
npm run export
```
- Output static site in `out/`.

## Upload to S3
- Upload the contents of `out/` to your S3 bucket (static website hosting enabled).
- If using CloudFront, set S3 bucket as origin and enable default root object `index.html`.

## Notes
- Ensure CORS on backend allows your site origin.
- Use HTTPS URLs for production.
