const dns = require('dns');

dns.resolveSrv('_mongodb._tcp.ac-etswess.9ehfrwd.mongodb.net', (err, addresses) => {
    if (err) {
        console.error('SRV Resolve Error:', err);
        return;
    }
    console.log('Resolved Addresses:', addresses);
});
