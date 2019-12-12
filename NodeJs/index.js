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
        let i = 0
        let indeces = arr.reduce((acc, cur) => {
            if (cur === element){
                acc.push(i)
            }
            i++
            return acc
        }, [])
        result.push({
            item: element,
            indexes: indeces})
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

function merge(input) {
    let result = []
    for (var key in input){
        
        if (input[key] && Array.isArray(input[key])){
            let i = 0
            for (var key2 in input){
                if (input[key2] && Array.isArray(input[key2] && key !==key2)) {
                    result.push({ 
                    key: key2,
                    items: input[key2][i]
                    })
                }
            }
        }
    }
}

let indeces = removewithfilter(input["company"])
removeTest(input, indeces)
// console.log(merge(input))

