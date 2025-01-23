import React from 'react'
import './globals.css';
import { Theme } from "@radix-ui/themes";
import ToastProvider from './components/ToastProvider';

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>
                <Theme>
                    <ToastProvider>
                        {children}
                    </ToastProvider>
                </Theme>
            </body>
        </html>
    )
}