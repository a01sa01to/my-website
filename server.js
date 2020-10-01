const express = require('express');
const boom = require('@hapi/boom');
const port = process.env.PORT || 3000;
const path = require('path')

const app = express();

app.use((req,res)=>{
	res.sendFile(path.join(__dirname,req.url));
})
app.use((err,req,res,next)=>{
	console.error(err);
	// res.status(err.statusCode).json(err);
	res.status(err.statusCode).sendFile(path.join(__dirname,`err/${err.statusCode}.html`));
})

app.listen(port, ()=>console.log(`Listening on ${port}`));