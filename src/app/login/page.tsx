"use client";

import React, { FormEvent } from "react";
import Logo from "../../components/Logo";
import renderPopup from "@/src/utils/renderPopup";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";

export default function Login() {
    const formRef = React.useRef<HTMLFormElement | null>(null);
    const router = useRouter();


    function saveSession(data: any, rememberMe: boolean) {
        const jwt = {
            auth_token: data.$user.auth_token,
            ke: data.$user.ke,
            uid: data.$user.uid
        };

        setCookie("session", JSON.stringify(jwt), {
            path: "/",
            maxAge: rememberMe ? (3600 * 24 * 30) : undefined,
            httpOnly: true,
            secure: true
        });
    }

    async function submitForm(e: FormEvent) {
        e.preventDefault();

        const form: HTMLFormElement | null = formRef.current;
        if (!form)
            return;

        const rememberMe: boolean = form.rememberMe.checked;
        const apiUrl: string = process.env.API_URL + "/?json=true";
        const email: string = form.email.value;
        const password: string = form.password.value;
        const machineID: string = window.navigator.userAgent;

        const body = {
            machineID: machineID,
            mail: email,
            pass: password
        };

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        if (data.ok) {
            saveSession(data, rememberMe);
            router.push("/");
        } else {
            renderPopup(["Invalid password or username.", "Please try again."]);
            form.password.value = "";
        }
    }

    return (
        <main className="h-full px-1 pt-5 max-w-screen-md container mx-auto flex flex-col justify-between items-center">
            <form onSubmit={(e) => submitForm(e)} className="w-full px-3 py-6 shadow bg-gray-50 rounded dark:bg-zinc-700 dark:shadow-zinc-50/10" ref={formRef} autoComplete="on">
                <h1 className="w-full pb-10 text-center text-3xl paysage-hidden">Login</h1>

                <label className="flex pt-3">
                    <p className="basis-32 text-sm">Email</p>
                    <input className="px-1.5 grow bg-gray-100 rounded text-sm dark:text-zinc-950" name="email"></input>
                </label>

                <label className="flex pt-3">
                    <p className="basis-32 text-sm">Password</p>
                    <input className="px-1.5 grow bg-gray-100 rounded text-sm dark:text-zinc-950" name="password" type="password"></input>
                </label>

                <label className="flex pt-3">
                    <p className="basis-32 text-sm">Remember me</p>
                    <input className="bg-gray-100 rounded" id="remember-me dark:text-zinc-950" name="rememberMe" type="checkbox"></input>
                </label>

                <div className="pt-5 flex justify-center">
                    <button type="submit" className="py-2 w-32 bg-sky-800 text-gray-50 rounded duration-200 hover:bg-sky-700">Submit</button>
                </div>
            </form>

            <Logo className="text-gray-950 dark:text-zinc-200 translate-y-1/2 scale-150" />
        </main>
    );
}