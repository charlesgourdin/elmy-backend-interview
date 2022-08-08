import EnergyProductionRouter from '../src/routes/energy_production.route'

const express = require('express')
const app = express()
const port = 3000

app.use(express.urlencoded({
    extended: true
}))

app.use('/production', EnergyProductionRouter);
app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))