'use server';

import { EditFormSchema, editFormSchema } from "@/lib/Schemas/editFormSchema";
import { ActionResult } from "@/types";
import { Member } from "@prisma/client";
import { getAuthId } from "./authActions";
import { prisma } from "@/lib/Schemas/prisma";



export const updateMember = async (data: EditFormSchema): Promise<ActionResult<Member>> => {
    try {
        const userId = await getAuthId();
        const validated = editFormSchema.safeParse(data);

        if(!validated.success){
            return {status: "error", error: validated.error.errors};
        }

        const {name, city, country, description} = validated.data;

        const member = await prisma.member.update({
            where: {userId},
            data: {
                name,
                city,
                country,
                description,
            }
        })

        if(!member){
            return {status: 'error', error: 'Failed to update member!'};
        };

        return {status: "success", data: member};
    } catch (error) {
        console.log(error);
        throw error;
        
    }
}