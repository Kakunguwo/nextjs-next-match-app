import { z } from "zod";

export const editFormSchema = z.object({
    name: z.string().min(3, {message: "Should be a min of 3 characters"}),
    description: z.string().min(3, {message: "Description is required"}),
    city: z.string().min(3, {message: "City is required"}),
    country: z.string().min(2, {message: "Country is required"}),

})


export type EditFormSchema = z.infer<typeof editFormSchema>;