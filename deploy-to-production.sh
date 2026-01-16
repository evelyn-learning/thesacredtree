#!/bin/bash

# Colors for output formatting
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SERVER_IP="84.247.185.169"
SERVER_USER="root"
REMOTE_APP_DIR="/root/thesacredtree"
ZIP_FILE="sacredtree.zip"
PM2_APP_NAME="sacredtree-website"

# Log function with timestamps
log_message() {
  local level=$1
  local message=$2
  local color=$NC

  case $level in
    "INFO") color=$GREEN ;;
    "ERROR") color=$RED ;;
    "WARNING") color=$YELLOW ;;
    "STEP") color=$BLUE ;;
  esac

  echo -e "${color}[$(date +'%Y-%m-%d %H:%M:%S')] [${level}] ${message}${NC}"
}

# Error handling function
handle_error() {
  log_message "ERROR" "An error occurred on line $1"
  # Clean up local zip file if it exists
  if [ -f "$ZIP_FILE" ]; then
    rm -f "$ZIP_FILE"
    log_message "INFO" "Cleaned up local zip file"
  fi
  exit 1
}

# Set up trap to catch errors
trap 'handle_error $LINENO' ERR

# Function to run remote command via SSH
run_remote_command() {
  local command=$1
  ssh -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" "$command"
}

# Starting deployment
log_message "INFO" "Starting Sacred Tree deployment to production..."

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "src" ]; then
  log_message "ERROR" "Not in the Sacred Tree project root. Please run from the website directory."
  exit 1
fi

# Step 1: Build the Next.js app locally
log_message "STEP" "Building Next.js app locally..."

# Clean up previous builds
log_message "INFO" "Cleaning up previous build artifacts..."
rm -rf .next/
rm -f tsconfig.tsbuildinfo

npm run build || {
  log_message "ERROR" "Failed to build Next.js app locally"
  exit 1
}
log_message "INFO" "Next.js app built successfully"

# Step 2: Create deployment package
log_message "STEP" "Creating deployment package..."

if [ -f "$ZIP_FILE" ]; then
  rm -f "$ZIP_FILE"
  log_message "INFO" "Removed existing zip file"
fi

# Package everything needed for production (excluding node_modules, env files)
zip -qr "$ZIP_FILE" \
  .next \
  public \
  src \
  scripts \
  package.json \
  package-lock.json \
  next.config.ts \
  tsconfig.json \
  postcss.config.mjs \
  -x "*/.env" \
  -x "*/.env.local" \
  -x "*.log" || {
  log_message "ERROR" "Failed to create zip file"
  exit 1
}
log_message "INFO" "Successfully created $ZIP_FILE ($(du -h $ZIP_FILE | cut -f1))"

# Step 3: Upload to production server
log_message "STEP" "Uploading to production server..."
scp -o StrictHostKeyChecking=no "$ZIP_FILE" "$SERVER_USER@$SERVER_IP:$REMOTE_APP_DIR/" || {
  log_message "ERROR" "Failed to upload zip file to server"
  exit 1
}
log_message "INFO" "Successfully uploaded zip file to server"

# Step 4: Deploy on remote server
log_message "STEP" "Running deployment on production server..."
run_remote_command "
  export NVM_DIR=\"\$HOME/.nvm\"
  [ -s \"\$NVM_DIR/nvm.sh\" ] && . \"\$NVM_DIR/nvm.sh\"

  cd $REMOTE_APP_DIR && \
  unzip -qo $ZIP_FILE && \
  rm -f $ZIP_FILE && \
  npm install --production --legacy-peer-deps && \
  pm2 restart $PM2_APP_NAME
" || {
  log_message "ERROR" "Deployment failed on remote server"
  exit 1
}
log_message "INFO" "Deployment completed successfully on server"

# Step 5: Clean up local zip file
log_message "STEP" "Cleaning up local files..."
rm -f "$ZIP_FILE" || {
  log_message "WARNING" "Failed to remove local zip file"
}
log_message "INFO" "Local zip file cleaned up"

# Step 6: Deployment complete
log_message "INFO" "🎉 Deployment to production completed successfully!"
log_message "INFO" "🌳 Production Site: https://thesacredtree.org"
log_message "INFO" "📝 Check logs: ssh root@$SERVER_IP 'pm2 logs $PM2_APP_NAME'"
log_message "INFO" "📊 Check status: ssh root@$SERVER_IP 'pm2 status'"
