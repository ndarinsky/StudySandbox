

module.exports = {
  getBestValueForAggregation(a = '') {
    return a.rank || a.caption || a
  },

  /**
 * Returns an aggregation on an array of objects.
 * @param {Object[]} rows Array of object to perform the aggregation on.
 * @param {string[]} keys The object fields that are being used to select distinct rows.
 * @param {Object[]} aggregations An array of fields to aggregate by and the aggregation function to use
 * @returns {Object[]} array of row indexes to filter by
 */
  getDistinctRows(rows, keys, aggregations) {
    const keysMapped = rows.map((x, i) => {
      return { key: keys.map(key => (x[key] || {}).caption || x[key]).join(','), index: i }
    })

    //must be 4 groups
    const groups = keysMapped.reduce((acc, cur) => {
      if (acc[cur.key]) {
        acc[cur.key].push(cur.index)
      } else {
        acc[cur.key] = [cur.index]
      }
      return acc
    }, {})

    const aggregatedRows = Object.keys(groups).map(key => ({
      key,
      index: groups[key][0]
    }))

    aggregatedRows.forEach(x => {
      const indexes = groups[x.key]
      x.aggregatedRow = aggregations.reduce((acc, { field, compareFunc }) => {
        acc[field] = indexes.reduce((acc, cur) =>
          (compareFunc(this.getBestValueForAggregation(rows[acc][field]), this.getBestValueForAggregation(rows[cur][field])) ? acc : cur))
        return acc
      }, {})
    })

    return aggregatedRows
  },

  customAggregate(collection, keys, aggregations = []) {
    const relevantFields = keys.concat(aggregations.map(({ field }) => field))
    const selectRelevantFields = x => relevantFields.reduce((acc, cur) => {
      acc[cur] = x[cur]
      return acc
    }, {})

    const test = collection.map((x) => selectRelevantFields(x))

    const preparedCollection = collection.map((x) =>
      ({ ...selectRelevantFields(x) }))

    const rowIndexes = this.getDistinctRows(preparedCollection, keys, aggregations)

    return {
      result: rowIndexes.map(({ index, aggregatedRow }) => (
        {
          ...preparedCollection[index],
          ...Object.keys(aggregatedRow).reduce((acc, cur) => {
            acc[cur] = preparedCollection[aggregatedRow[cur]][cur]
            return acc
          }, {})
        })),
      aggregationResult: rowIndexes
    }
  },

  /**
 * Returns an aggregation on an array of objects.
 * @param {Object[]} collection collection to iterate over.
 * @param {string[]} keys The object fields that are being used to select distinct rows.
 * @param {Object[]} aggregations An array of fields to aggregate by and the aggregation function to use
 * @returns {Object[]} sorted collection
 */
  aggregate(collection, keys, aggregations = []) {

    const relevantFields = keys.concat(aggregations.map(({ field }) => field))

    const selectRelevantFields = x => relevantFields.reduce((acc, cur) => {
      acc[cur] = x[cur]
      return acc
    }, {})


 

    
    const test = collection.map((x) => selectRelevantFields(x))

    const preparedCollection = collection.map((x) =>
      ({ ...selectRelevantFields(x) }))

    const rowIndexes = this.getDistinctRows(preparedCollection, keys, aggregations)

    return {
      result: rowIndexes.map(({ index, aggregatedRow }) => (
        {
          ...preparedCollection[index],
          ...Object.keys(aggregatedRow).reduce((acc, cur) => {
            acc[cur] = preparedCollection[aggregatedRow[cur]][cur]
            return acc
          }, {})
        })),
      aggregationResult: rowIndexes
    }
  }
}
