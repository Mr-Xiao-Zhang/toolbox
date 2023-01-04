export const zyhToString = (value: any ): string => {
    if (typeof(value) == "string") {
        return  value
    }
    if (typeof(value) == "undefined"){
        return  ''
    }
    if (value === null){
        return  ''
    }
    return value.toString()
}