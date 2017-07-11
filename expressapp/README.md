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

This will add the user to a DynamoDB table, UserDetailsDev on Amazon Web Services 

The application is designed to add users who exist in the DynamoDB table but aren't in the Cognito user pool to the pool enabling them to have a password 

2. Changing users password 

On the change password page of the express server, you can simulate a user's change of password, a random user will be chosen and there password changed by the application executing the change-password Cognito command 

For future development, the application could have a front end in which the user enters their choice of new password as well as their previous password. 

3. Resetting users password 

This action is carried out in a similar way to changing password, by selecting the 'forgot password' page, the application will email an arbitrary user an authentication code, after this the user can enter the AWS command: aws cognito-idp confirm-forgot-password --client-id <client ID from user pool> --confirmation-code <6-digit confirmation code in e-mail>  --password <new_password> --username <username>
