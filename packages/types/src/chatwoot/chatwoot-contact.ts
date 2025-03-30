import type { ChatwootInbox } from "./chatwoot-inbox.js";

// api/v1/accounts/{account_id}/contacts/search
export type SearchContactResponse = {
    meta: { count: number; current_page: number };
    payload: Partial<Contact>[];
};

export type Contact = {
    additional_attributes?: unknown;
    availability_status?: "offline" | "online";
    email: string | null;
    id: number;
    name: string;
    phone_number: string;
    identifier: null;
    thumbnail: string;
    custom_attributes: unknown;
    last_activity_at: string;
    created_at: string;
    contact_inboxes: { source_id: string; inbox: Partial<ChatwootInbox> }[];
    contact_inbox: { source_id: string; inbox: Partial<ChatwootInbox> };
};
