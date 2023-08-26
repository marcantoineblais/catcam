"use client"

import React from "react"
import  secureLocalStorage  from  "react-secure-storage"
import { useRouter } from "next/navigation"

export default function Form() {

    const [ip, setIp] = React.useState(null)
    const formRef = React.useRef<HTMLFormElement|null>(null)
    const submitRef = React.useRef<HTMLButtonElement|null>(null)
    const router = useRouter()

    React.useEffect(() => {
        async function getIpAddress() {
            const res = await fetch("https://api.ipify.org?format=json")
            const data = await res.json()
            setIp(data.ip)
        }

        getIpAddress()
    }, [])

    async function submitForm() {
        const form: HTMLFormElement|null = formRef.current
        if (!form)
            return

        const rememberMe: boolean = form.rememberMe.checked
        const baseurl: string = 'https://catcam.source.marchome.xyz/?json=true'
        const email: string = form.email.value
        const password: string = form.password.value
        const machineID: string|null = ip
        
        
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
        
        if (data.ok && rememberMe) {
            secureLocalStorage.setItem("object", {
                auth_token: data.$user.auth_token,
                ke: data.$user.ke,
                uid: data.$user.uid,    
                ipAddress: ip
            })
            router.push("/")
            return
        } else if (data.ok) {
            sessionStorage.setItem("session", JSON.stringify({
                auth_token: data.$user.auth_token,
                ke: data.$user.ke,
                uid: data.$user.uid,    
                ipAddress: ip
            }))
            router.push("/")
            return
        } else {
            form.password.value = ""
        }
    }

    function manageKeyUp(e: React.KeyboardEvent) {
        if (e.key === "Enter") {
            submitForm()
        }
    }

    return (
        <div className="pt-16 max-w-screen-md container mx-auto" onKeyUp={(e) => manageKeyUp(e)}>
            <form  className="w-full p-5 bg-neutral-50 rounded" ref={formRef} autoComplete="on">
                <h1 className="w-full pb-10 text-center text-3xl">Login</h1>

                <label className="flex pt-3">
                    <p className="w-32">Email</p>
                    <input className="px-3 grow bg-neutral-200 rounded" name="email"></input>
                </label>

                <label className="flex pt-3">
                    <p className="w-32">Password</p>
                    <input className="px-3 grow bg-neutral-200 rounded" name="password" type="password"></input>
                </label>
                
                <label className="flex pt-3">
                    <p className="w-32">Remember me</p>
                    <input className="ml-3 px-3 bg-neutral-200 rounded" id="remember-me" name="rememberMe" type="checkbox"></input>
                </label>
                
                <div className="pt-5 flex justify-center">
                    <button className="py-2 w-32 bg-sky-800 text-neutral-50 rounded duration-200 hover:bg-sky-700" ref={submitRef} form="login" type="submit" onClick={() => {submitForm()}}>Submit</button>
                </div>
            </form>
        </div>
    )
}