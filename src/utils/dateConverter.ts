export const reverseDate = (value: string) :string => {
    return value.split('-').reverse().join('-')
}