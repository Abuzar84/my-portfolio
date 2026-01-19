'use client'
import Hero from "@/components/resume-compo/hero"
import ResumeForm from "@/components/resume-compo/resumeform"
import { useState } from "react";

export default function ResumeMaker() {
    const [showForm, setShowForm] = useState(false)

    return (
        <div>
            {!showForm ? (
                <Hero showButton={true} onClick={() => setShowForm(true)} />
            ) : (
                <ResumeForm />
            )}
        </div>
    )
}
