const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(String(err)));

  await page.goto('http://localhost:3000/login/super-admin', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'C:/Users/Purna/AppData/Local/Temp/claude/C--Users-Purna/c3c9266d-c24d-4b8f-9cfd-123d59d7a274/scratchpad/01-login.png' });

  // Try common field selectors
  const userSel = 'input[name="usernameOrEmail"], input[name="username"], input#username, input[type="text"]';
  const passSel = 'input[type="password"]';
  await page.fill(userSel, 'superadmin');
  await page.fill(passSel, 'ChangeMe123!');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'C:/Users/Purna/AppData/Local/Temp/claude/C--Users-Purna/c3c9266d-c24d-4b8f-9cfd-123d59d7a274/scratchpad/02-after-login.png' });

  console.log('URL after login:', page.url());

  await page.goto('http://localhost:3000/super-admin/clients', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'C:/Users/Purna/AppData/Local/Temp/claude/C--Users-Purna/c3c9266d-c24d-4b8f-9cfd-123d59d7a274/scratchpad/03-clients.png', fullPage: true });

  const bodyText = await page.textContent('body');
  console.log('--- Page contains "Activate"?', bodyText.includes('Activate'));
  console.log('--- Page contains "Deactivate"?', bodyText.includes('Deactivate'));
  console.log('--- Console/page errors ---');
  console.log(errors.join('\n'));

  await browser.close();
})().catch((e) => {
  console.error('SCRIPT ERROR:', e);
  process.exit(1);
});
