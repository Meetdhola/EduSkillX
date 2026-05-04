# User API Documentation

## User Registration

### Endpoint
```
POST /user/register
```

### Description
Register a new user in the system. This endpoint creates a new user account with the provided information and returns a JWT token for authentication.

### Request Body
```json
{
    "Fullname": {
        "firstname": "string",
        "lastname": "string"
    },
    "email": "string",
    "password": "string"
}
```

### Validation Rules
- **First Name**:
  - Required
  - Minimum length: 3 characters
  - Must be a string

- **Last Name**:
  - Required
  - Minimum length: 3 characters
  - Must be a string

- **Email**:
  - Required
  - Must be a valid email format
  - Must be unique in the system

- **Password**:
  - Required
  - Minimum length: 6 characters
  - Will be hashed before storage

### Response

#### Success Response (201 Created)
```json
{
    "user": {
        "_id": "string",
        "Fullname": {
            "firstname": "string",
            "lastname": "string"
        },
        "email": "string",
        "socketId": "string"
    },
    "token": "string"
}
```

#### Error Response (400 Bad Request)
```json
{
    "errors": [
        {
            "msg": "string",
            "param": "string",
            "location": "string"
        }
    ]
}
```

### Example Request
```json
{
    "Fullname": {
        "firstname": "John",
        "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "password": "password123"
}
```

### Example Success Response
```json
{
    "user": {
        "_id": "65f2e8b7c261e8b7c261e8b7",
        "Fullname": {
            "firstname": "John",
            "lastname": "Doe"
        },
        "email": "john.doe@example.com",
        "socketId": null
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Notes
- The password is hashed using bcrypt before being stored in the database
- The response includes a JWT token that can be used for subsequent authenticated requests
- The user's password is not included in the response for security reasons

## User Login

### Endpoint
```
POST /user/login
```

### Description
Authenticate a user and return a JWT token for subsequent authenticated requests.

### Request Body
```json
{
    "email": "string",
    "password": "string"
}
```

### Validation Rules
- **Email**:
  - Required
  - Must be a valid email format

- **Password**:
  - Required
  - Minimum length: 6 characters

### Response

#### Success Response (200 OK)
```json
{
    "user": {
        "_id": "string",
        "Fullname": {
            "firstname": "string",
            "lastname": "string"
        },
        "email": "string",
        "socketId": "string"
    },
    "token": "string"
}
```

#### Error Response (400 Bad Request)
```json
{
    "errors": [
        {
            "msg": "string",
            "param": "string",
            "location": "string"
        }
    ]
}
```

#### Error Response (401 Unauthorized)
```json
{
    "message": "Invalid email or password"
}
```

### Example Request
```json
{
    "email": "john.doe@example.com",
    "password": "password123"
}
```

### Example Success Response
```json
{
    "user": {
        "_id": "65f2e8b7c261e8b7c261e8b7",
        "Fullname": {
            "firstname": "John",
            "lastname": "Doe"
        },
        "email": "john.doe@example.com",
        "socketId": null
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Notes
- The endpoint verifies the user's credentials against the hashed password in the database
- A JWT token is returned upon successful authentication
- The user's password is not included in the response for security reasons
- The same error message is returned for both invalid email and password to prevent user enumeration 