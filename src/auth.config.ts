import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"
import { loginSchema } from "./lib/Schemas/loginSchema"
import { getUserByEmail } from "./app/actions/authActions";
import { compare } from "bcryptjs";
 
export default { providers: [Credentials({
    name: 'credentials',
    authorize: async (creds) => {
        const validated = loginSchema.safeParse(creds);
      
        if (!validated.success) {
          return null;
        }
      
        const { email, password } = validated.data;
      
        const user = await getUserByEmail(email);
      
        if (!user) {
          return null;
        }
      
        const isPasswordValid = await compare(password, user.passwordHash);
      
        if (!isPasswordValid) {
          return null;
        }
      
        // Exclude the passwordHash field from the User object
        const { passwordHash, ...userWithoutPassword } = user;
      
        return userWithoutPassword;
      },
})] ,
} satisfies NextAuthConfig