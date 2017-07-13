This simple express application allows users to be created and added to an Amazon Cognito user pool, users passwords to be changed as well as reset in the case they have forgotten them. 

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
