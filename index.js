const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const syncronize = require('./src/syncronize');
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// defining the Express app
const app = express();

// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors({
    origin: 'http://localhost:4200'
}));

// adding morgan to log HTTP requests
app.use(morgan('combined'));

const rotas = [];

//rotas
require("fs").readdirSync(__dirname + '\\src\\routes').forEach(function (file) {
    rotas.push('src/routes/' + file);
    const rota = require('./src/routes/' + file);
    app.use('/' + file.split('.')[0], rota);
});

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Hotel Api",
            version: "1.0.0",
            description: "Complete Api for Hotel"
        },
        servers: [
            { url: "http://localhost:3000" }
        ]
    },
    apis: rotas
}

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerJsDoc(options)));

// starting the server
app.listen(3000, () => {
    console.log('API funcionando.');
});