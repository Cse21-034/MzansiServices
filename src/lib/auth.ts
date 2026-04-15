import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";
import { compare } from "@/lib/bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Missing credentials');
          return null;
        }
        
        console.log('🔐 Attempting login for:', credentials.email);
        
        const user = await prisma.user.findUnique({ 
          where: { email: credentials.email } 
        });
        
        if (!user) {
          console.log('❌ User not found');
          return null;
        }
        
        if (!user.password) {
          console.log('❌ User has no password set');
          return null;
        }
        
        const valid = await compare(credentials.password, user.password);
        if (!valid) {
          console.log('❌ Invalid password');
          return null;
        }
        
        console.log('✅ Login successful:', { 
          id: user.id, 
          email: user.email, 
          role: user.role 
        });
        
        // Return user object with role
        return {
          id: user.id,
          name: user.name ?? undefined,
          email: user.email,
          role: user.role,
          image: user.image ?? undefined
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async session({ token, session }) {
      console.log('🔄 Session callback:', { 
        tokenId: token.id, 
        tokenRole: token.role,
        sessionUser: session.user 
      });
      
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.picture as string;
      }
      
      console.log('✅ Final session:', session.user);
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      console.log('🔄 JWT callback:', { 
        trigger, 
        userRole: (user as any)?.role,
        tokenRole: token.role 
      });

      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        console.log('✅ JWT after user signin:', { id: token.id, role: token.role });
        return token;
      }

      // Update token on session update
      if (trigger === "update" && session) {
        token = { ...token, ...session };
        return token;
      }

      // Refresh user data from database on each request
      if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email as string },
          select: {
            id: true,
            role: true,
            name: true,
            email: true,
            image: true,
          }
        });
        
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.name = dbUser.name;
          token.email = dbUser.email;
          token.picture = dbUser.image;
          console.log('✅ JWT refreshed from DB:', { id: token.id, role: token.role });
        } else {
          console.log('❌ User not found in DB for email:', token.email);
        }
      }
      
      return token;
    },
    async redirect({ url, baseUrl }) {
      console.log('🔀 Redirect callback:', { url, baseUrl });
      
      // Allow access to solidacare paths during development
      if (url.includes('/solidacare')) {
        console.log('✅ Allowing redirect to solidacare path');
        return url;
      }

      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  },
  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/login',
  },
  debug: process.env.NODE_ENV === 'development',
};