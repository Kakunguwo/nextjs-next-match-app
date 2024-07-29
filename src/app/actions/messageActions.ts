'use server';

import { MessageSchema, messageSchema } from "@/lib/Schemas/messageSchema";
import { ActionResult } from "@/types";
import { getAuthId } from "./authActions";
import { prisma } from "@/lib/Schemas/prisma";
import { mapMessageToMessageDTO } from "@/lib/mappings";
import { log } from "console";

export const createMessage = async (recipientUserId: string, data: MessageSchema): Promise<ActionResult<MessageSchema>> => {
    try {
        const userId = await getAuthId();

        const validated = messageSchema.safeParse(data);

        if(!validated.success) return {status: "error", error: validated.error.errors};

        const {text} = validated.data;

        const message = await prisma.message.create({
            data: {
                text,
                recipientId: recipientUserId,
                senderId: userId,
            }
        });

        return {status:"success", data: message};
    } catch (error) {
        console.log(error);
        return {status: "error", error: "Something went wrong"};
    }
};

export const getMessageThread = async (recipientUserId: string) => {
    try {
        const userId = await getAuthId();

        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    {
                        senderId: userId,
                        recipientId: recipientUserId,
                        senderDeleted: false
                    }, {
                        senderId: recipientUserId,
                        recipientId: userId,
                        recipientDeleted: false
                    }
                ]
            }, 
            orderBy: {
                createdAt: "asc"
            },
            select: {
                id: true,
                text: true,
                createdAt: true,
                dateRead: true,
                sender: {
                    select:{
                        userId: true,
                        name: true,
                        image: true
                    }
                },
                recipient: {
                    select: {
                        userId: true,
                        name: true,
                        image: true,
                    }
                }
            }
        })

        if(messages.length > 0){
            await prisma.message.updateMany({
                where: {
                    senderId: recipientUserId,
                    recipientId: userId,
                    dateRead: null
                },
                data: {dateRead: new Date()}
            })
        }

        return messages.map(message => mapMessageToMessageDTO(message))
    } catch (error) {
        console.log(error);
        throw error;
        
    }
}


export const getMessageByContainer = async (container: string) => {
    try {
        const userId = await getAuthId();

        const conditions = {
            [container === 'outbox'? 'senderId': 'recipientId']: userId,
            ...(container === 'outbox'? {senderDeleted: false} : {recipientDeleted: false})
        }

        const messages = await prisma.message.findMany({
            where: conditions, 
            orderBy: {
                createdAt: 'desc'
            },
            select : {
                id: true,
                text: true,
                createdAt: true,
                dateRead: true,
                sender: {
                    select:{
                        userId: true,
                        name: true,
                        image: true
                    }
                },
                recipient: {
                    select: {
                        userId: true,
                        name: true,
                        image: true,
                    }
                }
            }
        });

        return messages.map(message => mapMessageToMessageDTO(message));
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const deleteMessage = async (messageId: string, isOutbox: boolean) => {
    const selector = isOutbox ? 'senderDeleted': 'recipientDeleted';
    try {
        const userId = await getAuthId();

        await prisma.message.update({
            where: {id: messageId},
            data: {
                [selector]: true
            }
        });

        const messagesToDelete = await prisma.message.findMany({
            where: {
                OR: [
                    {
                        senderId: userId,
                        senderDeleted: true,
                        recipientDeleted: true
                    },
                    {
                        recipientId: userId,
                        senderDeleted: true,
                        recipientDeleted: true
                    }
                ]
            }
        });

        if(messagesToDelete.length > 0){
            await prisma.message.deleteMany({
                where: {
                    OR: messagesToDelete.map(m => ({id: m.id}))
                }
            })
        }
    } catch (error) {
        console.log(error);
        throw error; 
        
    }
}