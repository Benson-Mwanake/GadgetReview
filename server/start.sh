#!/bin/bash
# Run database migrations
flask db upgrade

python seed.py

# Start the server
exec gunicorn app:app --bind 0.0.0.0:$PORT --workers 3
