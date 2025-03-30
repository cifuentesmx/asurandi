export type AvailableAgent = {
    id: number
    account_id: number
    availability_status: 'offline' | 'online',
    auto_offline: boolean
    confirmed: boolean
    email: string
    available_name: string
    name: string
    role: 'agent' | 'administrator',
    thumbnail: string
}