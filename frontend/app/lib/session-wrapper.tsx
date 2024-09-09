"use client"; 

import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";

export function SessionWrapper({ children }: React.PropsWithChildren) {
	useEffect(() => {
		const isDarkMode = localStorage.getItem('darkMode')
		const darkMode = isDarkMode ? JSON.parse(isDarkMode) : false
    document.documentElement.classList.toggle('dark', darkMode);
	}, [])
  return <SessionProvider>{children}</SessionProvider>;
};

