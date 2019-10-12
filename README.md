## Pre-requisites

- NodeJS: (>=8.9.0) - https://nodejs.org/
- Wamp : http://www.wampserver.com/en/download-wampserver-64bits/ (for Windows)
- Lamp : https://www.hostinger.fr/tutoriels/lamp-ubuntu/ (for Linux)
- Sequelize: npm install -g sequelize sequelize-cli mysql2
- Nodemon: npm install -g nodemon

## Launch api

1. Run in terminal `npm install`
2. Run in terminal `sequelize db:create` to create the database 'myyoutuber'
3. Run in terminal `sequelize db:migrate` to tables in your database
4. Run in terminal `npm run debug` (on Linux) ou `npm run win_debug` (on Windows)
