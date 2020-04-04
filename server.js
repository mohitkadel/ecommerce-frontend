//Install express server
const express = require('express');
const path = require('path');
const app = express();

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/frontend'));


app.get('/*', function(req,res) {
    res.sendFile(path.join(__dirname+'/dist/frontend/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080, function() {
  console.log('App is running at https://test-school-api.herokuapp.com:8080');
  console.log('Press CTRL-C to stop\n');
});