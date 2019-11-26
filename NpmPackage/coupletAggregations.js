const aggregationFunctions = require('./aggregation')

module.exports = {
    getResultsTable(state){
        return state.resultsTable
    },

    getResultsData(state){
        return state.results.data
    },
  
    getAreaFromUrl(state) {
        params = this.getParams(state)
        return params.area
    },

    getBaseResults(request, results) {
        let values = this.getActiveEntityData(request, results)
        return values || []
    },

    getActiveEntityData(request, results) {
        let activeEntity = request.entity
        let resultsData = results.table
        return resultsData[activeEntity] || this.getDefaultEntityData()
    },

    getTableEntity(state) {
        let currentArea = this.getAreaFromUrl(state)
        let activeEntity = this.getActiveEntity(state)
        let engageEntity = this.getActiveSubEntity(state)
        return currentArea !== areas.citelineEngage ? activeEntity : engageEntity
    },

    getStateForTableEntity(state) {
        entity = this.getTableEntity(state)
        resultsTable = this.getResultsTable(state)
        return resultsTable[entity] || {}
    },

    getColumnSettings(state) {
        let table = this.getStateForTableEntity(state)
        return table.columnSettings || []
    },

    getVisibleColumnIds(state) {
        let settings = this.getColumnSettings(state)
        return settings.filter(c => c.isVisible).map(c => c.columnName)
    },

    getAllColumnsById(state) {
        let table = this.getStateForTableEntity(state)
        return table.allColumnsById
    },

    getVisibleColumns(state) {
        let allColumnsById = this.getAllColumnsById(state)
        let visibleColumnIds = this.getVisibleColumnIds(state)
        return visibleColumnIds.map(c => allColumnsById[c]).filter(c => c !== undefined)
    },

    getCouplets(acc, cur) {
        const {name: coupletName, aggregation, enableHighlighting} = cur.settings.couplet
        const name = coupletName
        const aggregations = (Array.isArray(aggregation) ? aggregation : [aggregation])

        if (!acc[name]) {
            acc[name] = {
                coupletName: coupletName,
                aggregations: aggregations
                    .map(agg => ({
                        field: agg.field,
                        compareFunc: getComparisonFunction(agg)
                    })),
                columns: []
            }

            if(enableHighlighting){
                acc[name].aggregations.push({field: 'isMatchingFilter', compareFunc: getComparisonFunction() })
            }
        }

        if (!aggregations.find(x => x.field === cur.name)) {
            acc[name].columns.push(cur.name)
        }
        return acc
    },

    getVisibleCoupletAggregations(request) { 
        let columns = request.body.columns
            const selectedCouplets = (columns || [])
                .filter(
                    x =>
                        x.settings &&
                        x.settings.couplet &&
                        x.settings.couplet.aggregation
                )
                .reduce((acc, cur) => {
                    const {name: coupletName, aggregation, enableHighlighting} = cur.settings.couplet
                    const name = coupletName
                    const aggregations = (Array.isArray(aggregation) ? aggregation : [aggregation])
    
                    if (!acc[name]) {
                        acc[name] = {
                            coupletName: coupletName,
                            aggregations: aggregations
                                .map(agg => ({
                                    field: agg.field,
                                    compareFunc: aggregationFunctions.getComparisonFunction(agg)
                                })),
                            columns: []
                        }
    
                        if(enableHighlighting){
                            acc[name].aggregations.push({field: 'isMatchingFilter', compareFunc: aggregationFunctions.getComparisonFunction() })
                        }
                    }
    
                    if (!aggregations.find(x => x.field === cur.name)) {
                        acc[name].columns.push(cur.name)
                    }
                    return acc
                }, {})
    
            const coupletSet = Object.keys(selectedCouplets).map(x => selectedCouplets[x])
    
            return coupletSet
    }
}