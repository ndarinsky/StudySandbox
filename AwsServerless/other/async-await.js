function doSmth(data){
    return new Promise((resolve,reject) => {
        setTimeout(()=>{
            if(typeof data == 'number') {
                resolve(data * data);
            } else {
                reject ("error");
            }
        }, 1000);
    })
}

async function chainStuff(){
    let a = await doSmth(2); //wait for promise resolve or throws error
    let b = await doSmth(a); //wait for promise resolve or throws error
    let c = await doSmth(b); //wait for promise resolve or throws error
    return c;
}

chainStuff().then(result => {
    console.log(result)
}).catch(error=>{
    console.log(error)
})