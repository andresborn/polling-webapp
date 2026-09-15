# Update packages
sudo apt update
sudo apt upgrade --yes

# Create new user and grant sudo
sudo useradd --create-home deployman
usermod -aG sudo deployman

# Copy root SSH config to the new user (you should create an SSH key and configure it with your droplet)
rsync --archive --chown=deployman:deployman ~/.ssh /home/deployman

# Configure firewall
sudo ufw allow OpenSSH
sudo ufw enable

