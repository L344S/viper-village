#!/bin/bash
if ! command -v npm &> /dev/null
then
    echo "npm could not be found, please install it"
    exit
fi

echo "Installation des dépendances..."
npm install
pip3 install -r requirements.txt

echo "starting the server..."
npm start
sleep 5

echo "opening the game..."
open src/html/index.html