const compare = (a) => {
if (!a) 
{ return false }
return true
}

const defaultCompareMax1 = (a, b) => {
    if (!a) { return false }
    if (!b) { return true }
    return a > b
  }

  const defaultCompareMax = (a, b) => {
    if (a === undefined) { return false }
    if (b === undefined) { return true }
    return a > b
  }

// console.log(compare(1))
// console.log(compare(0))
// console.log(compare(undefined))
// console.log(compare(null))
// console.log(compare(''))

console.log(defaultCompareMax(1,2))
console.log(defaultCompareMax(2,1))
console.log(defaultCompareMax(0,2))
console.log(defaultCompareMax(1,0))
console.log(defaultCompareMax(0,-1))
console.log(defaultCompareMax(-1,0))