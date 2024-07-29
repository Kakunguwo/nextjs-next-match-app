import { formatShortDateTime } from "./utils";
import { MessageWithSenderRecipient } from "@/types";

export const mapMessageToMessageDTO = (message: MessageWithSenderRecipient) => {
    return ({
        id: message.id,
        text: message.text,
        created: formatShortDateTime(message.createdAt),
        dateRead: message.dateRead ? formatShortDateTime(message.dateRead) : null,
        senderId: message.sender?.userId,
        senderImage: message.sender?.image,
        senderName: message.sender?.name,
        recipientId: message.recipient?.userId,
        recipientName: message.recipient?.name,
        recipientImage: message.recipient?.image,
    });
}