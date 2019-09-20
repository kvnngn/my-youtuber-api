## Pre-requisites

- NodeJS: (>=8.9.0) - https://nodejs.org/
- Wamp : http://www.wampserver.com/en/download-wampserver-64bits/
- Sequelize: npm install -g sequelize sequelize-cli mysql2
- Nodemon: npm install -g nodemon
## Launch api

1. Run in terminal ```npm install```
1. Run in terminal ```sequelize db:migrate``` to tables in your database
2. Run in terminal ```npm run win_debug```
3. Then in another terminal ```npm run test``` to feed your database

##Add column / model or do the migration

/!\ It is mandatory to create the database "causportsnews" for cau-sports-news-api !

-  sequelize db:migrate

ceci va exécuter le SQL de db.sql et va mettre en place les bases de données
