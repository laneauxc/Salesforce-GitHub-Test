-- DB Migration for Deprecated Fields (Issue #303)

ALTER TABLE orders
  DROP COLUMN legacy_status_code;

ALTER TABLE users
  ADD COLUMN last_permission_change TIMESTAMP DEFAULT NULL;
