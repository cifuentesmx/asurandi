export type ChatwootConversation = Partial<{
    meta: Partial<{
        sender: Sender;
        channel: string;
        assignee: Assignee;
        hmac_verified: boolean;
    }>;
    id: number;
    messages: unknown[];
    account_id: number;
    uuid: string;
    additional_attributes: unknown;
    agent_last_seen_at: number;
    assignee_last_seen_at: number;
    can_reply: boolean;
    contact_last_seen_at: number;
    custom_attributes: unknown;
    inbox_id: number;
    labels: string[];
    muted: boolean;
    snoozed_until: string | null;
    status: string;
    created_at: number;
    timestamp: number;
    first_reply_created_at: number;
    unread_count: number;
    last_non_activity_message: string | null;
    last_activity_at: number;
    priority: string | null;
    waiting_since: number;
}>;

type Sender = Partial<{
    additional_attributes: unknown;
    availability_status: "offline" | "online";
    email: string | null;
    id: number;
    name: string;
    phone_number: string;
    identifier: string | null;
    thumbnail: string;
    custom_attributes: unknown;
    created_at: number;
}>;

type Assignee = Partial<{
    id: number;
    account_id: number;
    availability_status: "offline" | "online";
    auto_offline: boolean;
    confirmed: boolean;
    email: string;
    available_name: string;
    name: string;
    role: string;
    thumbnail: string;
}>;
