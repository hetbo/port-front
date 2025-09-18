import "./globals.css";
import NextAuthProvider from "./components/NextAuthProvider";
import Navbar from "./components/Navbar";

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body>
        <NextAuthProvider>
            <Navbar /> {/* <-- Add Navbar here */}
            <main>{children}</main>
        </NextAuthProvider>
        </body>
        </html>
    );
}