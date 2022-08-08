export type PowerPlantsItem = {
    name: string,
    url: string,
    interval: number,
    responseFormat: 'json'|'csv',
    startLabel: string,
    endLabel: string,
    powerLabel: string
}

export type ProductionInterval = {
    start: number,
    end: number,
    power: number
}

const convertMinutesToSeconds = (duration: number): number => duration * 60

export const powerPlants: PowerPlantsItem[] = [
    {
        name: "Hawes",
        url: "https://interview.beta.bcmenergy.fr/hawes",
        interval: convertMinutesToSeconds(15),
        responseFormat: 'json',
        startLabel: 'start',
        endLabel: 'end',
        powerLabel: 'power'
    },
    {
        name: "Barnsley",
        url: "https://interview.beta.bcmenergy.fr/barnsley",
        interval: convertMinutesToSeconds(30),
        responseFormat: 'json',
        startLabel: 'start_time',
        endLabel: 'end_time',
        powerLabel: 'value'
    },
    {
        name: "Hounslow",
        url: "https://interview.beta.bcmenergy.fr/hounslow",
        interval: convertMinutesToSeconds(60),
        responseFormat: 'csv',
        startLabel: 'debut',
        endLabel: 'fin',
        powerLabel: 'valeur'
    }
]