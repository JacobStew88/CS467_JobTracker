# FRONTEND & BACKEND DEPLOYMENT

cd into project directory

## install dependanices 
`npm install`

## run development build
`npm run dev`

## run tests
Note: You need to change env to match port and url for test prod or dev

`install newman and cd into tests`

`newman run job_tracker_full_test_suite_v3.postman_collection.json -e job_tracker_local.postman_environment.json`

## Create .env file
- PORT = YOURPORTOFCHOICE
- DATABASE_URL = LOCALDBURL
- JWT_SECRET = SECERETOFCHOICE
