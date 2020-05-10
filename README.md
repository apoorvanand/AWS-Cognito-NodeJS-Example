## AWS Congnito NodeJS Example 

#### Required
- Node >= 13.*
- npm >= 6.*

#### Installation steps
- Take clone 
- First run `npm install` command
- Create copy of `env.example` file with `.env` name
- Set credential in `.env` file
- Run project 'npm start'

#### Details of the example
The repository provides AWS Cognito example with signUp, signIn and token verification APIs.

#### List of APIs
- SignUp (POST: http://localhost:3000/api/v1/signUp)
  - Required Parameters: 
    - username
    - password
    - email
    - phone_number
    - name
  
- signIn (POST: http://localhost:3000/api/v1/signIn)
  - Required Parameters: 
    - username
    - password
   
- Token Verify (POST: http://localhost:3000/api/v1/user/verify)
  - Required Parameters: 
    - token
    
- Update User (POST: http://localhost:3000/api/v1/user/update)
  - Required Parameters: 
    - username
    - password
    - email
    - phone_number
    - name
    
- Delete User (POST: http://localhost:3000/api/v1/user/delete)
  - Required Parameters: 
    - username
    - refreshToken
