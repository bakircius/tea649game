import React from 'react';
import { ToastProvider as RadixToastProvider } from '@radix-ui/react-toast';

const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <RadixToastProvider>
            {children}
        </RadixToastProvider>
    );
};

export default ToastProvider;