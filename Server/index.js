const express = require("express");
const cors = require("cors");

var fs = require("fs");
var https = require("https");
// const multer = require("multer");
// const upload = multer();
const app = express();

// for parsing application/json
app.use(express.json());

// for parsing multipart/form-data
// app.use(upload.none());

//---------

var credentials = { key: privateKey, cert: certificate };

// for Enabling CORS
app.use(cors());

const routes = require("./src/Routes/route");

app.use(express.static(__dirname + "/public"));
app.use(routes);

//Server Port

if (process.env.NODE_ENV == "devlopment") {
  //HTTPS Server

  var privateKey = fs.readFileSync(
    "/etc/letsencrypt/live/api.crtefoundation.org/privkey.pem",
    "utf8"
  );
  var certificate = fs.readFileSync(
    "/etc/letsencrypt/live/api.crtefoundation.org/cert.pem",
    "utf8"
  );

  var httpsServer = https.createServer(credentials, app);

  httpsServer.listen(8000);

  console.log(`listening PORT 8000...`);
} else {
  //Http Server

  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`listening PORT ${port}...`);
  });
}
