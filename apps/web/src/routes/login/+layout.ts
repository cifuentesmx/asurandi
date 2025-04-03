export const load = async ({ url }) => {
    let redirect = ''
    const redirectQuery = url.searchParams.get('redirect')
    const sessionClosed = url.searchParams.get('session_closed')
    const expired = url.searchParams.get('expired')
    if (redirectQuery) {
        redirect = redirectQuery
        url.searchParams.forEach((param: any, id: string) => {
            if (id !== 'redirect' && id !== 'session_closed' && id !== 'expired') {
                redirect += `&${id}=${param}`
            }
        });

    } else {
        redirect = '/app'
    }

    return { redirect, sessionClosed, expired }
}