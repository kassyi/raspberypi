// server.js
// where your node app starts

// init project
const express = require('express');
const crypto = require("crypto");
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json({verify: function (req, res, buf, encoding) {
  
  function validate_signature(signature, body) {
    const LINE_CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET;
    return signature == crypto.createHmac('sha256', LINE_CHANNEL_SECRET).update(body).digest('base64');
  }
  
  //test signature
  if (!validate_signature(req.headers['x-line-signature'], buf)) {
    throw new Error('Invalid signature.');
  }
}}));

app.post('/api/lineToBeebotte', function(req, res, err) {
  const events = req.body.events;
  const resJson = {
      data: req.body.events
  };
  const request = require('request-promise');
  
  console.log(resJson);
  
  request({
    url: 'https://api.beebotte.com/v1/data/publish/line/message?token=' + process.env.BEEBOTTE_TOKEN,
    method: 'POST',
    form : resJson
  }).then(()=>{
      res.json({result:'sucsess'});
  }).catch(()=>{
      res.json({result:'fail'});
  });
});
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
