const express = require('express');
const fs = require('fs');
const port = process.env.PORT || 3000;
const path = require('path')

const app = express();

app.use((req,res)=>{
	if(!req.path.includes(".")){
		const newPath = path.join(__dirname,`${req.path}.html`);
		if(fs.existsSync(path)){
			res.sendFile(newPath);
			return;
		}
	}
	res.sendFile(path.join(__dirname,req.url));
})

app.use((err,req,res,next)=>{
	console.error(err);
	res.status(err.statusCode).sendFile(path.join(__dirname,`err/${err.statusCode}.html`));
})

app.listen(port, ()=>console.log(`Listening on ${port}`));