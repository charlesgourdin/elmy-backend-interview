import { Request, Response, NextFunction } from 'express';
import EnergyProductionRouter from '../src/routes/energy_production.route'

const express = require('express')
const app = express()
const port = 3000

const bodyParser = require("body-parser");
const path = __dirname + '/views/';

app.use(express.static(__dirname + '/views'));

app.use(express.urlencoded({
    extended: true
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/production', EnergyProductionRouter);

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.sendFile(path + "index.html")
    next()
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))