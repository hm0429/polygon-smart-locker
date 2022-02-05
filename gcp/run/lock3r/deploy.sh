gcloud builds submit --project lock3r --tag gcr.io/lock3r/alpha
gcloud beta run deploy --image gcr.io/lock3r/alpha --platform managed