/*
*  This is the server file. It gets all the dependencies needed
*  and makes the application listen to the specified port.
*  The dependencies are:
*  a) express.js        // the server
*  b) body-parser.js    // in post requests, pass object in json format in the request body
*  c) cors.js           // which urls are authorized to send and receive data
*  d) mongoose.js       // provides a structure for NoSQL documents
*  e) config.ts         // database url
*/
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as mongoose from 'mongoose';
import Routes from './routes/routes';
import config from './config/config';

mongoose.Promise = global.Promise;
mongoose.connect(config.dbUrl, { useNewUrlParser: true, useCreateIndex: true })
    .then(() => {
        console.log('Database is connected');
    }, err => {
        console.log('Unable to connect to the database ' + err);
    }
);

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use('/users', Routes.activate().users());           // activate /users server path
app.use('/positions', Routes.activate().positions());   // activate /positions server path
app.use('/schedule', Routes.activate().schedules());
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    console.log('Listening on port ' + port);
});
