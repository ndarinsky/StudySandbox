let input = {
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
"Discontinued"],
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
"Chiesi"]
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
        result.push({
            item: element,
            index: index
        })
    });
        
    return result; 
} 

function mergeWithStatus(arr, statuses) {
    return arr.map(x => {
        let item = {
            company: x.item,
            status: statuses[x.index]
        }
        return item
    })
}

let collectionWithoutRepeats = removewithfilter(input.company)

let finalResult = mergeWithStatus(collectionWithoutRepeats, input.status)

console.log(removewithfilter(input.company)); 
console.log(finalResult);

