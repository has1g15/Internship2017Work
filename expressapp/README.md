This simple express application allows users to be created and added to an Amazon Cognito user pool, users' passwords to be changed as well as reset in the case they have forgotten them.
Before you being you will need:
- An Amazon Web Services (AWS) account, you can make a free account if you don't already have one.
- The aws command line to perform certain operations.
- A rest client, we are using Postman.
For setting up the express server, we will provide instructions to (1) Create a DynamoDB table, (2) Create an API and (3) Create a Cognito user pool.

(1) Creating a DynamoDB table

First, go to DynamoDB on AWS and set up a database of users. Click "DynamoDB" or simply type it into the search bar.

![ddb screenshot](https://user-images.githubusercontent.com/9966869/28771845-33c5acec-75dc-11e7-8aab-2567c49b9283.png)

Then, click "Create Table" to create the database.

![ddb createtable](https://user-images.githubusercontent.com/9966869/28771941-84e283ca-75dc-11e7-9fce-4abd016d12ab.png)

Give the table an appropriate name and specify a Primary Key, a unique identifier for each item. Then press create table.

![ddb creating table](https://user-images.githubusercontent.com/9966869/28782956-b6900512-7606-11e7-9428-0dfb3c9165f5.png)

If you click on the Items tab you can view the information about the table.

![ddb view info](https://user-images.githubusercontent.com/9966869/28784863-8bd7ff2c-760c-11e7-9cbd-63ae7137e190.png)

(2) Creating an API

To create an API we will first need to make a lambda function. To do this, go to the AWS homepage and type "Lambda" into the search bar.
Once you're there, select "Create lambda function".

![api create lambda](https://user-images.githubusercontent.com/9966869/28820677-6d7cf084-76aa-11e7-9bca-19e723e129fc.png)

Then choose the "simple-mobile-backend" blueprint, you can filter the blueprints by typing in the text box at the top.

![api select blueprint](https://user-images.githubusercontent.com/9966869/28819884-7ff07928-76a7-11e7-859f-c764bf22dc38.png)

Give a name to your Lambda function and leave the settings as default as shown in the image below.

![api configure function](https://user-images.githubusercontent.com/9966869/28820164-9743fd24-76a8-11e7-8d7f-08de2288392d.png)

For Role, select "Create new role from template(s)" and give it a name. Change the timeout to 10 seconds and leave everything else as default as shown in the image below. Then click "Create function".

![api lambda role](https://user-images.githubusercontent.com/9966869/28820496-c4fce1f8-76a9-11e7-9dc9-69f432a24f4f.png)

Now navigate to Amazon API Gateway from the AWS homepage by clicking the icon or simply typing "API" into the search bar.
Then click "Create API".

![api create api](https://user-images.githubusercontent.com/9966869/28819050-d8a5a65e-76a4-11e7-8ee2-1f72099ba8f2.png)

Select "New API" and give your API a name, then you can create your API.

![api creating api](https://user-images.githubusercontent.com/9966869/28819339-d78e6f02-76a5-11e7-8c88-e1cde5258ec1.png)

Go to "Actions" and select "Create new resource". Give your resource a name and tick the "Enable API Gateway CORS" box. Then click "Create Resource".

![api new resource](https://user-images.githubusercontent.com/9966869/28819504-60279e92-76a6-11e7-811f-e971c0a29944.png)

Go to "Actions" again and choose "Create method", then select "POST" under Options.

![api userdao method](https://user-images.githubusercontent.com/9966869/28819656-d6cd9e66-76a6-11e7-9bfb-a1c9a3e1a0aa.png)

Select your region for lambda region and select your lambda function. Then click "Create API".

![api lambda function](https://user-images.githubusercontent.com/9966869/28820734-a70de678-76aa-11e7-8922-7d5ae8953abb.png)

Then go to Options and select "Deploy API".

![api deploy api](https://user-images.githubusercontent.com/9966869/28820834-05348f2c-76ab-11e7-958e-8c6999095117.png)

Select "new stage" and call it dev for development. Then press "Deploy", this will take a little while to complete.

![api deploying api](https://user-images.githubusercontent.com/9966869/28820857-1b06c0b8-76ab-11e7-9ba5-e792762d6222.png)

On the left hand side, select "Stages" and then select "dev", select your API and select "POST". Copy the link called "Invoke URL".

![api url](https://user-images.githubusercontent.com/9966869/28821468-725f925c-76ad-11e7-917e-329786ed4da4.png)

(3) Creating a Cognito user pool

Next, go to Cognito from the Amazon Web Services homepage by clicking on the icon or simply typing "Cognito" into the search bar.

![cognito screenshot](https://user-images.githubusercontent.com/9966869/28772512-5cdbb66a-75de-11e7-94c8-77adb260aba9.png)

Click on "Manage your User Pools", then click "Create User Pool".

![cognito manage pools](https://user-images.githubusercontent.com/9966869/28772654-aeb3407a-75de-11e7-9832-41cf996ab8da.png)

Give a name to your user pool and when prompted click "Step through settings"

![cognito step settings](https://user-images.githubusercontent.com/9966869/28772796-2b3da2c0-75df-11e7-8691-c0be800b74d5.png)

Choose the standard attributes, email is recommended, and choose the password strength, amazon recommends a minimum length of 8 characters.
Then select if users can sign themselves up and specify how long until an unconfirmed account expires.
On the next page, leave all the settings as default and click "Create Role".

Personalise your verification messages as you wish.

![cognito personalise message](https://user-images.githubusercontent.com/9966869/28774920-721eee30-75e7-11e7-8ff1-ab8ff3e2302d.png)

Add a tag to your user pool.

![cognito tag](https://user-images.githubusercontent.com/9966869/28775172-82b225d6-75e8-11e7-8249-5e5921763bbc.png)

Now you can create your application.

![cognito create app](https://user-images.githubusercontent.com/9966869/28775306-1fe7437c-75e9-11e7-96ec-e0282ddc1469.png)

Click "Create Pool" and you are done!


1. Creating users

Initially users can be added via a rest client by providing an API gateway URL, and JSON data for payload, for example:

{
  "operation": "create",
  "payload": {
      "TableName": "UserDetailsDev",
      "Item": {
          "Username": "exampleUser",
          "Email": "exampleUser@mailinator.com",
          "Mobile": "07111111111",
          "Course": "BScCompSci"
      }
  }
}

This will add the user to a DynamoDB table "UserDetailsDev" on Amazon Web Services 

The application is designed to add users to the Cognito user pool if they exist in the DynamoDB table but aren't yet in the user pool, enabling them to have a password 

2. Changing a user's password 

On the change password page of the express server, you can simulate a user's change of password - a random user will be chosen and their password changed by the application which executes the change-password Cognito command.

For future development, the application could have a front end in which the user enters their choice of new password as well as their previous password. 

3. Resetting a user's password 

This action is carried out in a similar way to changing password, the application randomly changes a user's password.

For future development, the application would have a front end in which a user could input their username and the application would execute the forgot-password Cognito command. The user would receive an email with an authentication code to put into the front end and then reset their password from there.

4. Authentication via a token

At the moment, if you go onto a rest client (we are using Postman), go to the URL https://localhost:3000/login and type in the header a valid username and password then Send a GET request, you will receive an access token and refresh token. If you then go to the URL https://localhost:3000/test and type in "Authorisation" for the key in the header, then "JWT " followed by the access token, you will receive a message that says "Success". You will not receive this message if an invalid access token is used.
Similarly, if you go to https://localhost:3000/token and type in "name" as a key in the body followed by an accepted username, as well as "refreshToken" with the refresh token then you will receive a new access token. You will not receive the access token if an invalid refresh token or name is used.
