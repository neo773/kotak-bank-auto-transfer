import type { Page } from "puppeteer";

const clickButton = async (page: Page, selector: string) => {
  await page.waitForSelector(selector);
  await page.evaluate((sel) => {
    const button = document.querySelector(sel);
    if (button instanceof HTMLElement) {
      button.click();
    }
  }, selector);
};

const clickElementWithText = async (
  page: Page,
  selector: string,
  text: string
) => {
  await page.waitForSelector(selector);

  await page.waitForNetworkIdle({ idleTime: 500, timeout: 30000 });

  await page.evaluate(
    (sel, txt) => {
      const elements = document.querySelectorAll(sel);
      for (const el of Array.from(elements)) {
        if (
          el instanceof HTMLElement &&
          el.textContent?.toLowerCase().includes(txt.toLowerCase())
        ) {
          el.click();
          break;
        }
      }
    },
    selector,
    text
  );

  await page.waitForNetworkIdle({ idleTime: 500, timeout: 30000 });
};

export { clickButton, clickElementWithText };
