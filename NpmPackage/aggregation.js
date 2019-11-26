//Comparison functions for couplet column aggregation
const drugProgrammeValues = {
    'Launched' : 13,
    'Registered': 12,
    'Pre-registration': 11,
    'Phase III Clinical Trial': 10,
    'Phase II Clinical Trial': 9,
    'Phase I Clinical Trial': 8,
    'Clinical Trial': 7,
    'Preclinical': 6,
    'Not Applicable': 5 ,
    'Suspended': 4,
    'Withdrawn': 3,
    'No Development Reported': 2,
    'Discontinued': 1
}

const defaultCompareMax = ( a, b ) => {
    if (a == undefined) return false
    if (b == undefined) return true
    return a > b
}
const defaultCompareMin = ( a, b ) => {
    if (a == undefined) return false
    if (b == undefined) return true
    return a < b
}

const columnValueFuncs = {
    'drugProgrammeHighestStatus' : (a) => drugProgrammeValues[a]
}

const defaultComparisons = {
    'min': defaultCompareMin,
    'max': defaultCompareMax
}

module.exports = {
    getComparisonFunction({type, field} = {type: 'max'}) {
        if (columnValueFuncs[field]){
            const getColumnValue = columnValueFuncs[field]
            return (a, b) => defaultComparisons[type](getColumnValue(a), getColumnValue(b))
        }

        return defaultComparisons[type]
    }
}
