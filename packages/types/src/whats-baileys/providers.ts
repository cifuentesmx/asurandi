
export type ConnectionStatus = {
    status?: BotStatus,
    timestamp: number
}

export type QrConnection = {
    saasId: string
    base64: string
    timestamp: number
} & ConnectionStatus

export type BotStatus =
    | "preinit"
    | "ready"
    | "waiting-qr"
    | "closed"
    | "initializing"
    | "error";

