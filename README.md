# Mindful Meerkats JSON API

## Development

To start with running everything you need to install the dependencies:

	npm install
	
To run the server without having to restart it all the time use:

	gulp server

## Installing RethinkDB on Ubuntu/Debian

Using a PPA:

	source /etc/lsb-release && echo "deb http://download.rethinkdb.com/apt $DISTRIB_CODENAME main" | sudo tee /etc/apt/sources.list.d/rethinkdb.list
	wget -qO- http://download.rethinkdb.com/apt/pubkey.gpg | sudo apt-key add -
	sudo apt-get update
	sudo apt-get install rethinkdb


Also install using pip

    pip install rethinkdb

## Making database dumps

    cd databases
    rethinkdb dump

## Loading database dumps
    
    rethink restore databases/[tab][tab]

    
