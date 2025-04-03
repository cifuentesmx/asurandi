import type { MediaUrl, WhatsappMessage } from './types.ts';
export const proceessIncomingWhatsappMessages = async ({
    messages,
    downloadMediaFn }: {
        messages: WhatsappMessage[],
        downloadMediaFn: (message: WhatsappMessage) => Promise<MediaUrl>
    }) => {
    console.log(messages)
}