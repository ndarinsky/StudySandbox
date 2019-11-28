let input = {
    company: [
        "Actis Biologics",
"Chiesi",
"Alnylam",
"Chiesi",
"Chiesi",
"Chiesi",
"Chiesi",
"Novartis",
"Novartis",
"Novartis",
"Chiesi"],
    status: ["Launched",
"Launched",
"Registered",
"Phase III Clinical Trial",
"Phase II Clinical Trial",
"Phase II Clinical Trial",
"Phase II Clinical Trial",
"Phase I Clinical Trial",
"Preclinical",
"No Development Reported",
"Discontinued"]
}

let uniqCompany = Array.from(new Set(input.company))
let uniqStatus = Array.from(new Set(input.status))

          
function removewithfilter(arr) { 
    let collectionWithoutRepeats = arr.filter(function(v, i, self) 
    { 
        return i == self.indexOf(v); 
    }); 

    let result = []
    collectionWithoutRepeats.forEach(element => {
        let index = arr.indexOf(element)
        result.push(index)
    });
        
    return result; 
} 

function mergeWithStatus(arr, indeces) {
    return arr.map(x => {
        let item = {
            company: x.item,
            status: statuses[x.index]
        }
        return item
    })
}

function removeTest(input, indeces){
    for (var key in input){
        let row = input[key];
        row = row.filter((v, i) => 
        { 
            return indeces.includes(i) 
        })
        input[key] = row
    }
}

let indeces = removewithfilter(input["company"])
let ttt = removeTest(input, indeces)

// const array1 = [1, 2, 3, 4];
// const reducer = (accumulator, currentValue) => {
//     accumulator[currentValue] = currentValue+"__";
//     return accumulator
// }
// console.log(array1.reduce(reducer, {}));

// console.log(indeces)
console.log(input)

// for (var key in input){
//     console.log(input[key])
// }
// console.log(removewithfilter(input.company)); 
// console.log(finalResult);

