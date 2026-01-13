import { Mail, Code2, Database, Smartphone, Layout, Terminal } from 'lucide-react';
import { GithubIcon, LinkedinIcon, FacebookIcon, XIcon, InstagramIcon } from '@/components/social-icons';
import { AnalyticsTracker } from '@/components/analytics-tracker';
import Link from 'next/link';

export default function Home() {
  const skills = [
    { name: "Next.js", icon: <Layout className="w-6 h-6" />, category: "Web" },
    { name: "React", icon: <Code2 className="w-6 h-6" />, category: "Web" },
    { name: "Tailwind CSS", icon: <Layout className="w-6 h-6" />, category: "Style" },
    { name: "Supabase", icon: <Database className="w-6 h-6" />, category: "Backend" },
    { name: "Kotlin", icon: <Smartphone className="w-6 h-6" />, category: "Mobile" },
    { name: "Android Dev", icon: <Smartphone className="w-6 h-6" />, category: "Mobile" },
    { name: "Python", icon: <Terminal className="w-6 h-6" />, category: "Language" },
    { name: "Github", icon: <GithubIcon className="w-6 h-6" />, category: "Tool" },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 transition-colors duration-300">
      <AnalyticsTracker page="/" />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col justify-center items-center px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-200/40 via-white to-white z-0 transition-colors duration-300" />

        <div className="z-10 text-center space-y-8 animate-fade-in-up">
          <div className="relative inline-block">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-30 animate-pulse" />
            <h2 className="relative px-4 py-1.5 rounded-full border border-black/10 bg-white/50 text-sm font-medium tracking-wider uppercase text-indigo-600 backdrop-blur-sm">
              Full Stack Developer
            </h2>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-gray-900 via-gray-800 to-gray-400 pb-2">
            Abuzar Wahadatullah Sayyed
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 leading-relaxed">
            Crafting seamless digital experiences with modern web technologies and native mobile applications.
          </p>

          <div className="flex justify-center gap-4 pt-4">
            <a href="#contact" className="px-8 py-3 rounded-full bg-black text-white font-semibold hover:bg-gray-800 transition-colors">
              Get in touch
            </a>
            <a href="#projects" className="px-8 py-3 rounded-full border border-black/20 hover:bg-black/5 transition-colors backdrop-blur-sm">
              View Work
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
          <div className="w-1 h-12 rounded-full bg-gradient-to-b from-black/0 via-black/50 to-black/0" />
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-24 px-4 bg-gray-50/50 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Technical Arsenal
            </h2>
            <p className="text-gray-600">Buttressed by a robust stack of modern technologies</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="group relative p-6 rounded-2xl bg-white border border-black/5 shadow-sm hover:border-indigo-500/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-indigo-500/0 to-indigo-500/5 rounded-2xl group-hover:via-indigo-500/5 group-hover:to-indigo-500/10 transition-all" />
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <div className="p-3 rounded-xl bg-gray-100 text-gray-700 group-hover:bg-indigo-500/20 group-hover:text-indigo-600 transition-colors">
                    {skill.icon}
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900">{skill.name}</h3>
                  <span className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                    {skill.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 px-4 bg-white transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Featured Projects
            </h2>
            <p className="text-gray-600">Showcasing my latest work and technical endeavors</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group relative rounded-2xl overflow-hidden border border-black/5 bg-gray-50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              < Link href="/pdf-editor" className="absolute inset-0 z-10">
                <span className="sr-only">View PDF Editor Project</span>
              </Link>
              <div className="aspect-video bg-indigo-100 flex items-center justify-center overflow-hidden">
                <img
                  src="/pdf-editor-preview.png"
                  alt="PDF Editor Preview"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-gray-900">PDF Editor</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  A comprehensive tool for editing and managing PDF documents. Features include merging, splitting, and text manipulation.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="px-3 py-1 text-xs rounded-full bg-indigo-100 text-indigo-700">
                    Next.js
                  </span>
                  <span className="px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
                    TypeScript
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Web Themes Section */}
      <section id="themes" className="py-24 px-4 bg-gray-50/50 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-amber-800">
              Premium Web Themes
            </h2>
            <p className="text-gray-600">High-end, production-ready website templates and design systems</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group relative rounded-2xl overflow-hidden border border-black/5 bg-white hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <Link href="/Hoteltheme" className="absolute inset-0 z-10">
                <span className="sr-only">View Hotel Theme</span>
              </Link>
              <div className="p-2 pb-0">
                <div className="rounded-t-xl overflow-hidden border border-gray-200">
                  {/* Browser Header Mockup */}
                  <div className="h-6 bg-gray-100 border-b border-gray-200 flex items-center px-3 gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                  </div>
                  <div className="aspect-[16/10] bg-[#faf9f6] flex items-center justify-center overflow-hidden">
                    <img
                      src="/hotel-hero.png"
                      alt="Hotel Theme Preview"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-gray-900 font-serif">The Aurelia</h3>
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-amber-100 text-amber-800 rounded">Luxury Template</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  A sophisticated, high-end hospitality theme featuring booking systems, room galleries, and elegant typography. Production-ready.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="px-3 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700 font-medium">
                    Next.js 15
                  </span>
                  <span className="px-3 py-1 text-xs rounded-full bg-amber-50 text-amber-700 font-medium">
                    Framer Motion
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer id="contact" className="py-20 px-4 border-t border-black/5 bg-white transition-colors duration-300">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Let's Collaborate</h2>
            <p className="text-gray-600">
              Have a project in mind? I'd love to hear about it.
            </p>
          </div>

          <div className="flex justify-center gap-6">
            {[
              { icon: <GithubIcon className="w-6 h-6" />, href: "https://github.com/Abuzar84", label: "GitHub" },
              { icon: <FacebookIcon className="w-6 h-6" />, href: "https://www.facebook.com/sayyed.abuzar.941349/", label: "Facebook" },
              { icon: <InstagramIcon className="w-6 h-6" />, href: "https://www.instagram.com/sayyedabuzar844/", label: "Instagram" },
              { icon: <XIcon className="w-6 h-6" />, href: "https://x.com/SayyedAbuz46392", label: "X" },
              { icon: <LinkedinIcon className="w-6 h-6" />, href: "https://www.linkedin.com/in/sayyed-abuzar-6ba990279/", label: "LinkedIn" },
              { icon: <Mail className="w-6 h-6" />, href: "mailto:sayyedabuzar021@gmail.com", label: "Email" },
            ].map((social, idx) => (
              <a
                key={idx}
                href={social.href}
                className="p-4 rounded-full bg-gray-100 border border-black/5 hover:bg-gray-200 hover:border-black/20 hover:scale-110 transition-all duration-300 group"
                aria-label={social.label}
              >
                <div className="text-gray-600 group-hover:text-black transition-colors">
                  {social.icon}
                </div>
              </a>
            ))}
          </div>

          <div className="pt-8 text-sm text-gray-600 flex flex-col md:flex-row items-center justify-between gap-4">
            <span>© {new Date().getFullYear()} Abuzar Wahadatullah Sayyed. All rights reserved.</span>
            <Link href="/privacy-policy" className="hover:text-black transition-colors underline underline-offset-4">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
