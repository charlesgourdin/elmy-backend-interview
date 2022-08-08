let chai = require('chai');
let chaiHttp = require('chai-http');
import * as assert from 'assert'

import EnergyProductionService from '../src/services/energy_production.service'
import { powerPlants } from '../src/models/power_plants'

const expect = chai.expect
chai.use(chaiHttp);

describe('Energy Production Service', () => {
    before(async () => {
        //do something
    });


    powerPlants.forEach(powerPlant => {
        const {
            name,
            url,
            interval,
            responseFormat,
            startLabel,
            endLabel,
        } = powerPlant

        it(`it should GET expected response from ${name} powerPlant Api`, (done) => {
            chai
                .request(url)
                .get('?from=01-01-2020&to=05-01-2020')
                .end((err, res) => {
                    if (err) {
                        assert.fail(err)
                    } else {
                        expect(res.status).to.equal(200)
                        
                        if (responseFormat === "json") {
                            const row = res.body[0]
                            expect(row[endLabel] - row[startLabel]).to.equal(interval)

                        } else {
                            const [start, end] = res.text
                                .split('\n')[1]
                                .split(',')
                                .map(value => parseInt(value))
                            
                            expect(end - start).to.equal(interval)
                        }
                    }
                    done();
                });
        });
    })

    it(`it should format json API answer correctly`, () => {
        const data = [{
            'start_time': 10,
            'end_time': 10,
            'value': 10
        }]

        const formattedJson = EnergyProductionService.getFormattedJsonFromJson(data, 'start_time', 'end_time', 'value')

        expect(formattedJson).to.deep.equal([{
            'start': 10,
            'end': 10,
            'power': 10
        }])
    })

    it(`it should format csv API answer correctly`, () => {
        const data = 'debut,fin,valeur\n 10,10,10'

        const formattedJson = EnergyProductionService.getFormattedJsonFromCSV(data)

        expect(formattedJson).to.deep.equal([{
            'start': 10,
            'end': 10,
            'power': 10
        }])
    })

    it(`it should fill power plant missing data`, () => {
        const interval = 10
        const data = [
            {
                start: 0,
                end: 10,
                power: 5
            },
            {
                start: 10,
                end: 20,
                power: 5
            },
            {
                start: 30,
                end: 40,
                power: 5
            },
            {
                start: 40,
                end: 50,
                power: 5
            }
        ]
        const expectedResultSum = (data.length + 1) * 5

        const result = EnergyProductionService.fillInMissingData(data, interval)
        const resultSum = result.reduce((acc, { power }) => {
            return acc + power
        }, 0)

        expect(resultSum).to.equal(expectedResultSum)
    })

    it(`it should set all power plants formated json to the same interval`, async () => {
        const data = [
            {
                start: 0,
                end: 10,
                power: 5
            },
            {
                start: 10,
                end: 20,
                power: 5
            },
            {
                start: 20,
                end: 30,
                power: 5
            },
            {
                start: 30,
                end: 40,
                power: 5
            },
            {
                start: 40,
                end: 50,
                power: 5
            }
        ]

        const interval = 2

        const expectedResultLength = ((data[data.length - 1].end - data[data.length - 1].start) / interval) * data.length
        const expectedResultSum = data.reduce((acc, { power }) => {
            return acc + power
        }, 0)

        const result = EnergyProductionService.setJsonDataOnCommonInterval(data, interval)
        const resultSum = result.reduce((acc, { power }) => {
            return acc + power
        }, 0)

        expect(result.length).to.equal(expectedResultLength)
        expect(resultSum).to.equal(expectedResultSum)
    })

    after(async () => {
        //do something
    });
})