const express = require('express');
const fs = require('fs');
const port = process.env.PORT || 3000;
const path = require('path')

const app = express();

app.use((req,res)=>{
	console.log(req.url);
	if(!req.path.includes(".")){
		const newPath = path.join(__dirname,`${req.url}.html`);
		console.log(newPath);
		if(fs.existsSync(path)){
			res.sendFile(newPath);
			return;
		}
	}
	console.log(path.join(__dirname,req.url));

	res.sendFile(path.join(__dirname,req.url));
})

app.use((err,req,res,next)=>{
	console.error(err);
	res.status(err.statusCode).sendFile(path.join(__dirname,`err/${err.statusCode}.html`));
})

app.listen(port, ()=>console.log(`Listening on ${port}`));