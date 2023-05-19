# Application
Rate Limitter application for company X.

## Deployment
The server is hosted here https://xyzlimitter.onrender.com, please give a few minutes for the server to load after first request.

## Functionality
The system is designed to solve these three issues:
1. Too many requests within the same time window from a client
2. Too many requests from a specific client on a per month basis
3. Too many requests across the entire system

## setup application 
1. clone the repo 
2. add .env  file and add environmeent variables as shown in .env.example
3. in the terminal run `` yarn install``
4. To run the server  run `` yarn start``



## Routes
`/` home route
`/clientpay` route for client to upgrade 
it  allow the client to bypass the throttling middleware by paying for more requests per second
`/soft`/ use this endpoint to test soft throttling 
it is used to test soft throttling middleware wait for one minute the request should go through
`/hard`/ use this endpoint  to test hard throttling 
it is used to test hard throttling middleware it rejects the system if the maximum requests is reached

 the limit variables are  hard coded in minutes for testing purposed , you may adjust it depending on the limit you need 

 ### Requests Limits
LIMIT_PER_MIN = 2;
SYSTEM_LIMIT_PER_MIN = 10; 
LIMIT_PER_MONTH = 5;

SOFT_LIMIT_DELAY_MS = 60000; // in millseconds

## Request payload
Each request needs a client_id in the header

