import bodyParser from 'body-parser';
import express from 'express';
import viewEngine from './configs/viewEngine';
import webRouter from './routes/web';
import serverless from 'serverless-http';

let app = express();

// config view engine
viewEngine(app);

// config web router
webRouter(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
let port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log('app listening on port ' + port);
});
app = serverless(app);
