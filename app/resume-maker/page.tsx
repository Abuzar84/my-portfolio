'use client'
import Hero from "@/components/resume-compo/hero"
import Resume from "@/components/resume-compo/resume"
import { useState } from "react";

export default function ResumeMaker() {
    const [showForm, setShowForm] = useState(false)
    return (
        <div>

            {!showForm ? (
                <Hero showButton={true} onClick={() => setShowForm(true)} />
            ) : (
                <Resume />
            )}
        </div>
    )
}
