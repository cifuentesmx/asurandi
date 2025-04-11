import { getUser } from "$api/users/getUser"
// import { SECRET_ADMIN_EMAIL } from "$env/static/private"
import type { SaasRole } from "@asurandi/types"

export const hasRole = async (role: SaasRole, locals: App.Locals): Promise<boolean> => {
    try {
        if (locals.authedUser?.email === 'roberto@cloudlotus.net') return true

        if (!locals.saasId || !locals.authedUser?.uid) return false
        const user = await getUser(locals.saasId, locals.authedUser.uid)


        if (!user) return false

        if (user.roles && Array.isArray(user.roles) && user.roles.includes(role)) return true

        return false
    } catch {
        return false
    }
}

export const hasAnyRole = async (roles: SaasRole[], locals: App.Locals): Promise<boolean> => {
    try {
        if (locals.authedUser?.email === 'roberto@cloudlotus.net') return true

        if (!locals.saasId || !locals.authedUser?.uid) return false
        const user = await getUser(locals.saasId, locals.authedUser.uid)

        if (!user) return false

        for (let idx = 0; idx < roles.length; idx++) {
            const role = roles[idx];
            if (user.roles && Array.isArray(user.roles) && user.roles.includes(role)) return true
        }

        return false
    } catch {
        return false
    }
}