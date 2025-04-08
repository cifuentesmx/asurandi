import type { AppOpenAPI } from '@asurandi/types'
// eslint-disable-next-line ts/ban-ts-comment
// @ts-expect-error
import packageJSON from '../../package.json'
import { apiReference } from '@scalar/hono-api-reference'

export default function configureOpenAPI(app: AppOpenAPI): void {
    app.doc('/doc', {
        openapi: '3.0.0',
        info: {
            version: packageJSON.version,
            title: 'Asurandi API',
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
