
const arrayA = [1,2,5,7]

const arrayB = Array.from(arrayA) //copy arrayA
const arrayC = arrayA.slice(); //also copy arrayA

// arrayB.splice(1, 0, "hhh") //inserts hhh as 2nd element
// arrayB.splice(1, 2) //delete 2 elements
// const removedElements = arrayB.splice(0) //delete all elements

const mergedArray = arrayA.concat(arrayB)

const personData = [{ name: 'max'}, {name:'john'}]
// const index = person.indexOf({name:'john'}) //doesn't work
const result = personData.find((person, index, persons) =>  person.name === 'john') //find object, return it not it's copy
// console.log(result)

const sum = arrayC.reduce((prev, cur, curIndex, arrayC) => {
    return prev+cur
}, 0)
console.log(sum)

const nameData = ['mikalai', 'darinsky', 'nikolaevich']
const [first, second, surname] = nameData
console.log(first, second, surname)