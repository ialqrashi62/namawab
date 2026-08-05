// Test for @jumanasoft/pcc-sdk-nodejs
const PccClient = require('./pcc-sdk.js');

(async () => {
  const client = new PccClient({ baseUrl: 'http://localhost:3201' });
  let pass = 0, fail = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log('PASS', name);
      pass++;
    } catch (e) {
      console.log('FAIL', name, '-', e.message);
      fail++;
    }
  }

  await test('health', async () => {
    const h = await client.health();
    if (h.status !== 'ok') throw new Error('not ok');
  });

  await test('catalog', async () => {
    const c = await client.catalog();
    if (c.count !== 1322) throw new Error('count=' + c.count);
  });

  await test('call', async () => {
    const r = await client.call('pcc-cardiology-ext102', 'CardGenExt', { hr: 80 });
    if (typeof r.score !== 'number') throw new Error('no score');
  });

  console.log('---');
  console.log('Total:', pass + fail, 'PASS:', pass, 'FAIL:', fail);
  process.exit(fail === 0 ? 0 : 1);
})();
