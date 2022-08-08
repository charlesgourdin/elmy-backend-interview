let chai = require('chai');
let chaiHttp = require('chai-http');
import * as assert from 'assert'

import EnergyProductionService from '../src/services/energy_production.service'
import { powerPlants } from '../src/models/power_plants'
import energy_productionService from '../src/services/energy_production.service';

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

    it(`should format json API answer correctly`, async () => {
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

    it(`should format csv API answer correctly`, async () => {
        const data = 'debut,fin,valeur\n 10,10,10'

        const formattedJson = EnergyProductionService.getFormattedJsonFromCSV(data)

        expect(formattedJson).to.deep.equal([{
            'start': 10,
            'end': 10,
            'power': 10
        }])
    })

    after(async () => {
        //do something
    });
})