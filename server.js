const express = require('express');
const {Server} = require('ws');

// const http = require('https');
const url = require('url');

const PORT = process.env.PORT || 3000;
const INDEX = '/err/400.html';

let list = {};

const server = express()
  	.use((req, res)=>{
		res.sendFile(INDEX, {root: __dirname});
		console.log(req.url)
	})
  	.listen(PORT, ()=>console.log(`Listening on ${PORT}`));

server.on('upgrade', (req, socket, head)=>{
	const path = url.parse(req.url).pathname;
	console.log(path)

	if(list[path]){
		const wss = list[path];
		wss.handleUpgrade(req, socket, head, ws=>{
			wss.emit('connection', ws, req)
		})
	}
	else{
		const wss = new Server({noServer: true});

		wss.on('connection', ws=>{
			console.log('Client connected');
			ws.on("message", (data)=>{
				if(data !== "[keeping connection... ignore this...]vi-+@Ba9U8ot0oD2_i*rIcusW"){
					wss.clients.forEach(cli=>{
						if(cli !== ws){
							cli.send(data);
						}
					})
				}
			})
			ws.on('close', ()=>console.log('Client disconnected'));
		});

		wss.handleUpgrade(req, socket, head, ws=>{
			wss.emit('connection', ws, req)
		})

		list[path] = wss;
	}
})

setInterval(()=>{
	for (const key in list) {
		if (list.hasOwnProperty(key)) {
			const e = list[key];
			let _ = 0;
			e.clients.forEach(c=>{
				_++;
			})
			console.log(key, _);
			if(_ === 0){
				console.log("Remove");
				delete list[key]
			}
		}
	}
}, 5000)