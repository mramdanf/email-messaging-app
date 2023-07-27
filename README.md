Hi, [Ramdan](https://www.linkedin.com/in/mohamad-ramdan-firdaus-25a24381/) here, this is simple application to send a happy birthday message to users on their birthday at exactly 9 am on their local times. This app is a task for coding test at surya digital teknologi

## What I have accomplished
### Created a scheduler to send birth day message
Scheduler will running every hour and get users list to check if there are users need to be send a birthday message. Next scheduler will only running if previous scheduler finished the job, this will prevent race condition.

### Created a scheduler to re-send unsuccessfull messages
Scheduler will running every hour and get list of messages that failed to be sent, try re-send the message and update the message status to success if it's successfully sent.

### Create simple API for user management
POST /user to create new user, DELETE /user to delete a user and PUT /user to update user. API doc can be found at [localhost:3000/api-docs/](http://localhost:3000/api-docs/)

### Created simple email service
POST /send-mail to mimic sending email service, POST /send-mail will return 10% error 500 and 10% server timeout. API doc can be found at [localhost:3001/api-docs/](http://localhost:3001/api-docs/)

### Abstracted code as possible
Isolate and make code as modular as possible so it will be easy for unit testing

### Most of the functions are tested
Implemented testable code, most of the funcions is tested. Resulting in code coverage for statements 96% for `database-service` and 90% for `email-service` excluded file that have less to no logic and library generated files.

### Dockerize the application
Implemented simple microservice architechture for scalability and consistency when deploying the sistem

### Added eslint and prettier
Added these two library to support consistencies on code writing

## Requirement to run the app
1. [Docker Desktop](https://www.docker.com/products/docker-desktop)
2. [Docker Compose](https://docs.docker.com/compose/install/)

## How to run the app
- clone this repo
- cd to `email-messaging-app`
- create `.env` file, can clone `.env.example` 
- run `docker-compose up --build -d`
- application will be available in [localhost:3000/api-docs/](http://localhost:3000/api-docs/) and [localhost:3001/api-docs/](http://localhost:3001/api-docs/)

## Verifying send birthday message behaviour
I have a users seeder that will populate `users` table with fake data and set their birthday month and date to today month and date (Asia/Jakarta). We need to set `SENT_BIRTHDAY_AT_HOUR` current hour, after that the scheduler should send the message to every user

### Verifying message log
When scheduler start sending message the log will be available in `sendMessagesStatus` table, we can check with below query
```
SELECT 
	u.id, u.firstName, log.userId, 
	log.messageId, log.sentStatus, log.sentTime,
	log.descriptions
FROM users as u
INNER JOIN sendingMessagesStatus as log
	ON u.id = log.userId
```

### Verifying duplicate message
To check if any duplicate message was sent we can use below query to see if there is more than one message is sent to the same user.
```
SELECT 
	userId,
	COUNT(userId) as totalUser
FROM sendingMessagesStatus as log
GROUP BY userId
HAVING count(userId) > 1;
```

### Verifying scheduler to resend message
To check if scheduler able to resend failure message we can regulary check the message log table (`sendMessagesStatus`) and see the `sentStatus` colum at some point there will be no more message with `sentStatus` = `error`.
```
SELECT 
	u.id, u.firstName, log.userId, 
	log.messageId, log.sentStatus, log.sentTime,
	log.descriptions
FROM users as u
INNER JOIN sendingMessagesStatus as log
	ON u.id = log.userId
```

## Verifying the users and email service endpoint
Please go the api docs for more detail, [users endpoint api docs](http://localhost:3000/api-docs/), [email service endpoint api docs](http://localhost:3001/api-docs/)





