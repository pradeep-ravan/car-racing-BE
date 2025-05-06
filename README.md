# Car Racing Game - Backend Documentation

## Overview

The Car Racing Game backend is a Node.js application built with Express and MySQL that provides APIs for storing and retrieving game session data. This backend system handles player information, game scores, performance metrics, and provides a comprehensive analytics dashboard for game statistics.

## Features

- RESTful API for game session data
- MySQL database integration
- Player management
- Score tracking and leaderboards
- Game analytics dashboard with charts
- Session metrics (time played, distance covered, obstacles avoided)
- Real-time data visualization

## Technology Stack

- **Node.js**: JavaScript runtime environment
- **Express**: Web application framework
- **MySQL**: Relational database for data storage
- **mysql2**: MySQL client for Node.js with Promise support
- **EJS**: Templating engine for the dashboard views
- **dotenv**: Environment variable management
- **cors**: Cross-Origin Resource Sharing middleware
- **body-parser**: Request body parsing middleware
- **Chart.js**: (Frontend) Data visualization library used in the dashboard

## Directory Structure

```
```

## Installation and Setup

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)

### Installation Steps

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd car-racing-game/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following environment variables:
   ```
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=car_racing_game
   ```

4. Create the database and tables:
   ```bash
   mysql -u root -p < config/database.sql
   ```

5. Start the application:
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Game Sessions

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/game/save-session` | Save a new game session |
| GET | `/api/game/sessions` | Get all game sessions |
| GET | `/api/game/stats` | Get game statistics |

## API Usage Examples

### Save Game Session

**Request:**
```http
POST /api/game/save-session
Content-Type: application/json

{
  "playerName": "Player1",
  "score": 150,
  "timePlayed": 45,
  "distanceCovered": 2500,
  "obstaclesAvoided": 15
}
```

**Response:**
```json
{
  "message": "Game session saved successfully"
}
```

### Get Game Statistics

**Request:**
```http
GET /api/game/stats
```

**Response:**
```json
{
  "totalGames": 25,
  "averageScore": 120.5,
  "topScores": [
    {
      "id": 12,
      "player_name": "Player1",
      "score": 230,
      "time_played": 65,
      "distance_covered": 3200,
      "obstacles_avoided": 23,
      "date_played": "2025-05-06T18:25:43.511Z"
    },
    ...
  ]
}
```

## Database Schema

The application uses the following database table:

### Game Sessions

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key, auto-increment |
| player_name | VARCHAR(50) | Player's name |
| score | INT | Game score |
| time_played | INT | Time played in seconds |
| distance_covered | INT | Distance covered in game units |
| obstacles_avoided | INT | Number of obstacles avoided |
| date_played | DATETIME | Timestamp of the game session |

## Dashboard

The backend provides a built-in analytics dashboard available at the `/dashboard` route. The dashboard includes:

- Total games played
- Average score
- Average time played
- Score distribution chart
- Game sessions over time chart
- Top players leaderboard

## Key Components

### Database Configuration (config/db.js)

Sets up and exports a MySQL connection pool:

```javascript
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
```

### Game Controller (controllers/gameController.js)

Handles game data operations:

- Saving game sessions
- Retrieving game sessions
- Calculating game statistics

### Game Routes (routes/gameRoutes.js)

Defines the API routes for the game:

```javascript
const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

router.post('/save-session', gameController.saveGameSession);
router.get('/sessions', gameController.getAllSessions);
router.get('/stats', gameController.getGameStats);

module.exports = router;
```

### Main Application (index.js)

Sets up the Express application with middleware and routes:

```javascript
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
const gameRoutes = require('./routes/gameRoutes');
app.use('/api/game', gameRoutes);

// Home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// Dashboard route
app.get('/dashboard', (req, res) => {
  res.render('dashboard');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Deployment

### Local Development

```bash
npm run dev
```

This uses nodemon to automatically restart the server when files change.

### Production Deployment

```bash
npm start
```

### Deployment Options

The backend can be deployed to various environments:

#### Traditional Hosting

Deploy to a VPS or dedicated server with Node.js installed.

#### Cloud Platforms

- **Heroku**: Add a `Procfile` with `web: node index.js`
- **Vercel**: Create a `vercel.json` file:
  ```json
  {
    "version": 2,
    "builds": [
      {
        "src": "index.js",
        "use": "@vercel/node"
      }
    ],
    "routes": [
      {
        "src": "/(.*)",
        "dest": "index.js"
      }
    ]
  }
  ```
- **AWS Elastic Beanstalk**: Use the Node.js platform

## Performance Considerations

### Database Indexing

The database schema includes indexes on frequently queried fields for better performance:

```sql
CREATE INDEX idx_player_name ON game_sessions(player_name);
CREATE INDEX idx_score ON game_sessions(score);
CREATE INDEX idx_date_played ON game_sessions(date_played);
```

### Connection Pooling

The application uses connection pooling to efficiently manage database connections:

```javascript
const pool = mysql.createPool({
  // ...
  connectionLimit: 10,
  queueLimit: 0
});
```

## Security Considerations

- User inputs are validated before processing
- Prepared statements are used for all database queries to prevent SQL injection
- CORS is configured to allow only specific origins in production
- Environment variables are used for sensitive configuration

## Error Handling

The application includes comprehensive error handling:

```javascript
try {
  // Database operations
} catch (error) {
  console.error('Error description:', error);
  res.status(500).json({ message: 'Error description' });
}
```

## Future Enhancements

Potential areas for backend development:

1. User authentication for player profiles
2. More detailed analytics and filters
3. Achievements and rewards system
4. Weekly/monthly leaderboards
5. Social sharing functionality
6. Multi-player support
7. Game configuration settings API

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify database credentials in `.env` file
   - Ensure MySQL server is running
   - Check firewall settings

2. **API Response Errors**
   - Check server logs for detailed error messages
   - Verify request format matches expected schema
   - Test API endpoints with Postman or similar tool

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
