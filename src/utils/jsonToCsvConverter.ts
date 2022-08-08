export const convertJsonToCsv = (data: any): string => {
    const header = `${Object.keys(data[0]).join(',')}\n`
    const body = data.map((item) => {
        return Object.values(item).join(',')
    }).join('\n')

    return header + body
}