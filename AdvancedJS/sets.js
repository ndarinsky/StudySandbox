const ids = new Set([1,3,4]);

const person1 = {name:'111'}
const person2 = {name:'222'}

const data = new Map([[person1, {day: '13feb'}], ['aaa', {day: '19jun'}] ])

for (const item of data.entries()){
    console.log(item)
}

for (const [key,value] of data.entries()){
    console.log(value)
}