import express from 'express';
import path from 'path';
// import favicon from 'serve-favicon';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import compression from 'compression';
import config from './config';
import routes from './routes';
import log from './util/log';

import passport from 'passport';
import session from 'express-session';
import passportRoute from './auth2/routes/passport';


const app = express();
const logger = log.getLogger('app');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('x-powered-by', false);

// app.use(favicon(__dirname + '/../kibana/soc/assets/img/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
// passport needed
app.use(session({ secret: 'keyboard mouse', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

//passportRoute放在所有路由前面
app.use(passportRoute);
app.use(routes);


// static会放过根目录,权限需要在前面，如kibana本身的auth()
app.use(express.static(path.join(__dirname, '..', 'client')));

logger.info(`System Started at port ===>>> ${config.port}`);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});

export default app;
