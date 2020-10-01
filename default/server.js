const express = require('express');
const port = process.env.PORT || 3000;
const path = require('path')
const _403 = '403.html'
const _404 = '404.html'
const _500 = '500.html'

const app = express();

app.use((req,res)=>{
	res.sendFile(path.join(__dirname,req.url));
})
app.use((req,res)=>{
	res.status(403).sendFile(path.join(__dirname,'err',_403));
})
app.use((req,res)=>{
	res.status(404).sendFile(path.join(__dirname,'err',_404));
})
app.use((req,res)=>{
	res.status(500).sendFile(path.join(__dirname,'err',_500));
})

app.listen(port, ()=>console.log(`Listening on ${port}`));