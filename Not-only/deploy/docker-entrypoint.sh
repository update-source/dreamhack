#!/bin/bash
set -e

mongod &
sleep 5
mongo < /app/db.sql

exec node --inspect=0.0.0.0:9229 app.js
