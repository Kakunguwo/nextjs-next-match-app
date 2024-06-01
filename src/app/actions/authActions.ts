'use server'

import { signIn } from "@/auth";
import { LoginSchema, loginSchema } from "@/lib/Schemas/loginSchema";
import { prisma } from "@/lib/Schemas/prisma";
import { RegisterSchema, registerSchema } from "@/lib/Schemas/registerSchema";
import { ActionResult } from "@/types";
import { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import exp from "constants";
import jwt from "jsonwebtoken";
import { AuthError } from "next-auth";


export const signInUser = async (data: LoginSchema): Promise<ActionResult<string>> => {
    try {
        const result = await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false
        });

        console.log(result);
        

        return {status: 'success', data: "Logged in"}
    } catch (error) {
        console.log(error);
        if(error instanceof AuthError){
            switch (error.type) {
                case 'CredentialsSignin': 
                    return {status: "error", error: "Invalid credentials"}
            
                default:
                    return {status: "error", error: "Something went wrong"}
            }
        } else {
            return {status: "error", error: "Something else went wrong"}
        }
        
    }
}


export const registerUser = async (data: RegisterSchema): Promise<ActionResult<User>> => {
    try {
        const validated = registerSchema.safeParse(data);

        if(!validated.success){
            return {status: "error", error: validated.error.errors}
        }

        const {name, email, password, confirm_pass} = validated.data;

        const existingUser = await prisma.user.findUnique({
            where : {
                email
            }
        });

        if(existingUser){
            return {status: "error",error: "User already exist!"}
        }

        if(password !== confirm_pass){
            return {status: "error" ,error : 'Passwords do not match!'}
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await prisma.user.create({
            data: {
            name,
            email, 
            passwordHash: hashedPassword
        }
        })

        return {status: "success",data: user};

    } catch (error) {
        console.log(error);
        return {status: "error", error: "Something went wrong"}  
    }
    
}


export const getUserByEmail = async (email: string) => {
    return prisma.user.findUnique({
        where: {email}
    })
}

export const getUserById = async (id: string) => {
    return prisma.user.findUnique({
        where: {id}
    })
}

