import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getUserByEmail, initTables } from "../../../lib";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Пароль", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Нет email или пароля");
          return null;
        }
        
        console.log(`🔐 Попытка входа: ${credentials.email}`);
        
        await initTables();
        
        const user = await getUserByEmail(credentials.email);
        if (!user) {
          console.log(`❌ Пользователь не найден: ${credentials.email}`);
          return null;
        }
        
        console.log(`👤 Найден пользователь: ${user.email}, ID: ${user.id}`);
        console.log(`🔑 Хэш из БД: ${user.password.substring(0, 30)}...`);
        console.log(`📝 Проверяем пароль: ${credentials.password}`);
        
        const isValid = await bcrypt.compare(credentials.password, user.password);
        console.log(`✅ Результат сравнения: ${isValid}`);
        
        if (!isValid) {
          console.log("❌ Пароль не совпадает");
          return null;
        }
        
        console.log("✅ Авторизация успешна!");
        return { id: user.id, email: user.email, name: user.name };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: "/",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };