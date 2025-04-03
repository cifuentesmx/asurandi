import { error } from "@sveltejs/kit"

export const unauthorized = () => {
    return error(401, { message: "Unauthorized" })
}

export const unauthenticated = () => {
    return error(401, { message: "Unauthenticaded" })
}