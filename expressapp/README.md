This simple express application allows users to be created and added to an Amazon Cognito user pool, users' passwords to be changed as well as reset in the case they have forgotten them.
We are using Amazon Web Services (AWS) for this, so make a free account if you don't already have one. You will also need to install the aws command line to perform certain operations.
For setting this all up, we will provide instructions to (1) Create a DynamoDB table, (2) Create an API and (3) Create a Cognito user pool.

(1) Creating a DynamoDB table

First, go to DynamoDB on AWS and set up a database of users. Click "DynamoDB" or simply type it into the search bar.

![ddb screenshot](https://user-images.githubusercontent.com/9966869/28771845-33c5acec-75dc-11e7-8aab-2567c49b9283.png)

Then, click "Create Table" to create the database.

![ddb createtable](https://user-images.githubusercontent.com/9966869/28771941-84e283ca-75dc-11e7-9fce-4abd016d12ab.png)

Give the table an appropriate name and specify a Primary Key, a unique identifier for each item. Then press create table.

![ddb creating table](https://user-images.githubusercontent.com/9966869/28782956-b6900512-7606-11e7-9428-0dfb3c9165f5.png)

If you click on the Items tab you can view the information about the table.

![ddb view info](https://user-images.githubusercontent.com/9966869/28784863-8bd7ff2c-760c-11e7-9cbd-63ae7137e190.png)


(3) Creating a Cognito user pool

Next, go to Cognito from the Amazon Web Services homepage by clicking on the icon or simply typing "Cognito" into the search bar.

![cognito screenshot](https://user-images.githubusercontent.com/9966869/28772512-5cdbb66a-75de-11e7-94c8-77adb260aba9.png)

Click on "Manage your User Pools", then click "Create User Pool".

![cognito manage pools](https://user-images.githubusercontent.com/9966869/28772654-aeb3407a-75de-11e7-9832-41cf996ab8da.png)

Give a name to your user pool and when prompted click "Step through settings"

![cognito step settings](https://user-images.githubusercontent.com/9966869/28772796-2b3da2c0-75df-11e7-8691-c0be800b74d5.png)

Choose the standard attributes, email is recommended, and choose the password strength, amazon recommends a minimum length of 8. Then select if users can sign themselves up and specify how long until an unconfirmed account expires.
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
