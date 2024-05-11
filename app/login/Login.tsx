"use client"

import React, { ReactNode } from "react"
import Popup from "../components/Popup"
import Logo from "../components/Logo"

export default function Login({ setSession }: { setSession: Function }) {

    const [alertPopup, setAlertPopup] = React.useState<boolean>(false)

    const formRef = React.useRef<HTMLFormElement|null>(null)
    const submitRef = React.useRef<HTMLButtonElement|null>(null)

    // API call to validate user credential
    // Send user object to AuthManager when user is authorised
    async function submitForm() {
        const form: HTMLFormElement|null = formRef.current
        if (!form)
            return

        const rememberMe: boolean = form.rememberMe.checked
        const baseurl: string = process.env.serverUrl + "/?json=true"
        const email: string = form.email.value
        const password: string = form.password.value
        const machineID: string|null = form.email.value
        
        const body: {
            machineID: string|null,
            mail: string,
            pass: string
        } = {
            machineID: machineID,
            mail: email,
            pass: password
        }
        
        const response = await fetch(baseurl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
        const data = await response.json()
        
        if (data.ok) {
            setSession({ data: data, rememberMe: rememberMe }) 
        } else {
            setAlertPopup(true)
            form.password.value = ""
        }
    }

    function manageKeyUp(e: React.KeyboardEvent) {
        if (e.key === "Enter") {
            submitForm()
        }
    }

    return (
        <div className="h-full px-1 pt-5 max-w-screen-md container mx-auto flex flex-col justify-between items-center" onKeyUp={(e) => manageKeyUp(e)}>
            <form  className="w-full px-3 py-6 shadow bg-gray-50 rounded dark:bg-zinc-700 dark:shadow-zinc-50/10" ref={formRef} autoComplete="on">
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
                    <button className="py-2 w-32 bg-sky-800 text-gray-50 rounded duration-200 hover:bg-sky-700" ref={submitRef} form="login" type="submit" onClick={() => {submitForm()}}>Submit</button>
                </div>
            </form>
            
            <Logo className="text-gray-950 dark:text-zinc-200 translate-y-1/2 scale-150"/>
            { alertPopup && <Popup title="Error" text={["Invalid password or username.", "Please try again."]} action={() => setAlertPopup(false)} /> }
        </div>
    )
}