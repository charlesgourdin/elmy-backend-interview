import axios from 'axios'

import { powerPlants, PowerPlantsItem, ProductionInterval } from '../models/power_plants'

class EnergyProductionService {
    async getPowerPlantProduction(powerPlant: PowerPlantsItem, params: {from: string, to: string}): Promise<ProductionInterval[]> {
        const {
            url,
            interval,
            responseFormat,
            startLabel,
            endLabel,
            powerLabel
        } = powerPlant

        try {
            const response = await axios.get(`${url}?from=${params.from}&to=${params.to}`)

            let data = responseFormat === 'json'
                ? this.getFormattedJsonFromJson(response.data, startLabel, endLabel, powerLabel)
                : this.getFormattedJsonFromCSV(response.data)

            const intervalMini = Math.min(...powerPlants.map(({interval}) => interval))
            
            if (interval !== intervalMini) {
                data = this.setJsonDataOnCommonInterval(data, intervalMini)
            }

            return this.fillInMissingData(data, interval)
        } catch (error) {
            console.log(error)
            throw new Error(error)
        }
    }

    async getTotalProduction(from: string, to: string) {
        const params = {from, to}
        return Promise.all(powerPlants.map((powerPlant) => this.getPowerPlantProduction(powerPlant, params)))
        .then((response) => {
            console.log(response.map(x => x[0]))
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

    fillInMissingData(data: ProductionInterval[], interval: number): ProductionInterval[] {
        data.forEach((item, index) => {
            if(data[index + 1] && item.end !== data[index + 1].start) {
                const missingItem = {
                    start: item.end,
                    end: item.end + interval,
                    power: Math.ceil((item.power + data[index + 1].power) / 2)
                }

                data.splice(index + 1, 0, missingItem)
            }
        })

        return data
    }

    setJsonDataOnCommonInterval(data: ProductionInterval[], interval: number): ProductionInterval[] {
        const result = data.reduce((acc: ProductionInterval[], {start, end, power}) => {
            const items = new Array((end - start) / interval)
                .fill('')
                .map((_, index) => {
                    return {
                        start: start + index * interval,
                        end: (start + index * interval) + interval,
                        power: power / ((end - start) / interval)
                    }
            })

            acc.push(...items)
            return acc
        }, [])

        return result
    }
}

export default new EnergyProductionService()
