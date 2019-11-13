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

doSmth(2).then( result => {
    console.log(result)
    return result;
})
.then( a => doSmth("a"))
.then(b => console.log(b)) 
.catch(error => {
    console.log(error);
})