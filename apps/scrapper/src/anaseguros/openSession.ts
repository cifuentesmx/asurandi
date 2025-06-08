import { existsSync, mkdirSync } from 'fs'
import { remote } from "webdriverio";
import { getAnasegurosCredential } from "./getCredential.js";
import { AnasegurosAccountCredential } from "@asurandi/types";

export const openAnasegurosSession = async (saasId: string, accountId: string)
    : Promise<WebdriverIO.Browser> => {
    const credentials: AnasegurosAccountCredential | null = await getAnasegurosCredential(saasId, accountId)
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
    await browser.url('https://anaseguros.com.mx/anaweb/index.html')
    await browser.$('body').waitForStable().catch(() => {
        throw new Error("No se pudo esperar a que el body se cargue")
    })
    await browser.pause(4_000)
    const inicio = browser.$('#Iniciar')
    await inicio.waitForExist().catch(() => {
        throw new Error("No se pudo encontrar el boton de inicio")
    })
    await inicio.waitForClickable().catch(() => {
        throw new Error("No se pudo hacer click en el boton de inicio")
    })
    await inicio.click().catch(() => {
        throw new Error("Error al hacer click en el boton de inicio")
    })
    const login = browser.$('.bodyLogin')
    await login.waitForExist().catch(e => {
        throw new Error("No se pudo encontrar el formulario de login")
    })
    await login.waitForDisplayed().catch(e => {
        throw new Error("No se pudo mostrar el formulario de login")
    })

    await browser.pause(500)

    const theUrl = await browser.getUrl().catch(() => {
        throw new Error("No se pudo obtener la url de la pagina")
    })
    if (theUrl.includes('anaseguros.com.mx/anaweb')) {
        if (credentials) {
            await browser.execute(async (credentials: AnasegurosAccountCredential) => {
                console.log("Executing script", credentials)
                const inputTipoUsuario = document.getElementById('CmbUsuario')
                if (inputTipoUsuario && inputTipoUsuario instanceof HTMLSelectElement) {
                    inputTipoUsuario.value = '1'
                }
                const usuario = document.getElementById('TxtUsuario')
                if (usuario && usuario instanceof HTMLInputElement) {
                    usuario.value = credentials.agente
                }
                const inputPassword = document.getElementById('TxtPassword')
                if (inputPassword && inputPassword instanceof HTMLInputElement) {
                    inputPassword.value = credentials.password
                }
                const btnSubmit = document.getElementById('BtnEntrar')
                await new Promise(resolve => setTimeout(resolve, 2_500))
                if (btnSubmit) {
                    btnSubmit.click()
                }
            }, credentials)
        }

    }
    await browser.pause(2_000)
    const url = await browser.getUrl()
    if (!url.includes('server.anaseguros.com.mx/ananet')) {
        throw new Error("No se pudo iniciar sesion en Anaseguros")
    }
    return browser

}