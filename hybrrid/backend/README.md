# Backend Deployment (Elastic Beanstalk)

## Prerequisites
- Node.js runtime platform (Node 18+ recommended)
- MongoDB connection string
- Generated JWT secret

## Environment Variables (Elastic Beanstalk)
Set these in your EB environment configuration (Configuration > Software):
- `MONGO_URI` — e.g. `mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority`
- `JWT_SECRET` — long random string
- `PORT` — `4000` (or leave empty; EB may inject `PORT`)

## Run Command
EB uses the `Procfile`:
```
web: node src/server.js
```

## Notes
- Ensure security groups allow outbound to MongoDB.
- Monitor logs for `MongoDB connected` and `Server running on port ...` messages.
- Health check endpoint: `GET /health`
