const reselect = require('reselect')


module.exports = {
    getParams = currentRoute => "getCurrentRoute", //todo dar
    getAreaFromUrl = reselect.createSelector(
        this.getParams,
        params => params.area
    ),

    getResultsTable = state => state.resultsTable,
    getResultsData = state => state.results.data,
    getActiveEntity = state => (state.entities || {}).activeEntity,
    getActiveSubEntity = state => this.getMetadata(state).subEntity,
    getMetadata = state => state.citelineEngage.metadata, //todo dar

    getTableEntity = reselect.createSelector(
        this.getAreaFromUrl,
        this.getActiveEntity,
        this.getActiveSubEntity,
        (currentArea, activeEntity, engageEntity) =>
            currentArea !== areas.citelineEngage ? activeEntity : engageEntity
    ),

    getStateForTableEntity = reselect.createSelector(
        this.getTableEntity,
        this.getResultsTable,
        (entity, resultsTable) => resultsTable[entity] || {}
    ),

    getColumnSettings = reselect.createSelector(
        this.getStateForTableEntity,
        (table) => table.columnSettings || []
    ),

    getVisibleColumnIds = reselect.createSelector(
        this.getColumnSettings,
        ( settings ) => settings.filter(c => c.isVisible)
            .map(c => c.columnName)
    ),

    getAllColumnsById = reselect.createSelector(
        this.getStateForTableEntity,
        (table) => table.allColumnsById
    ),

    getVisibleColumns = reselect.createSelector(
        this.getAllColumnsById,
        this.getVisibleColumnIds,
        (allColumnsById, visibleColumnIds) =>
            visibleColumnIds.map(c => allColumnsById[c])
                .filter(c => c !== undefined)
    ),

    getVisibleCoupletAggregations = reselect.createSelector(
        this.getVisibleColumns,
        columns => {
            const selectedCouplets = (columns || [])
                .filter(
                    x =>
                        x.settings &&
                        x.settings.couplet &&
                        x.settings.couplet.aggregation
                )
                .reduce((acc, cur) => {
                    const {name: coupletName, aggregation, enableHighlighting} = cur.settings.couplet
    
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
                }, {})
    
            const coupletSet = Object.keys(selectedCouplets).map(x => selectedCouplets[x])
    
            return coupletSet
        }
    ),

    getBaseResults = reselect.createSelector(
        getActiveEntityData,
        ({values}) => values || emptyResults
    ),

    getActiveEntityData = reselect.createSelector(
        this.getActiveEntity,
        this.getResultsData,
        (activeEntity, resultsData) =>
            resultsData[activeEntity] || getDefaultEntityData()
    )
}