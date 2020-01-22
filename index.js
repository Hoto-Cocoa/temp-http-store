const URL = require('url');
let store = {};

require('http').createServer(async (req, res) => {
	const url = URL.parse(req.url, true);
	if(!['GET', 'POST'].includes(req.method.toUpperCase())) {
		res.statusCode = 405;
		return res.end();
	}
	if(req.method.toUpperCase() === 'GET') {
		if(store[url.pathname.substring(1)]) {
			const value = store[url.pathname.substring(1)];
			delete store[url.pathname.substring(1)];
			return res.end(value);
		}
		res.statusCode = 404;
		return res.end();
	}
	if(req.method.toUpperCase() === 'POST') {
		let data = '';
		req.on('data', d => data += d);
		return req.on('end', () => {
			const key = Math.random().toString(36).substring(2, 12);
			store[key] = data;
			return res.end(key);
		});
	}
}).listen(process.env.HTS_PORT ? process.env.HTS_PORT : 3000);
