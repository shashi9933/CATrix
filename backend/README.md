# CATrix Backend - Express.js + PostgreSQL

A robust, scalable backend for the CATrix CAT preparation platform built with Node.js, Express.js, and PostgreSQL.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 13+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database URL and JWT secret

# Setup database
npx prisma db push

# Start development server
npm run dev
```

The server will run on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── src/
│   ├── index.ts                 # Express server setup
│   ├── middleware/
│   │   └── auth.ts              # JWT authentication middleware
│   └── routes/
│       ├── auth.ts              # Authentication endpoints
│       ├── tests.ts             # Test management
│       ├── testAttempts.ts      # Test attempt tracking
│       ├── users.ts             # User profile
│       ├── analytics.ts         # Analytics & metrics
│       ├── colleges.ts          # College database
│       └── studyMaterials.ts    # Study resources
├── prisma/
│   └── schema.prisma            # Database schema
├── package.json
├── tsconfig.json
└── .env                         # Environment variables
```

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register          # Create new account
POST   /api/auth/login             # User login
POST   /api/auth/verify            # Verify JWT token
```

### Tests
```
GET    /api/tests                  # List all tests
GET    /api/tests/:id              # Get test with questions
POST   /api/tests                  # Create test (admin)
```

### Test Attempts
```
POST   /api/test-attempts          # Start test attempt
GET    /api/test-attempts/:id      # Get attempt details
PATCH  /api/test-attempts/:id      # Submit answers
GET    /api/test-attempts/user/attempts  # User's attempts
```

### Users
```
GET    /api/users/profile          # Get user profile
PATCH  /api/users/profile          # Update profile
```

### Analytics
```
GET    /api/analytics              # Get user analytics
GET    /api/analytics/recent-tests # Recent test scores
POST   /api/analytics/update       # Update analytics
```

### Colleges
```
GET    /api/colleges               # List all colleges
GET    /api/colleges/:id           # Get college details
POST   /api/colleges               # Create college (admin)
```

### Study Materials
```
GET    /api/study-materials        # List all materials
GET    /api/study-materials/section/:section  # By section
GET    /api/study-materials/:id    # Get material
POST   /api/study-materials        # Create material (admin)
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for stateless authentication.

### JWT Flow
1. User logs in with email/password
2. Server validates credentials and generates JWT
3. Client stores token in localStorage
4. Client includes token in Authorization header for protected routes
5. Server validates token and processes request

### Token Format
```
Authorization: Bearer <jwt_token>
```

### Token Claims
```json
{
  "userId": "user-id",
  "email": "user@example.com",
  "role": "user",
  "iat": 1234567890,
  "exp": 1234654290
}
```

## 🗄️ Database Schema

### Users
- `id` - Unique identifier (UUID)
- `email` - User email (unique)
- `password` - Hashed password (bcrypt)
- `name` - User name
- `role` - User role (user/admin)
- `createdAt` - Account creation timestamp
- `updatedAt` - Last update timestamp

### Tests
- `id` - Test ID (UUID)
- `title` - Test name
- `section` - Section (VARC/DILR/QA)
- `difficulty` - Level (easy/medium/hard)
- `duration` - Duration in minutes
- `totalMarks` - Maximum marks

### Questions
- `id` - Question ID (UUID)
- `testId` - Associated test
- `questionText` - Question body
- `options` - Options (stored as JSON)
- `correctAnswer` - Correct option letter
- `marks` - Points for this question
- `explanation` - Solution explanation

### Test Attempts
- `id` - Attempt ID (UUID)
- `userId` - Student user ID
- `testId` - Test ID
- `score` - Final score
- `timeTaken` - Time in seconds
- `status` - Status (in_progress/completed/abandoned)
- `startedAt` - Start timestamp
- `completedAt` - Completion timestamp

### Question Attempts
- `id` - Record ID (UUID)
- `testAttemptId` - Associated test attempt
- `questionId` - Question ID
- `selectedAnswer` - Student's answer
- `isCorrect` - Correctness flag
- `timeTaken` - Time spent (seconds)

### Analytics
- `userId` - User ID
- `totalTests` - Tests taken
- `totalScore` - Cumulative score
- `averageScore` - Average per test
- `totalTimeSpent` - Total time (seconds)
- `accuracy` - Percentage accuracy

## 🛠️ Development

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Start production server
npm start

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Sync schema to database
npm run prisma:push

# Open Prisma Studio GUI
npm run prisma:studio
```

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/catrix"

# Authentication
JWT_SECRET="your-super-secret-key-change-this"

# Server
PORT=5000
NODE_ENV="development"

# CORS
FRONTEND_URL="http://localhost:5173"
```

## 📦 Dependencies

### Core
- **express** - Web framework
- **prisma** - ORM for database
- **@prisma/client** - Prisma client
- **pg** - PostgreSQL driver
- **typescript** - Type safety

### Authentication
- **jsonwebtoken** - JWT generation & verification
- **bcrypt** - Password hashing

### Utilities
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 🧪 Testing API

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"user@example.com",
    "password":"password123",
    "name":"John Doe"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"user@example.com",
    "password":"password123"
  }'

# Get tests
curl http://localhost:5000/api/tests

# Get tests with auth
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/users/profile
```

### Using Postman
1. Import endpoints from API folder
2. Set environment variable `{{token}}` in Authorization tab
3. Test each endpoint

## 🚀 Deployment

### Prepare for Production

1. **Set secure JWT secret**
   ```bash
   # Generate a strong secret
   openssl rand -base64 32
   ```

2. **Update environment**
   ```env
   NODE_ENV=production
   JWT_SECRET=your-secure-random-secret
   DATABASE_URL=your-production-database-url
   ```

3. **Build and start**
   ```bash
   npm run build
   npm start
   ```

### Hosting Options

- **Railway**: `npm install -g railway && railway up`
- **Render**: Connect GitHub repository
- **Heroku**: `git push heroku main`
- **DigitalOcean**: App Platform or Droplet
- **AWS**: EC2, Elastic Beanstalk, or Lambda

## 📊 Performance Optimization

### Database
- Add indexes on frequently queried columns
- Use database connection pooling
- Optimize Prisma queries

### Caching
- Implement Redis for frequently accessed data
- Cache test data
- Cache analytics calculations

### API
- Add response caching headers
- Implement pagination
- Add rate limiting
- Compress responses with gzip

## 🔒 Security Considerations

1. **Environment Variables**: Never commit `.env` file
2. **JWT Secret**: Use strong, random secret (32+ chars)
3. **Password Hashing**: bcrypt with 10 salt rounds
4. **HTTPS**: Always use HTTPS in production
5. **CORS**: Whitelist frontend URL
6. **Rate Limiting**: Implement per IP limits
7. **Input Validation**: Validate all inputs
8. **SQL Injection**: Use Prisma (safe from SQL injection)
9. **CSRF**: Implement CSRF tokens if needed
10. **Logging**: Log suspicious activities

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Verify PostgreSQL is running
# Check DATABASE_URL format
# Ensure database exists
createdb catrix
```

### Prisma Error
```bash
# Regenerate Prisma client
npm run prisma:generate

# Sync schema with database
npm run prisma:push

# Reset database (caution!)
npx prisma migrate reset
```

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti :5000 | xargs kill -9
```

### JWT Verification Failed
```bash
# Verify JWT_SECRET matches
# Check token hasn't expired
# Verify token format (Bearer prefix)
```

## 📚 Resources

- [Express.js Docs](https://expressjs.com)
- [Prisma Docs](https://www.prisma.io/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs)
- [JWT Introduction](https://jwt.io/introduction)
- [RESTful API Best Practices](https://restfulapi.net)

## 📄 License

This project is part of CATrix platform.

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📞 Support

For issues and questions:
1. Check documentation
2. Review API responses
3. Check server logs
4. Consult team members

---

**Last Updated**: December 28, 2025
**Backend Status**: ✅ Production Ready
