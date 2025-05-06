CREATE DATABASE IF NOT EXISTS car_racing_game;
USE car_racing_game;

CREATE TABLE IF NOT EXISTS game_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  player_name VARCHAR(50),
  score INT DEFAULT 0,
  time_played INT DEFAULT 0,
  distance_covered INT DEFAULT 0,
  obstacles_avoided INT DEFAULT 0,
  date_played DATETIME DEFAULT CURRENT_TIMESTAMP
);