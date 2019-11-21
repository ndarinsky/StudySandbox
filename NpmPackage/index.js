const distinctAggregations = require('./getDistinctAggregations')

module.exports = {
  applyAggregations(values, coupletsForAggregation) {
    if (!coupletsForAggregation || coupletsForAggregation.length === 0) {
      return values
    }
    return this.getAggregatedValues(values, coupletsForAggregation)
  },
  columnContainsAllUniqueData(columns, row, coupletName) {
    const buildKeyForEachData = (a, col) => {
      a[col] = new Map(Array.from(new Set(row[coupletName].value.map(x => x[col]))).map((x, i) => [x, i]))
      return a
    }
    const mapWithKeys = columns.reduce(buildKeyForEachData, {})

    const coupletSize = row[coupletName].value.length
    return columns.some(col => mapWithKeys[col].length === coupletSize)
  },

  selectBestRows(columns, row, coupletName, aggregations) {
    const { result, aggregationResult } = distinctAggregations.aggregate(row[coupletName].value, columns, aggregations)
    columns.filter(col => row[col])
      .forEach(col => {
        row[col].value = aggregationResult.map(
          x => row[col].value[x.index]
        )
      })

    row[coupletName].value = result

    aggregations.filter(({ field: col }) => row[col])
      .forEach(({ field: col }) => {
        row[col].value = aggregationResult.map(
          x => row[col].value[x.aggregatedRow[col]]
        )
      })
  },

  aggregateRow(row, columns, coupletName, aggregations) {
    const coupletIsValid = row[coupletName] && row[coupletName].value && row[coupletName].value.length
    if (!coupletIsValid || this.columnContainsAllUniqueData(columns, row, coupletName)) {
      return
    }

    this.selectBestRows(columns, row, coupletName, aggregations)
  },

  getAggregatedValues(values, coupletsForAggregation) {
    values = JSON.parse(JSON.stringify(values))

    coupletsForAggregation.forEach(({ coupletName, columns, aggregations }) => {
      values.forEach(row => this.aggregateRow(row, columns, coupletName, aggregations))
    })

    return values
  }
}
