#All log paths are within the relative sections below

sudo add-apt-repository -y ppa:ondrej/php 
sudo apt-get update

#Install Zip to help with composer downloads.
sudo apt-get install -y zip

# Install apache
# You will need to change the DocumentRoot and Directory values to match the Domain of the server you are running
sudo apt-get install -y apache2
sudo apt-get update
sudo cat << 'EOF' > /etc/apache2/sites-available/price-compare-api.conf
<VirtualHost *:80>
	ServerName ec2-3-10-4-75.eu-west-2.compute.amazonaws.com
	ServerAdmin webmaster@localhost
	DocumentRoot /var/www/html/price-compare-api/public
	<Directory /var/www/html/price-compare-api/public>
		Options -Indexes
		AllowOverride All
		Require all granted
	</Directory>
	<FilesMatch \.php$>
		SetHandler "proxy:unix:/var/run/php/php7.4-fpm.sock|fcgi://localhost/"
	</FilesMatch>
	LogLevel warn
	ErrorLog ${APACHE_LOG_DIR}/error.log
	CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
EOF

# Install php-fpm
sudo apt-get install -y php7.4-gd php7.4-cli php7.4-fpm php7.4-mysql php7.4-curl php-memcached php7.4-dev php7.4-sqlite3 php7.4-mbstring php7.4-xml
sudo apt-cache search php7.4

#image libraries to convert jpg and png to webp

sudo apt-get install -y imagemagick webp

# Make config and data dirs
sudo mkdir /etc/composer -p || exit 1
sudo mkdir /var/lib/composer -p

# Set composer home dir to global location
sudo cat << EOF > /etc/profile.d/composer.sh
#!/usr/bin/env bash
export COMPOSER_HOME=/etc/composer
export COMPOSER_ALLOW_SUPERUSER=1
EOF
export COMPOSER_HOME=/etc/composer
export COMPOSER_ALLOW_SUPERUSER=1

# Allow dir to be passed when sudoing
# sudo composer global ...
sudo cat << EOF > /etc/sudoers.d/composer
Defaults env_keep += "COMPOSER_HOME"
Defaults env_keep += "COMPOSER_ALLOW_SUPERUSER"
EOF

# Install Composer
if [ ! -f /usr/local/bin/composer ]; then
    cd /tmp
    sudo curl -sS https://getcomposer.org/installer | php
    sudo mv composer.phar /usr/local/bin/composer
fi

# Reset data and cache dirs to be in normal location
composer config -g cache-dir "/tmp/.composer/cache"
composer config -g data-dir "/tmp/.composer"
chmod +r /etc/composer/auth.json
chmod +r /etc/composer/config.json

# Set global dirs for global context
composer global config data-dir /var/lib/composer
composer global config vendor-dir /var/lib/composer/vendor
composer global config bin-dir /usr/bin

# php.ini
sed -i 's/;cgi.fix_pathinfo.*/cgi.fix_pathinfo = 0/' /etc/php/7.4/fpm/php.ini
sed -i 's/;zlib.output_compression =.*/zlib.output_compression = On/' /etc/php/7.4/fpm/php.ini
sed -i 's/;zlib.output_compression_level.*/zlib.output_compression_level = -1/' /etc/php/7.4/fpm/php.ini
sed -i 's/memory_limit .*/memory_limit = 512M/' /etc/php/7.4/fpm/php.ini
sed -i 's/max_execution_time .*/max_execution_time = 300/' /etc/php/7.4/fpm/php.ini
sed -i 's/display_errors .*/display_errors = On/' /etc/php/7.4/fpm/php.ini
sed -i 's/post_max_size .*/post_max_size = 64M/' /etc/php/7.4/fpm/php.ini
sed -i 's/upload_max_size .*/upload_max_size = 64M/' /etc/php/7.4/fpm/php.ini
sed -i 's/;error_log\s=\sphp_errors.log.*/error_log = \/var\/log\/php_errors.log/' /etc/php/7.4/fpm/php.ini
sed -i 's/;error_log\s=\sphp_errors.log.*/error_log = \/var\/log\/php_errors.log/' /etc/php/7.4/cli/php.ini
# Nice colour prompt in cmd and putty

sed -i 's/#force_color_prompt=yes.*/force_color_prompt=yes/' ~/.bashrc

sudo service php7.4-fpm restart

a2enmod proxy rewrite proxy_fcgi setenvif ssl
a2ensite price-compare-api
sudo chmod -R :www-data /var/www
a2dissite 000-default
sudo systemctl reload apache2
sudo wget https://get.symfony.com/cli/installer -O - | bash
sudo mv /home/ubuntu/.symfony/bin/symfony /usr/local/bin/symfony