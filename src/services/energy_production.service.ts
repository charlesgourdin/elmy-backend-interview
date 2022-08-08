import axios from 'axios'

import { powerPlants, PowerPlantsItem, ProductionInterval } from '../models/power_plants'

class EnergyProductionService {
    async getPowerPlantProduction(powerPlant: PowerPlantsItem, params: {from: string, to: string}): Promise<ProductionInterval[]> {
        const {
            name,
            url,
            interval,
            responseFormat,
            startLabel,
            endLabel,
            powerLabel
        } = powerPlant

        try {
            const response = await axios.get(`${url}?from=${params.from}&to=${params.to}`)

            const data = responseFormat === 'json'
                ? this.getFormattedJsonFromJson(response.data, startLabel, endLabel, powerLabel)
                : this.getFormattedJsonFromCSV(response.data)

            return [{start: 1, end: 1, power: 1}]
        } catch (error) {
            throw new Error(error)
        }
    }

    async getTotalProduction(from: string, to: string) {
        const params = {from, to}
        return Promise.all(powerPlants.map((powerPlant) => this.getPowerPlantProduction(powerPlant, params)))
        .then((response) => {
            return response
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    getFormattedJsonFromJson(data: any, startLabel:string, endLabel:string, powerLabel:string): ProductionInterval[] {
        return data.map(item => {
            return {
                start: item[startLabel],
                end: item[endLabel],
                power: item[powerLabel]
            }
        })
    }

    getFormattedJsonFromCSV(data: any): ProductionInterval[] {
        return data.split('\n').slice(1).map(item => {
            const [start, end, power] = item.split(',')
            return {
                start: parseInt(start),
                end: parseInt(end),
                power: parseInt(power)
            }
        })
    }
}

export default new EnergyProductionService()
