curl -X POST http://localhost:3002/create-admin \
-H "Content-Type: application/json" \
-d '{"name": "Admin", "email": "admin@example.com", "password": "password"}'
