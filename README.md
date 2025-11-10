# LMS (Learning Management System)

A full-stack web application for managing online courses, built with a modern React frontend and a robust Node.js backend.

## Live Url

https://lmsacademey.netlify.app

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Overview

This project consists of two main components:
- **Client**: A Next.js-based frontend application for users, instructors, and admins
- **Server**: An Express.js backend API server handling authentication, data management, and real-time features

The system provides a complete learning management solution with course creation, enrollment, progress tracking, payments, and more.

## Features

### User Features
- User registration and authentication (email/password, Google OAuth, Facebook Login)
- Course browsing and enrollment
- Video lecture streaming
- Progress tracking
- Shopping cart and wishlist
- Reviews and ratings
- Real-time notifications
- Meeting scheduling
- AI-powered search
- Contact support

### Instructor Features
- Course creation and management
- Lecture upload and organization
- Student progress monitoring
- Announcements
- Schedule management

### Admin Features
- User and course management
- Analytics and reporting
- Payment processing oversight
- System configuration

### Technical Features
- Real-time communication via Socket.io
- File uploads (images, videos)
- Payment integration (Razorpay)
- Email notifications
- Redis caching
- JWT authentication
- Role-based access control

## Tech Stack

### Client
- **Framework**: Next.js 15.4.6
- **Language**: TypeScript
- **UI Library**: React 19.1.0
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit, React Query
- **Authentication**: Google OAuth, Facebook Login
- **Real-time**: Socket.io Client
- **Charts**: Chart.js
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React, Tabler Icons

### Server
- **Runtime**: Node.js
- **Framework**: Express 5.1.0
- **Database**: MongoDB with Mongoose
- **Caching**: Redis
- **Authentication**: JWT
- **File Storage**: Cloudinary
- **Payments**: Razorpay
- **Email**: Nodemailer
- **Real-time**: Socket.io
- **AI**: Google Gemini API
- **Validation**: Joi
- **Documentation**: Swagger

## Project Structure

```
lms/
├── client/                 # Next.js frontend
│   ├── src/
│   │   ├── app/           # Next.js app router
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── store/         # Redux store
│   │   └── lib/           # Utilities
│   ├── public/            # Static assets
│   ├── package.json
│   └── .env               # Client environment variables
├── server/                 # Express backend
│   ├── app/
│   │   ├── config/        # Database, Redis, etc.
│   │   ├── controllers/   # Route handlers
│   │   ├── models/        # MongoDB schemas
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   └── helpers/       # Utility functions
│   ├── uploads/           # File uploads
│   ├── views/             # EJS templates
│   ├── package.json
│   └── .env               # Server environment variables
└── README.md              # This file
```

## Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- Redis
- npm or yarn

### Clone the Repository
```bash
git clone <repository-url>
cd lms
```

### Install Dependencies

#### Client
```bash
cd client
npm install
```

#### Server
```bash
cd ../server
npm install
```

## Environment Setup

### Client (.env)
Create a `.env` file in the `client/` directory with the following variables:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_SOCKET_URL=http://localhost:8000
NEXT_PUBLIC_CLIENT_ID_FOR_GOOLE=your-google-client-id
NEXT_PUBLIC_FACEBOOK_ID=your-facebook-app-id
NEXT_PUBLIC_APP_ID=your-app-id
NEXT_PUBLIC_SERVER_SECRECT=your-server-secret
NEXT_PUBLIC_ZGOCLOUD_URL=http://localhost:3000
```

### Server (.env)
Create a `.env` file in the `server/` directory with the following variables:

```env
MONGODB_URL=mongodb://localhost:27017/lms
PORT=8000
REDIS_URL=redis://localhost:6379
CLIENT_URL=http://localhost:3000
CLIENT_URL_ADMIN=http://localhost:8000
SEND_EMAIL_LECTURER=http://localhost:3000/log-in
MEETING_URL=http://localhost:3000/meeting
SESSION_SECRET=your-session-secret
ACCESS_TOKEN_SECRET=your-access-token-secret
REFRESH_TOKEN_SECRET=your-refresh-token-secret
ACCESS_TOKEN_EXPIRATION_TIME=15m
REFRESH_TOKEN_EXPIRATION_TIME=7d
SMPT_HOST=smtp.gmail.com
SMPT_PORT=465
SMPT_SERVICE=gmail
SMPT_MAIL=your-email@gmail.com
SMPT_PASSWORD=your-app-password
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
MERCHANT_ACCOUNT_ID=your-merchant-account-id
GEMINI_API_KEY=your-gemini-api-key
```

## Usage

### Development

#### Start the Server
```bash
cd server
npm start
# Server will run on http://localhost:8000
```

#### Start the Client
```bash
cd client
npm run dev
# Client will run on http://localhost:3000
```

### Production Build

#### Client
```bash
cd client
npm run build
npm start
```

#### Server
```bash
cd server
node index.js
```

## API Documentation

The API is documented using Swagger. When the server is running, visit:
- **Swagger UI**: `http://localhost:8000/api-docs`

The documentation includes all endpoints for authentication, users, courses, lectures, orders, and more.

## Deployment

### Client (Netlify)
The client is configured for Netlify deployment:
- Build command: `npm run build`
- Publish directory: `.next`
- Environment variables need to be set in Netlify dashboard

### Server
Deploy the server to a platform like Heroku, Vercel, or AWS:
1. Set production environment variables
2. Ensure MongoDB and Redis are accessible
3. Configure CORS for production URLs

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the package.json files for details.

---

**Author**: Saikat Lodh
**Contact**: saikatlidhroni20019@gmail.com
