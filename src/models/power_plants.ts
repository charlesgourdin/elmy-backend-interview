export type PowerPlantesItem = {
    name: string,
    url: string,
    interval: number,
    response: 'json'|'csv',
    startLabel: string,
    endLabel: string,
    powerLabel: string
}

const convertMinutesToSeconds = (duration: number): number => duration * 60

export const powerPlantes: PowerPlantesItem[] = [
    {
        name: "Hawes",
        url: "https://interview.beta.bcmenergy.fr/hawes",
        interval: convertMinutesToSeconds(15),
        response: 'json',
        startLabel: 'start',
        endLabel: 'end',
        powerLabel: 'power'
    },
    {
        name: "Barnsley",
        url: "https://interview.beta.bcmenergy.fr/barnsley",
        interval: convertMinutesToSeconds(30),
        response: 'json',
        startLabel: 'start_time',
        endLabel: 'end_time',
        powerLabel: 'value'
    },
    {
        name: "Hounslow",
        url: "https://interview.beta.bcmenergy.fr/hounslow",
        interval: convertMinutesToSeconds(60),
        response: 'csv',
        startLabel: 'debut',
        endLabel: 'fin',
        powerLabel: 'valeur'
    }
]