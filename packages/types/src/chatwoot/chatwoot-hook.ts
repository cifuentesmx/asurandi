export type ChatwootHookMessage = Partial<{
    account: Account;
    additional_attributes: unknown;
    content_attributes: unknown;
    content_type: "text" | "video" | "audio" | "image";
    content: string;
    conversation: Partial<Conversation>;
    created_at: string;
    id: number | null;
    inbox: Inbox;
    inbox_id: number;
    message_type: "incoming" | "outgoing";
    private: boolean;
    sender: CWHookSender;
    source_id: string | null;
    event:
    | "conversation_created"
    | "conversation_status_changed"
    | "conversation_updated"
    | "message_created"
    | 'contact_updated'
    | "message_updated";
    changed_attributes: {
        assignee_id?: Change<number>;
        updated_at?: Change<string>;
        status: Change<"open" | "close" | "resolved">;
    }[];
}>;

type Change<T> = {
    previous_value: T;
    current_value: T;
};

export type CWHookSender = Partial<{
    account: unknown;
    additional_attributes: unknown;
    avatar: string;
    custom_attributes: unknown;
    email: string | null;
    id: number | null;
    identifier: string | null;
    name: string;
    phone_number: string;
    thumbnail: string;
}>;
export type Account = Partial<{
    id: number | null;
    name: string;
}>;

export type Inbox = Partial<{
    id: number | null;
    name: string;
}>;

export type Conversation = Partial<{
    additional_attributes: unknown;
    can_reply: boolean;
    channel: "Channel::Api" | string;
    contact_inbox: ContactInbox;
    id: number | null;
    inbox_id: number | null;
    messages: Message[];
    labels: string[];
    meta: MessageMeta;
    status: string;
    custom_attributes: unknown;
    snoozed_until: unknown;
    unread_count: number;
    first_reply_created_at: unknown;
    priority: unknown;
    waiting_since: number;
    agent_last_seen_at: number;
    contact_last_seen_at: number;
    timestamp: number;
    created_at: number;
}>;

export type ContactInbox = Partial<{
    id: number;
    contact_id: number;
    inbox_id: number;
    source_id: string;
    created_at: string;
    updated_at: string;
    hmac_verified: boolean;
    pubsub_token: string;
}>;

export type Message = Partial<{
    id: number;
    content: string;
    account_id: number;
    inbox_id: number;
    conversation_id: number;
    message_type: number;
    created_at: number;
    updated_at: string;
    private: boolean;
    status: "sent";
    source_id: null;
    content_type: "text";
    content_attributes: unknown;
    sender_type: "Contact";
    sender_id: 49;
    external_source_ids: unknown;
    additional_attributes: unknown;
    processed_message_content: string;
    sentiment: unknown;
    attachments: Attachment[];
    conversation: Partial<{
        assignee_id: number;
        unread_count: number;
        last_activity_at: number;
        contact_inbox: Partial<{
            source_id: string;
        }>;
    }>;
    sender: Partial<{
        additional_attributes: unknown;
        custom_attributes: unknown;
        email: string | null;
        id: number;
        identifier: string | null;
        name: string;
        phone_number: string;
        thumbnail: string;
        type: string;
    }>;
}>;

export type Attachment = {
    id: number;
    message_id: number;
    file_type: "file" | unknown;
    account_id: number;
    extension?: unknown;
    data_url?: string;
    thumb_url?: string;
    file_size?: number;
};

export type MessageMeta = Partial<{
    sender: MessageMetaSender;
    assignee: MessageMetaAssignee;
    team: number | null;
    hmac_verified: boolean;
}>;

export type MessageMetaSender = Partial<{
    additional_attributes: {
        city: string;
        country: string;
        description: string;
        company_name: string;
        country_code: string;
        social_profiles: unknown[];
    };
    custom_attributes: unknown;
    email: string | null;
    id: number;
    identifier: string | null;
    name: string | string;
    phone_number: string;
    thumbnail: string;
    type: string;
}>;

export type MessageMetaAssignee = Partial<{
    id: number;
    name: string;
    available_name: string;
    avatar_url: string;
    type: "user" | string;
    availability_status: string | null;
    thumbnail: string;
}>;
