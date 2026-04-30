# Team Task Manager - Full Stack Application

A comprehensive web application for managing team projects and tasks with role-based access control.

## Features

- **User Authentication**: Secure signup and login with JWT tokens
- **Project Management**: Create, update, and manage projects
- **Task Management**: Create, assign, and track task progress
- **Team Collaboration**: Add team members with different roles (Admin/Member)
- **Dashboard**: Real-time overview of tasks, status, and overdue items
- **Role-Based Access Control**: Admin and Member roles with appropriate permissions
- **Progress Tracking**: Monitor task completion and project statistics

## Tech Stack

### Backend
- **Node.js** with Express.js
- **PostgreSQL** database
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Joi** for validation

### Frontend
- **React** 18
- **React Router** for navigation
- **Axios** for API calls
- **CSS3** for styling

## Project Structure

```
team-task-manager/
├── backend/                 # Express server
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Database models
│   │   ├── middleware/     # Auth & error handling
│   │   ├── routes/         # API routes
│   │   ├── server.js       # Main server file
│   │   └── initDatabase.js # Database initialization
│   ├── package.json
│   └── .env
├── client/                  # React frontend
│   ├── src/
│   │   ├── pages/          # Page components
│   │   ├── components/     # Reusable components
│   │   ├── services/       # API services
│   │   ├── App.jsx
│   │   └── index.js
│   ├── public/
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `GET /api/auth/users` - Get all users

### Projects
- `POST /api/projects` - Create project
- `GET /api/projects` - Get user's projects
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/members` - Add team member
- `DELETE /api/projects/:id/members/:userId` - Remove member

### Tasks
- `POST /api/tasks/projects/:projectId/tasks` - Create task
- `GET /api/tasks/projects/:projectId/tasks` - Get project tasks
- `GET /api/tasks/tasks/:taskId` - Get task details
- `PUT /api/tasks/tasks/:taskId` - Update task
- `DELETE /api/tasks/tasks/:taskId` - Delete task
- `GET /api/tasks/my-tasks` - Get user's tasks
- `GET /api/tasks/dashboard` - Get dashboard stats

## Getting Started

### Prerequisites
- Node.js (v14+)
- PostgreSQL database
- npm or yarn

### Backend Setup

1. Navigate to the backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following:
```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=team_task_manager
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

4. Initialize the database:
```bash
node src/initDatabase.js
```

5. Start the server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client folder:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'Member',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Projects Table
```sql
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'pending',
  priority VARCHAR(20) DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. User signs up/logs in
2. Server returns a JWT token
3. Token is stored in localStorage
4. Token is sent with every API request in the Authorization header
5. Backend verifies token for protected routes

## Deployment on Railway

### Prerequisites
- Railway account (https://railway.app)
- Git repository with your code
- GitHub account

### Steps

1. **Prepare your repository**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push
   ```

2. **Deploy Backend**:
   - Go to Railway dashboard
   - Click "New Project" → "Deploy from GitHub"
   - Select your repository
   - Set environment variables in Railway:
     - `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
     - `JWT_SECRET`
     - `CORS_ORIGIN`
   - Railway will automatically detect and deploy the Node.js app

3. **Deploy Frontend**:
   - Create a new Railway service for the frontend
   - Set `REACT_APP_API_URL` to your backend Railway URL
   - Deploy using Railway's build process

4. **Database**:
   - Use Railway's PostgreSQL plugin
   - Update environment variables with the connection details

## Usage

### For Admin Users
- Create and manage projects
- Add team members with roles
- Create and assign tasks
- View team progress

### For Regular Members
- View assigned projects
- See and update assigned tasks
- Track personal task progress
- View team dashboards

## Key Features Implementation

### Authentication
- Secure password hashing with bcrypt
- JWT token-based authorization
- Token refresh mechanism

### Role-Based Access Control
- Admin: Full project and member management
- Member: Can view projects and manage assigned tasks

### Task Management
- Create tasks with priority levels
- Assign tasks to team members
- Track task status (pending, in_progress, completed)
- View overdue tasks

### Dashboard
- Real-time statistics
- Task completion metrics
- Team project overview
- Personalized task list

## Error Handling

The application includes comprehensive error handling:
- Input validation with Joi
- Database error handling
- JWT verification errors
- HTTP status codes for different error scenarios

## Security Features

- Password hashing with bcrypt (salt rounds: 10)
- JWT token expiration (default: 7 days)
- CORS enabled for specific origins
- Input validation on all endpoints
- Protected routes requiring authentication

## Future Enhancements

- Task comments and activity log
- File attachment support
- Email notifications
- Task filtering and search
- Advanced reporting
- User profile management
- Task priority automation
- Webhook integrations

## Contributing

This is a team project. Please follow these guidelines:
- Create feature branches
- Write clear commit messages
- Test before submitting
- Follow code style conventions

## License

MIT License

## Support

For issues and questions, please check the documentation or contact the development team.

---

**Demo Video**: [Your Demo Video Link]
**Live Application**: [Your Railway URL]
**Repository**: [Your GitHub URL]
