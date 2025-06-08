import { CRAWLER_URL } from "./env.js";

export class CrawlerRequest {
    private crawlerUrl: string;
    private sessionId: string

    constructor(sessionId: string) {
        this.crawlerUrl = CRAWLER_URL
        this.sessionId = sessionId
    }

    async get(urls: string[], payload: Record<string, unknown>) {
        console.log(this.sessionId)
        const body = {
            urls,
            browser_config: {
                type: 'BrowserConfig',
                params: {
                    headless: true
                }
            },
            crawler_config: {
                type: 'CrawlerRunConfig',
                params: {
                    cache_mode: 'BYPASS',
                    session_id: this.sessionId
                }
            },
            ...payload
        }

        const response = await fetch(`${this.crawlerUrl}/crawl`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        return await response.json()
    }

}