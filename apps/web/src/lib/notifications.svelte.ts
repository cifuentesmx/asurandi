import { getContext, setContext } from "svelte";

class Notifications {
    notifications = $state<string[]>([])
    constructor() {
    }


}

const NOTIFICATIONS_KEY = Symbol('NOTIFICATIONS_KEY')

export function setNotificationsState() {
    return setContext(NOTIFICATIONS_KEY, new Notifications())
}

export function getNotificationsState() {
    return getContext<ReturnType<typeof setNotificationsState>>(NOTIFICATIONS_KEY)
}