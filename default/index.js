const express = require('express');
const port = process.env.PORT || 3000;
const index = '/index.html';
const _403 = '/srv/err/403.html'
const _404 = '/srv/err/404.html'
const _500 = '/srv/err/500.html'

const app = express();

app.use((req,res)=>{
	req.url = "/srv" + req.url
	res.sendFile(req.url);
})
app.use((req,res)=>{
	req.url = `/srv${req.url}.html`
	res.sendFile(req.url);
})
app.use((req,res)=>{
	res.status(403).sendFile(_403);
})
app.use((req,res)=>{
	res.status(404).sendFile(_404);
})
app.use((req,res)=>{
	res.status(500).sendFile(_500);
})

app.listen(port, ()=>console.log(`Listening on ${port}`));