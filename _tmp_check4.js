const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const errors = [];
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', (err) => errors.push(String(err)));
  page.on('response', async (res) => {
    if (res.url().includes('/activate') || res.url().includes('/deactivate')) {
      console.log('RESPONSE', res.status(), res.url());
      try { console.log(await res.text()); } catch (e) {}
    }
  });

  await page.goto('http://localhost:3000/login/super-admin', { waitUntil: 'networkidle' });
  await page.fill('input[name="username"]', 'superadmin');
  await page.fill('input[type="password"]', 'ChangeMe123!');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1500);

  await page.goto('http://localhost:3000/super-admin/clients', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.click('button:has-text("Activate")');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'C:/Users/Purna/AppData/Local/Temp/claude/C--Users-Purna/c3c9266d-c24d-4b8f-9cfd-123d59d7a274/scratchpad/04-after-activate.png', fullPage: true });

  console.log('Console/page errors:', errors.join('\n'));
  await browser.close();
})().catch((e) => { console.error('SCRIPT ERROR:', e); process.exit(1); });
