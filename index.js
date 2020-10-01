const express = require('express');
const port = process.env.PORT || 3000;
const _403 = '/err/403.html'
const _404 = '/err/404.html'
const _500 = '/err/500.html'

const app = express();

app.use('/',express.static('/'));
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