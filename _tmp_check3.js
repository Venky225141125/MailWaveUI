const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();

  await page.goto('http://localhost:3000/login/super-admin', { waitUntil: 'networkidle' });
  await page.fill('input[name="username"]', 'superadmin');
  await page.fill('input[type="password"]', 'ChangeMe123!');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1500);

  await page.goto('http://localhost:3000/super-admin/clients', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.click('button:has-text("Activate")');
  await page.waitForTimeout(1500);

  const statusText = await page.textContent('td:has-text("ACTIVE"), td:has-text("DISABLED")').catch(() => 'n/a');
  console.log('Status cell after clicking Activate:', statusText);
  const actionsBtn = await page.textContent('table tbody tr td:last-child');
  console.log('Actions cell after clicking Activate:', actionsBtn);

  await browser.close();
})().catch((e) => { console.error('SCRIPT ERROR:', e); process.exit(1); });
