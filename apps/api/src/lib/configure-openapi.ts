import type { AppOpenAPI } from '@asurandi/types'
import { apiReference } from '@scalar/hono-api-reference'

export default function configureOpenAPI(app: AppOpenAPI): void {
    app.doc('/doc', {
        openapi: '3.0.0',
        info: {
            version: "1.0.0",
            title: 'Whastapp web API',
        },
    })

    app.get("/reference",
        apiReference({
            theme: 'kepler',
            layout: 'modern',
            defaultHttpClient: {
                clientKey: 'fetch',
                targetKey: 'js'
            },
            spec: {
                url: '/doc'
            }

        })
    )
}
