const puppeteer = require('puppeteer');
const twilioClient = require('./twilioClient');

async function run() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setUserAgent(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36'
    );

    await page.goto('https://skyup.aero/en/');

    await page.waitFor(3000);

    await page.click('.js-cookie-modal-accept');

    // Select deprature сity
    await page.click('#deprtureCity');
    await page.waitFor(1000);
    await page.click('[data-city-code="from_city"]');
    await page.waitFor(1000);

    // Select arrival сity
    await page.click('#arrivalCity');
    await page.waitFor(1000);
    await page.click('[data-city-code="to_city"]');
    await page.waitFor(1000);

    // Select adults
    await page.click('#adultsItem');
    await page.waitFor(1000);
    await page.click('.js-passeng-plus');
    await page.click('.passeng-modal__btn');

    await page.waitFor(1000);

    // Select month
    await findMonth(page);
    await page.waitFor(1000);

    // Click on the Show flights button
    await page.click('.form__search-btn');

    await page.waitForSelector('.tiles', { timeout: 10000, visible: true });

    await page.click('.tile__select-btn');

    await page.waitFor(2000);

    const [, standart] = await page.$$('.js-select-econom-btn');

    await page.waitFor(1000);

    await standart.click();

    await page.waitFor(1000);

    await page.click('#progressNextBtn');

    await page.waitFor(1000);

    // first pass
    const [passengerOneSelectSeat] = await page.$$('[data-service="seat"] .passenger-service__btn');

    await passengerOneSelectSeat.click();
    await page.waitFor(3000);
    await page.click('[data-seat-id="seat_one"]');
    await page.waitFor(2000);

    const [passOneCheckbox] = await page.$$('.seatsel-passeng__checkbox');

    passOneCheckbox.click();

    await page.waitFor(2000);
    await page.click('.seatsel-form__btn-save');

    // second pass
    const [, passengerTwoSelectSeat] = await page.$$('[data-service="seat"] .passenger-service__btn');

    await passengerTwoSelectSeat.click();
    await page.waitFor(3000);

    await page.click('[data-seat-id="seat_two"]');

    await page.waitFor(2000);

    const [, passTwoCheckbox] = await page.$$('.seatsel-passeng__checkbox');

    passTwoCheckbox.click();

    await page.waitFor(2000);

    await page.click('.seatsel-form__btn-save');

    const total = await page.$eval('.js-total-price-total-val', element => element.innerHTML);

    twilioClient.sendSms('to', `from_city - to_city: ${total}`);

    await page.close();
    await browser.close();
}

async function findMonth(page) {
    await page.waitFor(1000);

    await page.click('#forwardDateItem');

    await flipCalendar(page);

    await page.waitFor(1000);

    await page.click('[time="time"]');
}

function flipCalendar(page) {
    return new Promise(resolve => {
        const time = setInterval(async () => {
            const currentMonth = await page.evaluate(() => document.querySelector('.month-element').innerHTML);

            if (currentMonth === 'desired_month') {
                resolve();
                clearInterval(time);
            } else {
                await page.click('.next');
                await page.click('#forwardDateItem');
            }
        }, 1000);
    });
}

run();
