class Person {
    age = 20
    #name = 'bob'
    say = () => {
        console.log(`${this.#name} says hi!`)
    }
}

const p = new Person()
p.say()
//p.#name //will throw error
