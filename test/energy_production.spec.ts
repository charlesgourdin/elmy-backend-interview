let chai = require('chai');
let chaiHttp = require('chai-http');
import * as assert from 'assert'

import EnergyProductionService from '../src/services/energy_production.service'
import { powerPlantes } from '../src/models/power_plants'

const expect = chai.expect
chai.use(chaiHttp);

describe('Audience size calculator test.', () => {
    before(async () => {
        //do something
    });


    powerPlantes.forEach(powerPlant => {
        const {
            name,
            url,
            interval,
            response,
            startLabel,
            endLabel,
            powerLabel
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
                        
                        if (response === "json") {
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

        
    it(`should have a test who pass`, async () => {
        try {
            const users = ["coucou"]

            expect(users).to.includes("coucou")
        } catch (error) {
            assert.fail(error)
        }
    })

    after(async () => {
        //do something
    });
})