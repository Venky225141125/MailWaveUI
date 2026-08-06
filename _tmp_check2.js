const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();

  await page.goto('http://localhost:3000/login/super-admin', { waitUntil: 'networkidle' });
  await page.fill('input[name="username"]', 'superadmin');
  await page.fill('input[type="password"]', 'ChangeMe123!');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1500);

  let apiJson = null;
  page.on('response', async (res) => {
    if (res.url().includes('/superadmin/clients') && res.request().method() === 'GET') {
      try { apiJson = await res.json(); } catch (e) {}
    }
  });

  await page.goto('http://localhost:3000/super-admin/clients', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  console.log('API response:', JSON.stringify(apiJson, null, 2));

  const actionsCellHtml = await page.evaluate(() => {
    const cells = document.querySelectorAll('td');
    const last = cells[cells.length - 1];
    return last ? last.outerHTML : 'NOT FOUND';
  });
  console.log('Last Actions cell HTML:', actionsCellHtml);

  await browser.close();
})().catch((e) => { console.error('SCRIPT ERROR:', e); process.exit(1); });
