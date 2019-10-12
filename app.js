const http = require ('http');
const https = require ('https');
const fs = require ('fs');
const bodyParser = require ('body-parser');
const debug = require ('debug') ('app');
const config = require ('./config');
const models = require ('./models');
const express = require ('express');
const glob = require ('glob');
const ClientManager = require ('./modules/socket/ClientManager');
const ChatroomManager = require ('./modules/socket/ChatroomManager');
const makeHandlers = require ('./modules/socket/handlers');

var app;

try {
  /*if(isMainCluster()) {
        handleSeveralProcesses();
        return;
    }
    if(process.env.schedule) {
        debug("Spawn scheduler worker complete");
        schedule.run();
        return;
    }*/
  app = express ();
  setupLibs ();
  //setupLogs();
  loadRoutes ();
  setupNotFoundHandler ();
  //setupErrorHandler();
  launchServer ();
} catch (err) {
  console.log (err);
}

function isMainCluster () {
  return config.clusters.use && cluster.isMaster;
}

function handleSeveralProcesses () {
  const nCPUs = countCPUs ();
  createOneWorkerForEachCPU ();
  listenForDyingWorkers ();

  function countCPUs () {
    return Math.min (config.clusters.maxCPUs, os.cpus ().length);
  }

  function createOneWorkerForEachCPU () {
    for (let i = 0; i < nCPUs; i++) {
      cluster.fork ();
      debug ('Spawn worker %d complete', i);
    }
    cluster.fork ({schedule: true});
  }

  function listenForDyingWorkers () {
    cluster.on ('exit', function (worker) {
      // Spwan new worker to replace the dying one
      debug ('Worker %d died ! Respawning ...', worker.id);
      cluster.fork ();
    });
  }
}

function setupLibs () {
  //app.use(cors());
  app.use (bodyParser.json ({limit: '50mb'}));
  app.use (bodyParser.urlencoded ({extended: true}));
  app.use (function (req, res, next) {
    res.setHeader ('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader (
      'Access-Control-Allow-Methods',
      'GET, POST, OPTIONS, PUT, PATCH, DELETE'
    );

    // Request headers you wish to allow
    res.setHeader ('Access-Control-Allow-Headers', 'Content-Type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader ('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next ();
  });

  //app.use(passport.initialize());
  //moment.locale("fr");
  //passportStrategy.init();
}

function setupLogs () {
  const logDirectory = __dirname + '/logs';
  fs.existsSync (logDirectory) || fs.mkdirSync (logDirectory);
  const accessLogStream = logrotate ({
    file: logDirectory + '/access.log',
    size: '1m',
  });

  morgan.token ('user', function (req) {
    if (req.user) {
      return req.user.id + '/' + req.user.role;
    }
    return null;
  });
  morgan.token ('body', function (req) {
    if (req.body) {
      return JSON.stringify (req.body);
    }
    return null;
  });
  app.use (
    morgan (
      '[:date[iso]] :remote-addr [:user] HTTP/:http-version :method :url :body :status :user-agent',
      {stream: accessLogStream}
    )
  );
}

function loadRoutes () {
  const routes = glob.sync ('./modules/**/*.routes.js');
  routes.forEach (function (route) {
    app.use (require (route));
  });
}

function setupNotFoundHandler () {
  app.use (function (req, res, next) {
    debug ('URI not found : %s', req.url);
    return res.status (404).json ('URI not found : ' + req.url);
  });
}

function setupErrorHandler () {
  app.use (function (err, req, res, next) {
    if (err instanceof models.Sequelize.Error) {
      err = new errors.Sequelize (err);
    }
    if (
      err.type &&
      [
        'StripeCardError',
        'RateLimitError',
        'StripeInvalidRequestError',
        'StripeAPIError',
        'StripeConnectionError',
        'StripeAuthenticationError',
      ].indexOf (err.type) >= 0
    ) {
      err = new errors.Stripe (err);
    }

    const statusCode = err.statusCode || 500;

    if (err instanceof errors.LibHerosError) {
      debug ('error ------------------------------------------');
      debug ('    status:  ', err.statusCode);
      debug ('    name:    ', err.name);
      debug ('    flag:    ', err.flag);
      debug ('    message: ', err.message);
      debug ('------------------------------------------------');
    } else {
      debug ('unknown error ----------------------------------');
      debug (err);
      debug ('------------------------------------------------');
    }
    logError (err);
    return res.status (statusCode).json (err);
  });

  function logError (err) {
    const logDirectory = __dirname + '/logs';
    const errorLogStream = logrotate ({
      file: logDirectory + '/errors.log',
      size: '1m',
    });
    const errToPrint = JSON.parse (JSON.stringify (err));
    errToPrint.date = moment ().format ('YYYY-MM-DD HH:mm');
    errToPrint.stack = err.stack;
    errorLogStream.write (JSON.stringify (errToPrint));
    errorLogStream.end ('\n');
  }
}

function launchServer () {
  let server = null;
  if (config.ssl.use) {
    server = https.createServer (
      {
        key: fs.readFileSync (config.ssl.key),
        cert: fs.readFileSync (config.ssl.cert),
      },
      app
    );
  } else {
    server = http.createServer (app);
  }

  const io = require ('socket.io') (server);

  const clientManager = ClientManager ();
  const chatroomManager = ChatroomManager ();
  io.on ('connection', function (client) {
    const {
      handleRegister,
      handleJoin,
      handleLeave,
      handleMessage,
      handleGetChatrooms,
      handleGetAvailableUsers,
      handleDisconnect,
    } = makeHandlers (client, clientManager, chatroomManager);

    console.log ('client connected...', client.id);
    clientManager.addClient (client);

    client.on ('register', handleRegister);

    client.on ('join', handleJoin);

    client.on ('leave', handleLeave);

    client.on ('message', handleMessage);

    client.on ('chatrooms', handleGetChatrooms);

    client.on ('availableUsers', handleGetAvailableUsers);

    client.on ('disconnect', function () {
      console.log ('client disconnect...', client.id);
      handleDisconnect ();
    });

    client.on ('error', function (err) {
      console.log ('received error from client:', client.id);
      console.log (err);
    });
  });
  server.listen (config.port, function () {
    debug ('%s API server listening on port %s', config.name, config.port);
  });
}
