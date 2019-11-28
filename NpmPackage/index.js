const distinctAggregations = require('./getDistinctAggregations')
const coupletAggregations = require('./coupletAggregations')

function getIndeces(arr) { 

  const values = arr.value.sort().map(x => x.value);
  let collectionWithoutRepeats = values.filter(function(v, i, self)  
  { 
      return i == self.indexOf(v); 
  }); 

  let result = []
  collectionWithoutRepeats.forEach(element => {
      let index = values.indexOf(element)
      result.push(index)
  });
      
  return result; 
}

function applyIndeces(input, indeces){
  for (var key in input){
      let row = input[key];
      if (row.value){
        row.value = row.value.filter((v, i) => 
        { 
            return indeces.includes(i) 
        })
        input[key] = row
      }
  }
}

function sort(input, sorting) {
  let columnForSort = input[sorting.column]

}

module.exports = {
  //Start export aggregation
  startAggregation(request, results) {
    let visibleCoupletAggregations = coupletAggregations.getVisibleCoupletAggregations(request)
    let baseResults = results.table
    this.applyVisibleAggregations(baseResults, visibleCoupletAggregations, request.body.sorting)
  },

  //Start aggregations on ui
  applyAggregations(tableData, coupletsForAggregation) {
    if (!coupletsForAggregation || coupletsForAggregation.length === 0) {
      return tableData
    }

    return this.getAggregatedValues(tableData, coupletsForAggregation)
  },

  aggregateCustom(row, columns, sorting){
    let startRow = row[sorting.column] ? row[sorting.column] : row[columns[0]]
    let indeces = getIndeces(startRow)
    applyIndeces(row, indeces)
  },

  applyVisibleAggregations(tableData, coupletsForAggregation, sorting) {
    if (!coupletsForAggregation || coupletsForAggregation.length === 0) {
      return
    }

    coupletsForAggregation.forEach(({ coupletName, columns, aggregations }) => {
      tableData.forEach(row => this.aggregateCustom(row, columns, sorting))
    })
  },

  //Will change row, to contain only aggregated data.
  aggregateVisible(row, columns, aggregations) {
    const array = [row]
    const { result, aggregationResult } = distinctAggregations.customAggregate(array, columns, aggregations)
    columns.filter(col => row[col])
      .forEach(col => {
        row[col].value = aggregationResult.map(
          x => row[col].value[x.index]
        )
      })

    row.value = result

    aggregations.filter(({ field: col }) => row[col])
      .forEach(({ field: col }) => {
        row[col].value = aggregationResult.map(
          x => row[col].value[x.aggregatedRow[col]]
        )
      })
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
