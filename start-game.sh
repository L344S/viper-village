#!/bin/bash

# Check if Node.js, npm, Python3, and pip3 are installed, if not, install them
install_npm() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "Installing npm for Linux..."
        sudo apt update
        sudo apt install -y npm
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "Installing npm for macOS..."
        if ! command -v brew &> /dev/null; then
            echo "Homebrew not found, installing Homebrew first..."
            /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        fi
        brew install npm
    else
        echo "Unsupported OS, please install npm manually."
        exit 1
    fi
}

install_node() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "Installing Node.js for Linux..."
        sudo apt update
        sudo apt install -y nodejs
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "Installing Node.js for macOS..."
        if ! command -v brew &> /dev/null; then
            echo "Homebrew not found, installing Homebrew first..."
            /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        fi
        brew install node
    else
        echo "Unsupported OS, please install Node.js manually."
        exit 1
    fi
}

install_python3() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "Installing Python3 for Linux..."
        sudo apt update
        sudo apt install -y python3
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "Installing Python3 for macOS..."
        if ! command -v brew &> /dev/null; then
            echo "Homebrew not found, installing Homebrew first..."
            /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        fi
        brew install python3
    else
        echo "Unsupported OS, please install Python3 manually."
        exit 1
    fi
}

install_pip3() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "Installing pip3 for Linux..."
        sudo apt update
        sudo apt install -y python3-pip
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "Installing pip3 for macOS..."
        if ! command -v brew &> /dev/null; then
            echo "Homebrew not found, installing Homebrew first..."
            /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        fi
        brew install pip3
    else
        echo "Unsupported OS, please install pip3 manually."
        exit 1
    fi
}

if ! command -v npm &> /dev/null; then
    echo "npm could not be found, installing it..."
    install_npm
fi
if ! command -v node &> /dev/null; then
    echo "Node.js could not be found, installing it..."
    install_node
fi
if ! command -v python3 &> /dev/null; then
    echo "Python3 could not be found, installing it..."
    install_python3
fi
if ! command -v pip3 &> /dev/null; then
    echo "pip3 could not be found, installing it..."
    install_pip3
fi

# Install npm dependencies
echo "Installing npm dependencies..."
npm install
# Install Python dependencies
echo "Installing Python dependencies..."
pip3 install -r requirements.txt

# Start the server
echo "Starting the server..."
npm start &
SERVER_PID=$!

# Wait for the server to start
sleep 5

# Print the link to the game
echo "The server is running. Open the game by navigating to the following link in your web browser:"
LOCAL_IP=$(hostname -I | awk '{print $1}')
echo "http://$LOCAL_IP:5502/src/html/index.html"

# Wait for the user to terminate the script
wait $SERVER_PID
