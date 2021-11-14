'use strict';
const express = require('express');
const config = require('./config');
const cors = require('cors');
const bodyParser = require('body-parser');
const eventRoutes = require('./routes/eventRoutes');
const jwt = require('jsonwebtoken');


const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Authentication User And Password
app.use((req, res, next) => {
const auth = {login: 'UserName', password: 'passWord'} 
 const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
  const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')
   if (login && password && login === auth.login && password === auth.password) {
    return next()
  }
  res.set('WWW-Authenticate', 'Basic realm="401"')
  res.status(401).send('Authentication Failed Please Try Again.')
})
app.use('/api', eventRoutes.routes);
app.listen(config.port, () => {
  console.log('app listening on url http://localhost:' + config.port )
});