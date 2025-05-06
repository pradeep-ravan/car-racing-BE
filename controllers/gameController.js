const pool = require('../config/db');

// Save game session data
exports.saveGameSession = async (req, res) => {
  try {
    const { playerName, score, timePlayed, distanceCovered, obstaclesAvoided } = req.body;
    
    const query = `
      INSERT INTO game_sessions 
      (player_name, score, time_played, distance_covered, obstacles_avoided) 
      VALUES (?, ?, ?, ?, ?)
    `;
    
    await pool.execute(query, [playerName, score, timePlayed, distanceCovered, obstaclesAvoided]);
    
    res.status(201).json({ message: 'Game session saved successfully' });
  } catch (error) {
    console.error('Error saving game session:', error);
    res.status(500).json({ message: 'Failed to save game session' });
  }
};

// Get all game sessions
exports.getAllSessions = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM game_sessions ORDER BY date_played DESC');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching game sessions:', error);
    res.status(500).json({ message: 'Failed to fetch game sessions' });
  }
};

// Get game statistics
exports.getGameStats = async (req, res) => {
  try {
    // Get various statistics from the database
    const [totalGames] = await pool.query('SELECT COUNT(*) as count FROM game_sessions');
    const [avgScore] = await pool.query('SELECT AVG(score) as average FROM game_sessions');
    const [topScores] = await pool.query('SELECT * FROM game_sessions ORDER BY score DESC LIMIT 5');
    
    res.status(200).json({
      totalGames: totalGames[0].count,
      averageScore: avgScore[0].average,
      topScores: topScores
    });
  } catch (error) {
    console.error('Error fetching game stats:', error);
    res.status(500).json({ message: 'Failed to fetch game statistics' });
  }
};