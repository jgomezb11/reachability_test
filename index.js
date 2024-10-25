import sanitizeHtml from 'sanitize-html';
var _ = require('lodash');
import express from 'express';

module.exports = function vulnFunc() {
  return (req, res, next) => {
    res.redirect(sanitizeHtml(req.params.text, {
      allowedTags: ['textarea']
    }));
  };
};

module.exports = function safeFunc() {
  return (req, res, next) => {
    let text = "some internal text";
    res.redirect(sanitizeHtml(text, {
      allowedTags: ['textarea']
    }));
  };
};

module.exports = function vulnFunc2() {
  return (req, res, next) => {
    res.redirect(_.trim(req.params.body));
  };
};

module.exports = function safeFunc2() {
  const variable = "some internal var";
  return (req, res, next) => {
    res.redirect(_.toNumber(variable));
  };
};

const app = express();
app.use(express.json());

const { vulnFunc, safeFunc, vulnFunc2, safeFunc2 } = require('./index');

// Add routes to test each function
app.get('/vulnFunc/:text', vulnFunc());
app.get('/safeFunc', safeFunc());
app.post('/vulnFunc2', vulnFunc2());
app.get('/safeFunc2', safeFunc2());

app.listen(3000, () => console.log('Server running on http://localhost:3000'));