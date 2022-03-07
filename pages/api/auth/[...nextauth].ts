import NextAuth from "next-auth"
import Providers from "next-auth/providers";
import { FirebaseAdapter } from "@next-auth/firebase-adapter";
import { db } from '../../../firebase';


export default NextAuth({
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET!,
  adapter: FirebaseAdapter(db)
/*   callbacks: {
    //  session(session,user,token) siempre debe de retornar la session.Cada callback pre-built debe retornar un arg  
    async session({ session, user, token }) {
      session.user.tag = session.user.name?.split(" ")
      .join("-")
      .toLocaleLowerCase();
      session.user!.uid = token.sub;
      return session;
    },
  } */

})