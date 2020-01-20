function getBestValueForAggregation(a) {
    if (a == null) {
        return ''
      }
    return a.rank || a.caption || a
  }

  // console.log(getBestValueForAggregation(1))
  // console.log(getBestValueForAggregation(null))
  // console.log(getBestValueForAggregation(undefined))
  // console.log(getBestValueForAggregation(0))
  // console.log(getBestValueForAggregation(-1))
  // console.log(getBestValueForAggregation(''))
  // console.log('end')

 const path = 'aaaa'
 const result = path.substring(0, undefined)
 console.log(result)
 console.log(path.lastIndexOf('allOf') - 1 || 0)