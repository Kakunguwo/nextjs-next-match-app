import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import authConfig from "./auth.config"
import { prisma } from "./lib/Schemas/prisma"
 

 
export const { handlers: {GET, POST}, auth , signIn, signOut} = NextAuth({
  callbacks: {
    async session({session, token}){
      session.user.id = token.sub;
      return session;
    }
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
})

