const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.get('/', (req, res)=> {
    res.send("test Server");
})

app.post('/hello', (req,res)=>{
    let body = req.body;
    body.message = "Hello " + body.name;

    res.json(body);
})

app.listen(3000, ()=>{
    console.log("Server listening on port 3000");
})