# Update packages
sudo apt update
sudo apt upgrade --yes

# Create new user and grant sudo
sudo useradd --create-home deployman
usermod -aG sudo deployman

# Create password for user
sudo passwd deployman

# Copy root SSH config to the new user (you should create an SSH key and configure it with your droplet)
rsync --archive --chown=deployman:deployman ~/.ssh /home/deployman

# Configure firewall
sudo ufw allow OpenSSH
sudo ufw enable

# Install docker in the droplet following these instructions: https://docs.docker.com/engine/install/ubuntu/

# Recommended: Use zsh.
sudo apt install zsh
chsh -s $(which zsh)
exec zsh

# Log in as your user (deployman) and create polling-webapp directory
mkdir polling-webapp