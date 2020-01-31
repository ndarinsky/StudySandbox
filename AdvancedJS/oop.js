//How inheritance implemented in JS
function Person(first, last, age, gender, interests) {
    this.name = {
        first,
        last
    };
    this.age = age;
    this.gender = gender;
    this.interests = interests;
};

Person.prototype.greeting = function() {
console.log('Hi! I\'m ' + this.name.first + '.');
};

function Teacher(first, last, age, gender, interests, subject) {
this.name = {
    first,
    last
};
this.age = age;
this.gender = gender;
this.interests = interests;
this.subject = subject;
}

Teacher.prototype = Object.create(Person.prototype);
console.log(Teacher.prototype.constructor)
let teacher1 = new Teacher('Dave', 'Griffiths', 31, 'male', ['football', 'cookery'], 'mathematics');
console.log(teacher1.greeting())


Object.defineProperty(Teacher.prototype, 'constructor', { 
value: Teacher, 
enumerable: false, // so that it does not appear in 'for in' loop
writable: true });

Teacher.prototype.greeting = function() {
    console.log('TEACHER! I\'m ' + this.name.first + '.');
    };
console.log(Teacher.prototype.constructor)

let teacher2 = new Teacher('Dave', 'Griffiths', 31, 'male', ['football', 'cookery'], 'mathematics');
console.log(teacher2 instanceof Person)

