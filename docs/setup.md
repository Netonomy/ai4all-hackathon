# Setting up Netonomy

###📜 Requirements

1. [Docker](https://docs.docker.com/get-docker/)
2. Open AI API Key
3. LND node (see [voltage](https://voltage.cloud/) for quick setup)

###🏃‍♂️ How to run

1. Make sure you have cloned the repo

```
git clone https://github.com/Netonomy/netonomy.git
cd netonomy
```

2. Fill out env variables for the server

- Create .env.local file and fill in
  LND_MACAROON
  OPENAI_API_KEY
  SERPAPI_API_KEY
- Update LND_ENDPOINT in .env.development

3. Fill out env variables for the next js app
