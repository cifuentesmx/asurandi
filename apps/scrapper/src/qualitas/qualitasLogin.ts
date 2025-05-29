import { existsSync, mkdirSync } from 'fs'
import { remote } from "webdriverio";
import { getQualitasCredential } from "./getQualitasCredential.js";


export async function qualitasLogin(saasId: string, accountId: string): Promise<WebdriverIO.Browser> {

    const credentials = await getQualitasCredential(saasId, accountId)
    if (!credentials) throw new Error(`No se pudo obtener las credenciales de la compañia para la cuenta especificada: "${saasId}", agente: "${accountId}"`);

    const downloadDir = `${process.cwd()}/storage/downloads`
    if (!existsSync(downloadDir)) {
        // if it doesn't exist, create it
        mkdirSync(downloadDir, { recursive: true });
    }
    const browser = await remote({
        capabilities: {
            browserName: 'chrome',
            'goog:chromeOptions': {
                args: [
                    'disable-popup-blocking',
                    process.env.NODE_ENV === 'production' ? 'headless' : 'disable-popup-blocking',
                    process.env.NODE_ENV === 'production' ? 'disable-gpu' : 'disable-popup-blocking',
                    // `user-data-dir=${saasId}`,
                ],
                prefs: {
                    "download.default_directory": downloadDir,
                    'download.prompt_for_download': false,
                    'safebrowsing.enabled': true,
                    'directory_upgrade': true,
                    'download.restrictions': 3,
                }
            },
        },
        logLevel: 'warn',
        hostname: process.env.SELENIUM_HOST ?? 'localhost',
        port: Number(process.env.SLENUM_PORT ?? '4444'),
        path: process.env.SELENIUM_PATH ?? '/',
        waitforInterval: 500,
        waitforTimeout: 15_000,
        outputDir: `${process.cwd()}/storage`,
        connectionRetryTimeout: 160_000,
        connectionRetryCount: 3
    })
        .catch(e => {
            console.error(e)
            return null
        })

    if (!browser) throw new Error("No se pudo obtener una session");


    // const page = await browser.getPuppeteer();
    // // Initiate a CDP Session:
    // const cdpSession = await page.target().createCDPSession();
    // // Set the Download Path:
    // await cdpSession.send('Browser.setDownloadBehavior',
    //     {
    //         behavior: 'allow',
    //         downloadPath: downloadDir,
    //     }
    // );

    browser.setWindowSize(1920, 1080)
    await browser.url('https://agentes360.qualitas.com.mx/group/guest/inicio')
    await browser.waitUntil(async () => {
        const btnSubmit = browser.$('button[type="submit"]')
        const dashboard = browser.$('section[id=dashboard]')
        return await btnSubmit.isEnabled() || await dashboard.isExisting()
    })

    if ((await browser.getUrl()).includes('qualitas.com.mx/web/guest/home')) {

        const inputClave = browser.$('input[name="_com_liferay_login_web_portlet_LoginPortlet_login"]')
        const inputCuenta = browser.$('input[name="_com_liferay_login_web_portlet_LoginPortlet_account"]')
        const inputPassword = browser.$('input[name="_com_liferay_login_web_portlet_LoginPortlet_password"]')
        const btnSubmit = browser.$('button[type="submit"]')

        await inputClave.setValue(credentials.agente)
        await inputCuenta.setValue(credentials.cuenta)
        await inputPassword.setValue(credentials.password)
        await btnSubmit.waitForEnabled()

        await btnSubmit.click()

        await browser.waitUntil(async () => {
            const url = await browser.getUrl()
            return url.includes('qualitas.com.mx/group/guest/inicio')
        })

    }
    return browser
}