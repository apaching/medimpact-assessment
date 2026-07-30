CREATE TABLE IF NOT EXISTS shared_contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  contact_id CHAR(24) NOT NULL,
  owner_id INT NOT NULL,
  shared_with_user_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (shared_with_user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_share (contact_id, shared_with_user_id)
);
