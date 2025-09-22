-- Base de datos: letras_en_movimiento
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','child') NOT NULL DEFAULT 'child',
  created_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS diagnostic_attempts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  score DECIMAL(4,2) NOT NULL,
  level ENUM('bajo','medio','alto') NOT NULL,
  details JSON,
  created_at DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_levels (
  user_id INT PRIMARY KEY,
  level ENUM('bajo','medio','alto') NOT NULL,
  updated_at DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS progress (
  user_id INT NOT NULL,
  game_key VARCHAR(40) NOT NULL,
  difficulty ENUM('facil','medio','avanzado') NOT NULL,
  progress INT NOT NULL DEFAULT 0,
  score INT NOT NULL DEFAULT 0,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (user_id, game_key, difficulty),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS stars (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  game_key VARCHAR(40) NOT NULL,
  difficulty ENUM('facil','medio','avanzado') NOT NULL,
  awarded_at DATETIME NOT NULL,
  UNIQUE KEY uq_star (user_id,game_key,difficulty),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
