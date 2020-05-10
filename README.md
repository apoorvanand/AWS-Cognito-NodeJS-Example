## Express JS API Example

#### Required
- Node >= 13.*
- npm >= 6.*
- PostgreSQL / MySql

#### Installation steps
- Take clone 
- Install PostgreSQL/MySql database(Used PostgreSQL in example)
- First run `npm install` command
- Create copy of `env.example` file with `.env` name
- Set credential in `.env` file
- run migration `npx sequelize-cli db:migrate`
- run seeder `npx sequelize-cli db:seed:all`
- Run project 'npm start'

#### Details of the example
- Used `sequelize` ORM.
- User `json web token` for authentication.
- User can login or registration by using APIs.
- User modify our details after login(With JWT token).

#### List of APIs
- Authentication APIs(Token is not required)
    - Registration
    - Login
    
- Users APIs(Token is required)
    - Get User
    - Update User
    - Delete User


NOTE: Postman collection and database in `documents` folder.