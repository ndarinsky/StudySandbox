// function doStuff(data, callback) {
//     callback("done " + data);
// }

// doStuff(true, (result) => console.log("done " + result));

function doStuff(data){
    return new Promise((resolve,reject)=>{
        let successMessage = {
            status: 'success',
            message: 'All well'
        };

        let errorMessage = {
            status: 'error',
            message: 'ups'
        };
        if (typeof data ==='boolean' && data === true){
            resolve(successMessage);
        } else {
            reject(errorMessage);
        }
    });
}

doStuff(true).then(
    (successMessage) => console.log(successMessage),
    (errorMessage) => console.log(errorMessage)
);