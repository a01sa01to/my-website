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

function c400(){
	res.status(400).sendFile(path.join(__dirname,`err/400.html`));
}

app.use((req,res)=>{
	console.log(req.url, req.path);
	if(notAllowed.includes(req.path)){
		res.status(404).sendFile(path.join(__dirname,`err/404.html`));
		return;
	}

	if(req.path.includes("data/")){
		res.header('Access-Control-Allow-Origin', '*')

		if(req.query.mode === 'json' && req.path.endsWith('.csv')){
			const filecontent = fs.readFileSync(path.join(__dirname, req.path)).toString();
			const rows = filecontent.replace(/\r/g,'').split("\n");
			const key = rows[0].split(',');
			rows.splice(0,1);
			let fileToJson = rows.map(row=>{
				const _ = row.split(',');
				const __ = {};
				for(let i=0; i<key.length; i++){
					if(String(Number(_[i])) === _[i]){ _[i] = Number(_[i]) }
					__[key[i]] = _[i];
				}
				return __;
			})
			let filt = decodeURIComponent(req.query.filter).split(';')
			filt = filt.map(f => {
				const __ = f.split('__');
				return {
					type: __[0],
					key: __[1],
					mode: __[2],
					val: __[3]
				}
			});
			filt.forEach(_=>{
				switch(_.type){
					case "date":
						if(_.mode === "from"){ fileToJson = fileToJson.filter(__=> new Date(__[_.key]) >= new Date(_.val)); }
						else if(_.mode === "to"){ fileToJson = fileToJson.filter(__=> new Date(__[_.key]) <= new Date(_.val)); }
						else{ c400(); return; }
						break;
					case "num":
						if(_.mode === "over"){ fileToJson = fileToJson.filter(__=> Number(__[_.key]) >= Number(_.val)); }
						else if(_.mode === "under"){ fileToJson = fileToJson.filter(__=> Number(__[_.key]) <= Number(_.val)); }
						else{ c400(); return; }
						break;
					case "str":
						if(_.mode === "eq"){ fileToJson = fileToJson.filter(__=> __[_.key] === _.val); }
						else if(_.mode === "ne"){ fileToJson = fileToJson.filter(__=> __[_.key] !== _.val); }
						else{ c400(); return; }
						break;
					default:
						c400();
						return;
				}
			})
			res.json(fileToJson)
			return;
		}
	}

	if(!req.path.includes(".")){
		const rewritePath = path.join(__dirname,`${req.path}.html`);
		if(fs.existsSync(rewritePath)){
			res.sendFile(rewritePath);
			return;
		}
	}
	res.sendFile(path.join(__dirname,req.path));
})

app.use((err,req,res,next)=>{
	console.error(err);
	res.status(err.statusCode).sendFile(path.join(__dirname,`err/${err.statusCode}.html`));
})

app.listen(port, ()=>console.log(`Listening on ${port}`));