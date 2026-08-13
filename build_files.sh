#!/bin/bash
echo "Building for Vercel..."
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py collectstatic --noinput --clear
python manage.py migrate --noinput
echo "Build complete."
