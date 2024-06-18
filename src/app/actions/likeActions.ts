"use server";

import { prisma } from "@/lib/Schemas/prisma";
import { getAuthId } from "./authActions";


export const toggleLikeMember = async (targetUserId: string, isLiked: boolean) => {
    try {
        const userId = await getAuthId();

        if(isLiked){
            await prisma.like.delete({
                where: {
                    sourceUserId_targetUserId: {
                        sourceUserId: userId,
                        targetUserId
                    }
                }
            })
        } else{
            await prisma.like.create({
                data: {
                    sourceUserId: userId,
                    targetUserId
                }
            })
        }

        
    } catch (error) {
        console.log(error);
        throw error;

    }
}


export const fetchCurrentLikeIds = async () => {
    try {
        const userId = await getAuthId();

        const likeIds = await prisma.like.findMany({
            where: {
                sourceUserId: userId
            },
            select: {
                targetUserId: true
            }
        })

        return likeIds.map(like => like.targetUserId);
    } catch (error) {
        console.log(error);
        throw error;

    }
}

export const fetchLikes = async (type = "source") => {
    try {
        const userId = await getAuthId();

        switch (type) {
            case "source":
               return fetchSourceLikes(userId);
            case "target":
                return fetchTargetLikes(userId);
            case "mutual":
                return fetchMutualLikes(userId);
            default:
             return [];
        }
    } catch (error) {
        console.log(error);
        throw error;
        
    }
}
async function fetchSourceLikes(userId: string) {
    const sourceList = await prisma.like.findMany({
        where: {sourceUserId: userId},
        select: {
            targetMember: true
        }
    })

    return sourceList.map(x => x.targetMember);
}

async function fetchTargetLikes(userId: string) {
    const targetList = await prisma.like.findMany({
        where: {targetUserId: userId},
        select: {sourceMember: true}
    })
    return targetList.map(x => x.sourceMember);
}

async function fetchMutualLikes(userId: string) {
    const likedUsers = await prisma.like.findMany({
        where: {sourceUserId: userId},
        select: {targetUserId: true}
    })
    const likedIds = likedUsers.map(x => x.targetUserId)

    const mutualLikes = await prisma.like.findMany({
        where: {
            AND: [
                {targetUserId: userId},
                {sourceUserId: { in: likedIds}}
            ]
        },
        select: {sourceMember: true}
    });

    return mutualLikes.map(x => x.sourceMember);
}

