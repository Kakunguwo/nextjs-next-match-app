'use server'

import { prisma } from "@/lib/Schemas/prisma";
import { RegisterSchema, registerSchema } from "@/lib/Schemas/registerSchema";
import bcrypt from "bcryptjs";

export async function registerUser(data: RegisterSchema) {
    const validated = registerSchema.safeParse(data);

    if(!validated.success){
        return {error: validated.error.errors}
    }

    const {name, email, password, confirm_pass} = validated.data;

    const existingUser = await prisma.user.findUnique({
        where : {
            email
        }
    });

    if(existingUser){
        return {error: "User already exist!"}
    }

    if(password !== confirm_pass){
        return {error : 'Passwords do not match!'}
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return prisma.user.create({
        data: {
        name,
        email, 
        passwordHash: hashedPassword
    }
    })

    
}