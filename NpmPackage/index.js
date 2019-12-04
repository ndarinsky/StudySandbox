const distinctAggregations = require('./getDistinctAggregations')
const aggregationFunctions = require('./aggregation')

function getVisibleCoupletAggregations(request) { 
  let columns = request.body.columns
      const selectedCouplets = (columns || [])
          .filter(
              x =>
                  x.settings &&
                  x.settings.couplet &&
                  x.settings.couplet.aggregation
          )
          .reduce((acc, current) => {
              const {name: coupletName, aggregation, enableHighlighting} = current.settings.couplet
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

              if (!aggregations.find(x => x.field === current.name)) {
                  acc[name].columns.push(current.name)
              }
              return acc
          }, {})

      const coupletSet = Object.keys(selectedCouplets).map(x => selectedCouplets[x])

      return coupletSet
}

module.exports = {
  aggregateExportData(request, results) {
    let visibleCoupletAggregations = getVisibleCoupletAggregations(request)
    let baseResults = results.table
    const aggregationResult = this.aggregateData(baseResults, visibleCoupletAggregations)
    results.table = aggregationResult
  },

  aggregateData(data, coupletsForAggregation) {
    if (!coupletsForAggregation || coupletsForAggregation.length === 0) {
        return data
    }

    data = JSON.parse(JSON.stringify(data))

    coupletsForAggregation.forEach(({ coupletName, columns, aggregations }) => {
        data.forEach(row => {

            if (!(row[coupletName] && row[coupletName].value && row[coupletName].value.length)) {
                return
            }

            //construct a key for each piece of data
            const coupletSize = row[coupletName].value.length

            const map = columns.reduce((a, col) => {
                a[col] = new Map(
                    Array.from(
                        new Set(
                            row[coupletName].value.map(x => x[col])
                        )
                    ).map((x, i) => [x, i])
                )
                return a
            }, {})

            // if a column contains all unique data points can bail out here
            if (columns.some(col => map[col].length === coupletSize)) {
                return
            }

            const {
                result,
                aggregationResult
            } = distinctAggregations.aggregate(row[coupletName].value, columns, aggregations)

            // Select the best rows
            columns
                .filter(col => row[col])
                .forEach(col => {
                    row[col].value = aggregationResult.map(
                        x => row[col].value[x.index]
                    )
                })

            row[coupletName].value = result

            aggregations
                .filter(({ field: col }) => row[col])
                .forEach(({ field: col }) => {
                    row[col].value = aggregationResult.map(
                        x => row[col].value[x.aggregatedRow[col]]
                    )
                })
        })
    })

    return data
  },

}
