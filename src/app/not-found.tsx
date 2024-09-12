"use client"

import Logo from "@/src/components/Logo";
import renderPopup from "@/src/utils/renderPopup";
import { useRouter } from "next/navigation";
import React from "react";

export default function FourOFour() {

    const router = useRouter();

    React.useEffect(() => {4
        renderPopup(["Well well well...", "Looks like someone strayed too far.", "Let's get you back home."], "Error 404");
        router.push("/");
    }, [])

    return <Logo />
}