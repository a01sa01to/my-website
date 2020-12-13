const express = require('express');
const fs = require('fs');
const port = process.env.PORT || 3000;
const path = require('path')
// const axios = require('axios');
const app = express();

const notAllowed = [
	"node_modules/",
	"src/",
	".googleconfig",
	".nojekyll",
	"app.yaml",
	"bundle.js.LICENSE.txt",
	"cloudbuild.yaml",
	"package-lock.json",
	"package.json",
	"server.js",
	"source-context.json",
	"webpack.config.js"
]

app.use((req,res)=>{
	console.log(req.url);
	if(notAllowed.includes(req.path)){
		res.status(404).sendFile(path.join(__dirname,`err/404.html`));
		return;
	}

	if(!req.path.includes(".")){
		const rewritePath = path.join(__dirname,`${req.url}.html`);
		if(fs.existsSync(rewritePath)){
			res.sendFile(rewritePath);
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