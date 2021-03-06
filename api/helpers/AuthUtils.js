const jwt = require('jsonwebtoken');

const isAuthorizedAsAdmin = function(req, res, next) {
  const token = req.headers.token;

  jwt.verify(token, process.env.TOKEN_PASSWORD, function(err, decoded) {
    if (decoded && decoded.role === 'ADMIN') {
      next();
    } else {
      res.send('Unauthorized', 403);
    }
  });
};

const isAuthorizedAsBakordik = function(req, res, next) {
  const token = req.headers.token;

  jwt.verify(token, process.env.TOKEN_PASSWORD, function(err, decoded) {
    if (decoded && decoded.role === 'BAKORDIK') {
      next();
    } else {
      res.send('Unauthorized', 403);
    }
  });
};

const isAuthenticated = function(req, res, next) {
  const token = req.headers.token;

  jwt.verify(token, process.env.TOKEN_PASSWORD, function(err, decoded) {
    if (decoded) {
      next();
    } else {
      res.send('Unauthorized', 403);
    }
  });
};

const isAuthorizedAs = role => (
  (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
    if (authorizationHeader) {
      const token = authorizationHeader.replace('Bearer ', '');
      jwt.verify(token, process.env.TOKEN_PASSWORD, (err, decoded) => {
        if (decoded && decoded.role === role) {
          next();
        } else {
          res.send('Unauthorized', 403);
        }
      });
    } else {
      res.send('Unauthorized', 403);
    }
  }
);

const isAuthorizedAsIn = roles => (
  (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
    if (authorizationHeader) {
      const token = authorizationHeader.replace('Bearer ', '');
      jwt.verify(token, process.env.TOKEN_PASSWORD, (err, decoded) => {
        if (decoded && roles.includes(decoded.role)) {
          next();
        } else {
          res.send('Unauthorized', 403);
        }
      });
    } else {
      res.send('Unauthorized', 403);
    }
  }
);

const getUserId = req => (
  new Promise((resolve, reject) => {
    const authorizationHeader = req.headers.authorization;
    if (authorizationHeader) {
      const token = authorizationHeader.replace('Bearer ', '');
      jwt.verify(token, process.env.TOKEN_PASSWORD, (err, decoded) => {
        if (decoded) {
          resolve(decoded.userId);
        }
        reject('Unauthorized');
      });
    } else {
      reject('Unauthorized');
    }
  })
);

module.exports = {
  isAuthorizedAs,
  isAuthorizedAsIn,
  isAuthorizedAsAdmin,
  isAuthenticated,
  getUserId,
};
