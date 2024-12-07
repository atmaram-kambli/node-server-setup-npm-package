# Node Server Setup

## Overview

`node-server-setup` is a robust npm package that provides a quick and comprehensive boilerplate for Node.js server development. It offers a pre-configured server structure with integrated user management API, allowing developers to jumpstart their backend projects with minimal setup.

## Features

- Instant Node.js server structure generation
- Pre-configured user management API 
- Secure JWT authentication mechanism
- Modular and extensible architecture

### Technical Architecture
- Express.js backend framework
- MongoDB database integration
- JSON Web Token (JWT) authentication
- Bcrypt password security
- Cloudinary image upload support
- Environment-based configuration management


## Installation

### Prerequisites

- Node.js (v18.0.0 or higher recommended)
- npm (Node Package Manager)

### Global Installation
Install the package globally using npm:

```bash
npm install -g node-server-setup
```

## Usage

### Creating a New Project

To create a new Node.js server project, run:

```bash
create-node-server
```

This command will:
- create a new project directory 'server'
- set up the complete server structure

#### Install Dependencies

After creating the project, navigate to the server directory and install the required dependencies:

```bash
cd server
npm install
```

This will install all the necessary packages defined in the project's package.json, including:

- Express.js
- Mongoose
- JSON Web Token (JWT)
- Bcrypt
- Multer
- Resend
- and other project-specific dependencies

### Project Structure

```
my-project/
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── utils/
├── .env
├── package.json
└── index.js
```

## Available User Management Endpoints

### Authentication Routes

| Endpoint                   | Method | Description                    | Authentication Required |
|----------------------------|--------|--------------------------------|-------------------------|
| `/register`                | POST   | User Registration              | No                      |
| `/verify-email`            | POST   | Email Verification             | No                      |
| `/login`                   | POST   | User Login                     | No                      |
| `/logout`                  | GET    | User Logout                    | Yes                     |
| `/refresh-token`           | POST   | Obtain New Access Token        | No                      |

### User Management Routes

| Endpoint                   | Method | Description                    | Authentication Required |
|----------------------------|--------|--------------------------------|-------------------------|
| `/update-user`             | PUT    | Update User Details            | Yes                     |
| `/upload-avatar`           | PUT    | Upload User Avatar             | Yes                     |
| `/user-details`            | GET    | Retrieve User Details          | Yes                     |

### Password Management Routes

| Endpoint                   | Method | Description                    | Authentication Required |
|----------------------------|--------|--------------------------------|-------------------------|
| `/forgot-password`         | PUT    | Initiate Password Recovery     | No                      |
| `/verify-forgot-password-otp` | PUT | Verify Password Reset OTP      | No                      |
| `/reset-password`          | PUT    | Reset User Password            | No                      |

## Environment Configuration

Set the '.env' file with values for following variables:

```
FRONTEND_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/your_database

SECRET_KEY_ACCESS_TOKEN=random-access-token-secret-key
SECRET_KEY_REFRESH_TOKEN=random-refresh-token-secret-key

RESEND_API=your-resend-api-key

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET_KEY=your_cloudinary_api_secret

```

## Security Features

- JWT-based authentication
- Password hashing
- Email verification
- OTP-based password reset
- File upload middleware
- Authentication middleware

## Customization

The generated project structure is designed to be easily extensible. You can:
- Add new routes in `server/routes/`
- Implement additional controllers in `server/controllers/`
- Create new middleware in `server/middlewares/`
- Extend models in `server/models/`

## Contributing

Contributions are welcome! Please submit pull requests or open issues on the GitHub repository.

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## Support

For issues or questions, please file an issue on the GitHub repository.