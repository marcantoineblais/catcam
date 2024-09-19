"use client";

import React, { FormEvent } from "react";
import Logo from "../../components/Logo";
import renderPopup from "@/src/utils/renderPopup";
import { useRouter } from "next/navigation";

export default function Login() {
    const [email, setEmail] = React.useState<string>("");
    const [password, setPassword] = React.useState<string>("");
    const [rememberMe, setRememberMe] = React.useState<boolean>(false);
    const router = useRouter();

    async function submitForm(e: FormEvent) {
        e.preventDefault();

        if (!email || !password) {
            renderPopup("All fields are required.", "Warning");
            return;
        }

        const machineID = window.navigator.userAgent;
        const body = {
            machineID: machineID,
            mail: email,
            pass: password,
            rememberMe: rememberMe,
            timezone: new Date().getTimezoneOffset()
        };        
        const response = await fetch(new URL("/login/connect", window.location.origin), {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        
        if (response.ok) {           
            router.push("/");
            
        } else {
            renderPopup(["Invalid password or username.", "Please try again."]);
            setPassword("");
        }
    }

    return (
        <div className="h-full flex flex-col overflow-hidden">
            <main className="h-full px-1 pt-5 max-w-screen-md container mx-auto overflow-auto">
                <form onSubmit={submitForm} className="w-full px-3 py-6 shadow bg-gray-50 rounded dark:bg-zinc-700 dark:shadow-zinc-50/10" autoComplete="on">
                    <h1 className="w-full pb-10 text-center text-3xl paysage-hidden">Login</h1>

                    <label className="flex pt-3">
                        <p className="basis-32 text-sm">Email</p>
                        <input
                            className="px-1.5 grow bg-gray-100 rounded text-sm dark:text-zinc-950"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.currentTarget.value)}
                        />
                    </label>

                    <label className="flex pt-3">
                        <p className="basis-32 text-sm">Password</p>
                        <input
                            className="px-1.5 grow bg-gray-100 rounded text-sm dark:text-zinc-950"
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.currentTarget.value)}
                        />
                    </label>

                    <label className="flex pt-3">
                        <p className="basis-32 text-sm">Remember me</p>
                        <input
                            className="bg-gray-100 rounded"
                            id="remember-me dark:text-zinc-950"
                            name="rememberMe"
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.currentTarget.checked)}
                        />
                    </label>

                    <div className="pt-5 flex justify-center">
                        <button type="submit" className="py-2 w-32 bg-sky-800 text-gray-50 rounded duration-200 hover:bg-sky-700">Submit</button>
                    </div>
                </form>
            </main>

            <Logo className="text-gray-950 dark:text-zinc-200 translate-y-1/2 scale-150 landscape:hidden" />
        </div>
    );
}