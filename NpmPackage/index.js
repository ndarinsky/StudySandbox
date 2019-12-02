const distinctAggregations = require('./getDistinctAggregations')
const aggregationFunctions = require('./aggregation')

function getIndices(arr) { 
  const values = arr//.sort().map(x => x.value);
  let collectionWithoutRepeats = values.filter(function(v, i, self)  
  { 
      return i == self.indexOf(v); 
  }); 

  let result = []
  collectionWithoutRepeats.forEach(element => {
      let i = 0
      let indeces = arr.reduce((acc, cur) => {
          if (cur === element){
              acc.push(i)
          }
          i++
          return acc
      }, [])
      result.push({
          key: element,
          index: indeces})
  });
      
  return result; 
}

function getBestValueIndex(aggregation, row, acc, cur){
  return aggregation.compareFunc(
          distinctAggregations.getBestValueForAggregation(row[acc]),
          distinctAggregations.getBestValueForAggregation(row[cur])
        ) ? acc : cur
}

function applyIndices(input, groups, aggregations){
  for (var key in input){
      let row = input[key].value;
      if (row && Array.isArray(row)){
        let aggregation = aggregations.find(x => x.field === key)
        if (aggregation){
          let resultRow = []
          groups.forEach(x => {
            let bestIndex = x.index.reduce((acc, cur) => getBestValueIndex(aggregation, row, acc, cur))

            resultRow.push(row[bestIndex])
          })

          input[key] = resultRow
        } else {
          let resultRow = []
          input[key] = groups.forEach(x => {
            let groupResult = x.index[0]
            resultRow.push(row[groupResult])
          })
          input[key] = resultRow
        }
      }
  }
}

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

function getValue(item){
  return item.value || item
}

module.exports = {
  //Start export aggregation
  startAggregation(request, results) {
    let visibleCoupletAggregations = getVisibleCoupletAggregations(request)
    let baseResults = results.table
    this.applyVisibleAggregations(baseResults, visibleCoupletAggregations, request.body.sorting)
  },

  buildKeys(row, columns) {
    let result = []
    let validColumns = columns.filter( c => row[c] && Array.isArray(row[c].value))

    validColumns.forEach(item => {
      let arr = row[item].value
      for (var i=0; i<arr.length; i++){
        if (result[i]){
          result[i] = result[i].concat(getValue(arr[i])) 
        } else {
          result.push(getValue(arr[i])+',')
        }
      }
    })

    return result
  },

  aggregateCustom(row, columns, aggregations){

    let keys = this.buildKeys(row, columns)

    // let isValid = row[columns[0]] && Array.isArray(row[columns[0]].value)
    // let startRow = isValid ? row[columns[0]] : []
    let indeces = getIndices(keys)
    applyIndices(row, indeces, aggregations)
  },

  applyVisibleAggregations(tableData, coupletsForAggregation, sortInfo) {
    if (!coupletsForAggregation || coupletsForAggregation.length === 0) {
      return
    }

    coupletsForAggregation.forEach(({ coupletName, columns, aggregations }) => {
      tableData.forEach(row => this.aggregateCustom(row, columns, aggregations))
      // tableData.forEach(row => this.aggregateVisible(row, columns, aggregations, coupletName))
      // tableData.forEach(row => {
      //     let test = []
      //     const {result, aggregationResult } = distinctAggregations.customAggregate(row, columns, aggregations, test)
      //     // Select the best rows
      //     columns.filter(col => row[col])
      //         .forEach(col => {
      //             row[col].value = aggregationResult.map(
      //                 x => row[col].value[x.index]
      //             )
      //         })

      //     row[coupletName].value = result

      //     aggregations.filter(({ field: col }) => row[col])
      //         .forEach(({ field: col }) => {
      //             row[col].value = aggregationResult.map(
      //                 x => row[col].value[x.aggregatedRow[col]]
      //             )
      //         })
      // })
    })
  },

  //Will change row, to contain only aggregated data.
  aggregateVisible(row, columns, aggregations, coupletName) {
    {
      //construct a key for each piece of data
      const coupletSize = row[coupletName].value.length

      const keys = columns.reduce((a, col) => {
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
      if (columns.some(col => keys[col].length === coupletSize)) {
          return
      }

      const {
          result,
          aggregationResult
      } = aggregate(row[coupletName].value, columns, aggregations)

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


  }
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
