import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "./dbConnection";
import bcrypt from 'bcrypt';
import GoogleProvider from "next-auth/providers/google";
import User from "@/models/user";
import { pusherClient } from "./pusher";


const getGoogleCredentials = () => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const cliendSecret = process.env.GOOGLE_CLIENT_SECRET;
    if (!clientId || clientId.length === 0) {
        throw new Error('Missing GOOGLE_CLIENT_ID');
    }
    if (!cliendSecret || cliendSecret.length === 0) {
        throw new Error('Missing GOOGLE_CLIENT_SECRET');
    }

    return { clientId, cliendSecret }
}

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: '/login'
    },
    callbacks: {
        async jwt({ token, user }) {
            const client = await connectDB();
            const email = token.email;
            const usersCollection = client.connection.db
                .collection("users");
            const dbUser = await User.findOne({ email: email });
            if (!dbUser) {
                const newUser = await User.create({
                    name: token.name,
                    email: token.email,
                    image: token.picture,
                    requests: [],
                    friends: []

                });
                await newUser.save();
                token.id = user?.id
                return token
            }
            return {
                id: dbUser._id,
                name: dbUser.name,
                email: dbUser.email,
                picture: dbUser.image,
                requests: dbUser.requests,
                friends: dbUser.friends
            }


        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id
                session.user.name = token.name
                session.user.email = token.email
                session.user.image = token.picture
                session.user.requests = token.requests
                session.user.friends = token.friends
            }
            return session
        },
        redirect() {
            return '/dashboard/add'
        }
    },
    providers: [
        GoogleProvider({
            clientId: getGoogleCredentials().clientId,
            clientSecret: getGoogleCredentials().cliendSecret,
        }),
        // CredentialsProvider({
        //     id: "credentials",
        //     credentials: {
        //         email: {
        //             label: "E-mail",
        //             type: "text",
        //         },
        //         password: {
        //             label: "Password",
        //             type: "password",
        //         },
        //     },
        //     async authorize(credentials) {
        //         const client = await connectDB();
        //         const usersCollection = client.connection.db
        //             .collection("users");
        //         const email = credentials?.email.toLowerCase();
        //         const user = await usersCollection.findOne({ email });
        //         if (!user) {
        //             throw new Error("User does not exist.");
        //         }

        //         //validate password
        //         const passwordIsValid = await bcrypt.compare(
        //             credentials?.password!,
        //             user.password
        //         );

        //         if (!passwordIsValid) {
        //             throw new Error("Invalid credentials");
        //         }

        //         return {
        //             id: user._id.toString(),
        //             ...user,
        //         };
        //     },
        // }),

        // ...add more providers here
    ],

}   