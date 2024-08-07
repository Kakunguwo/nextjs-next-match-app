import { Prisma } from "@prisma/client";
import { ZodIssue } from "zod";

type ActionResult<T> = {status: "success", data: T} | {status: "error", error: string | ZodIssue[]};

type MessageWithSenderRecipient = Prisma.MessageGetPayload<{
    select: {
        id: true,
        text: true,
        createdAt: true,
        dateRead: true,
        sender: {
            select: {userId, name, image}
        },
        recipient: {
            select: {userId, name, image}
        }
    }
}>

type MessageDTO = {
    id: string,
    text: string,
    created: string,
    dateRead: string | null,
    senderName?: string,
    senderId?: string,
    senderImage?: string | null,
    recipientId?: string,
    recipientName?: string,
    recipientImage?: string | null
}

declare module 'jsonwebtoken';