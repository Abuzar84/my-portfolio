import { Metadata } from 'next'
import Script from 'next/script'
import PdfEditorClient from './PdfEditorClient'
import { AnalyticsTracker } from '@/components/analytics-tracker'

export const metadata: Metadata = {
    title: 'Free Online PDF Editor | Edit, Annotate & Save PDF',
    description: 'A powerful, free online PDF editor. Add text, resize elements, and download your edited PDF documents instantly. No sign-up required, secure client-side processing.',
    keywords: ['PDF editor', 'online PDF editor', 'edit PDF', 'free PDF tool', 'annotate PDF', 'Abuzar Sayyed'],
    openGraph: {
        title: 'Free Online PDF Editor | Abuzar Sayyed',
        description: 'Edit your PDF documents online for free. Fast, secure, and professional.',
        images: ['/pdf-editor-preview.png'],
    }
}

export default function PdfEditorPage() {
    return (
        <>
            <Script
                src="https://3nbf4.com/act/files/tag.min.js?z=10435650"
                data-cfasync="false"
                strategy="beforeInteractive" // This ensures it stays in the head region effectively
            />
            <AnalyticsTracker page="/pdf-editor" />
            <PdfEditorClient />
        </>
    )
}
