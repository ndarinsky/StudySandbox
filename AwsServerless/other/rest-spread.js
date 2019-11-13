function add(a, ...b){
    let sum = a;
    b.forEach(num => sum += num);
    return sum;
}

console.log(add(2,3,5))
let array = [2,3,4,5];
console.log(add(...array))

let array2 = [1, ...array, 6];
console.log(array2)