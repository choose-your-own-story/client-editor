[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](code_of_conduct.md)

# Choose your own story Editor website
This website is the story editor backoffice. It allows the users to create their own stories by adding pages to a book.

## Development Stack
We have used vue2 + vuetify.
For production, we deploy the compiled output through a Nginx server. 

The application has been containerized using docker for local development and for now, the same image is being used in prod in a k8s orchesteor.
The readme assumes the developer has docker-compose installed as well.

## Current Production URL
We are currently hosting the application in private server. Example url:

```shell script
curl --location 'https://story-maker-editor.jrojaspin.com.ar' 
```

# Local Development
1. Create your own .env file
```shell script
cp .env.dist .env
```

2. Run the command 
```shell script
docker-compose up
``` 

# Deployment To prod
While standing in the root directory
```shell script
docker build -t jotaram/story-maker-editor:<x.y.z> --build-arg VUE_APP_PUBLIC_PATH="/" --build-arg BASE_URL="/" --build-arg VUE_APP_API_HOST="https://story-maker-api.jrojaspin.com.ar" --build-arg VUE_APP_GOOGLE_CLIENT_ID=""  .
docker image push jotaram/story-maker-editor:<x.y.z>
```
