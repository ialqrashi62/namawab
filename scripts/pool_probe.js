const {pool} = require('./db_postgres');
console.log('pool.options.max:', pool.options && pool.options.max);
console.log('pool.totalCount type:', typeof pool.totalCount);
if (typeof pool.totalCount === 'function') {
  console.log('pool.totalCount():', pool.totalCount());
  console.log('pool.idleCount():', pool.idleCount());
  console.log('pool.waitingCount():', pool.waitingCount());
}
console.log('_clients length:', pool._clients ? pool._clients.length : 'N/A');
process.exit(0);
