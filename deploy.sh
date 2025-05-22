#!/bin/bash

# Check if the build directory exists
if [ -d "dist" ]; then
  echo "Build directory exists."
else
  echo "Build directory does not exist." >&2
  exit 1
fi

# Remove the existing build directory if it exists
if [ -d "/var/www/html/mediquest-FE-build" ]; then
  echo "Removing old build directory..."
  sudo_pass=$(<~/.sudo_pass)
  echo $sudo_pass | sudo -S rm -rf /var/www/html/mediquest-FE-build
  echo "Old build directory removed."
else
  echo "No existing build directory to remove."
fi

# Copy the new build directory to the deployment location
echo "Copying new build directory..."
echo $sudo_pass | sudo -S cp -r dist /var/www/html/mediquest-FE-build
echo "New build directory copied to /var/www/html/mediquest-FE-build."

# Restart Nginx to apply changes
# Read the password from the file and restart Nginx
echo "Restarting Nginx service..."
sudo_pass=$(<~/.sudo_pass)
echo $sudo_pass | sudo -S systemctl restart nginx || { echo "Failed to restart Nginx"; exit 1; }

# Deployment completed message
echo "Deployment completed successfully."
