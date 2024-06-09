'use server';

import { auth } from "@/auth";
import { prisma } from "@/lib/Schemas/prisma";
import { Photo } from "@prisma/client";


//get all members
export const getMembers = async () => {
    const session = await auth();
    if(!session?.user) return null;
    try {
        return prisma.member.findMany({
            where: {
                NOT: {
                    userId: session?.user?.id,
                }
            }
        })
    } catch (error) {
        console.log(error);
    }
}

//get single single member
export const getMemberByUserID = async (userId: string) => {
    try {
        return prisma.member.findUnique({
            where: {userId}
        })
    } catch (error) {
        console.log(error);  
    }
}

//get member photos

export const getMemberPhotosByUserID = async (userId: string) => {
    const member = await prisma.member.findUnique({
        where: {userId},
        select: {photos: true},
    })

    if(!member) return null;

    return member.photos.map(p => p) as Photo[];
}
