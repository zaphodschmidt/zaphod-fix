#!/bin/bash
sudo docker exec -it streakapp-backend-1 python manage.py spectacular --file ./schema.yaml
cd frontend
pnpm generate-api