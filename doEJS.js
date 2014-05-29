
ejs = require('ejs');

services = {
	serviceA: [
		{ name: 'serverA1', ip: '@ipA1', port: '#portA1' },
		{ name: 'serverA2', ip: '@ipA2', port: '#portA2' }
	],
	serviceB: [
		{ name: 'serverB1', ip: '@ipB1', port: '#portB1' },
		{ name: 'serverB2', ip: '@ipB2', port: '#portB2' }
	]
}

out = ejs.renderFile('haproxy.cfg.ejs', { chiffre: 'deux' }, function (err, result) {
	console.log('output:\n' + result);
});


