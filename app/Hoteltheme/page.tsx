'use client';
import { useState } from 'react';
import { AnalyticsTracker } from '@/components/analytics-tracker';
import Link from 'next/link';
import { ArrowLeft, Star, Wifi, Coffee, MapPin, Phone, Mail, Calendar, ChevronRight, Users, Check } from 'lucide-react';

export default function HotelTheme() {
    const [bookingData, setBookingData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        checkIn: '',
        checkOut: '',
        guests: '2 Guests',
        roomType: 'Signature Suite'
    });
    const [isBooked, setIsBooked] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setBookingData(prev => ({ ...prev, [name]: value }));
    };

    const handleBooking = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Booking Data Captured:', bookingData);
        setIsBooked(true);
        setTimeout(() => setIsBooked(false), 5000);
    };

    return (
        <div className="min-h-screen bg-[#faf9f6] text-[#2d2d2d] font-serif selection:bg-[#c5a368] selection:text-white scroll-smooth">
            <AnalyticsTracker page="/Hoteltheme" />

            {/* Navigation */}
            <nav className="fixed top-0 w-full z-100 bg-white/90 backdrop-blur-md border-b border-[#e5e1d8] px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-[#c5a368] hover:text-[#b08e54] transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <span className="text-xl font-bold tracking-[0.2em] uppercase">The Aurelia</span>
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm uppercase tracking-widest font-sans font-medium">
                    <a href="#rooms" className="hover:text-[#c5a368] transition-colors">Rooms</a>
                    <a href="#amenities" className="hover:text-[#c5a368] transition-colors">Amenities</a>
                    <a href="#gallery" className="hover:text-[#c5a368] transition-colors">Gallery</a>
                </div>
                <a href="#booking" className="bg-[#2d2d2d] text-white px-6 py-2 text-sm uppercase tracking-widest hover:bg-[#c5a368] transition-all duration-300 font-sans">
                    Book Now
                </a>
            </nav>

            {/* Hero Section */}
            <header className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/hotel-hero.png"
                        alt="Luxury Hotel Lobby"
                        className="w-full h-full object-cover scale-105 animate-[zoom-out_20s_infinite_alternate]"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                </div>

                <div className="relative z-10 text-center text-white space-y-6 max-w-4xl px-4">
                    <div className="flex justify-center gap-1 mb-4">
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-[#c5a368] text-[#c5a368]" />)}
                    </div>
                    <h1 className="text-5xl md:text-8xl font-bold tracking-tight">Elegance Refined.</h1>
                    <p className="text-lg md:text-2xl font-light italic text-white/90">Experience the pinnacle of luxury in the heart of the city.</p>
                    <div className="pt-8 animate-fade-in-up">
                        <a href="#rooms" className="inline-block border border-white px-10 py-4 text-sm uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all duration-500 backdrop-blur-sm">
                            Explore Suites
                        </a>
                    </div>
                </div>

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
                    <span className="text-white/40 text-[10px] uppercase tracking-[0.5em] -rotate-90 origin-left mb-8">Scroll</span>
                    <div className="w-[1px] h-16 bg-white/20" />
                </div>
            </header>

            {/* Quick Booking Bar */}
            <div id="booking-bar" className="relative z-50 -mt-16 max-w-6xl mx-auto px-4 hidden lg:block">
                <form onSubmit={handleBooking} className="bg-white shadow-2xl p-8 grid grid-cols-5 gap-6 border-b-4 border-[#c5a368]">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-gray-400 font-sans font-bold">Check In</label>
                        <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                            <Calendar className="w-4 h-4 text-[#c5a368]" />
                            <input name="checkIn" value={bookingData.checkIn} onChange={handleInputChange} type="date" className="w-full text-sm font-sans focus:outline-none bg-transparent" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-gray-400 font-sans font-bold">Check Out</label>
                        <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                            <Calendar className="w-4 h-4 text-[#c5a368]" />
                            <input name="checkOut" value={bookingData.checkOut} onChange={handleInputChange} type="date" className="w-full text-sm font-sans focus:outline-none bg-transparent" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-gray-400 font-sans font-bold">Guests</label>
                        <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                            <Users className="w-4 h-4 text-[#c5a368]" />
                            <select name="guests" value={bookingData.guests} onChange={handleInputChange} className="w-full text-sm font-sans focus:outline-none bg-transparent appearance-none">
                                <option>1 Guest</option>
                                <option>2 Guests</option>
                                <option>3 Guests</option>
                                <option>4+ Guests</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-gray-400 font-sans font-bold">Room Type</label>
                        <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                            <Star className="w-4 h-4 text-[#c5a368]" />
                            <select name="roomType" value={bookingData.roomType} onChange={handleInputChange} className="w-full text-sm font-sans focus:outline-none bg-transparent appearance-none">
                                <option>Deluxe Suite</option>
                                <option>Signature Suite</option>
                                <option>Presidential</option>
                            </select>
                        </div>
                    </div>
                    <button className="bg-[#c5a368] text-white font-sans uppercase tracking-[0.2em] text-xs font-bold hover:bg-[#2d2d2d] transition-colors">
                        Check Availability
                    </button>
                </form>
            </div>

            {/* Intro Section */}
            <section className="py-24 px-6 max-w-5xl mx-auto text-center space-y-8">
                <span className="text-[#c5a368] uppercase tracking-[0.4em] text-sm font-sans font-bold">Unforgettable Stays</span>
                <h2 className="text-4xl md:text-6xl font-medium leading-tight">A sanctuary designed for <br /> the modern connoisseur.</h2>
                <div className="w-24 h-[1px] bg-[#c5a368] mx-auto my-12" />
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-sans font-light max-w-3xl mx-auto">
                    From the moment you arrive, The Aurelia surrounds you with unparalleled sophistication. Each suite is a masterpiece of design, blending classical elegance with contemporary comfort.
                </p>
            </section>

            {/* Rooms Section */}
            <section id="rooms" className="py-24 px-6 bg-[#f4f1ea]">
                <div className="max-w-7xl mx-auto space-y-16">
                    <div className="flex justify-between items-end">
                        <div className="space-y-4">
                            <span className="text-[#c5a368] uppercase tracking-[0.4em] text-xs font-sans font-bold">Accommodation</span>
                            <h2 className="text-4xl md:text-5xl font-medium">Signature Suites</h2>
                        </div>
                        <a href="#" className="hidden md:flex items-center gap-2 text-sm uppercase tracking-widest font-sans font-medium border-b border-black pb-1 hover:text-[#c5a368] hover:border-[#c5a368] transition-all">
                            View All Rooms <ChevronRight className="w-4 h-4" />
                        </a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Room 1 */}
                        <div className="group cursor-pointer">
                            <div className="overflow-hidden bg-white shadow-xl">
                                <img
                                    src="/hotel-room-1.png"
                                    alt="The Grand Suite"
                                    className="w-full h-[500px] object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                            </div>
                            <div className="mt-8 space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-3xl font-medium italic">The Grand Ocean View</h3>
                                    <span className="font-sans text-lg font-light">$580 <span className="text-sm text-gray-400">/ Night</span></span>
                                </div>
                                <div className="flex gap-6 text-sm text-gray-500 font-sans uppercase tracking-widest">
                                    <span className="flex items-center gap-2"><Wifi className="w-4 h-4" /> 5G WiFi</span>
                                    <span className="flex items-center gap-2"><Coffee className="w-4 h-4" /> Breakfast</span>
                                </div>
                            </div>
                        </div>

                        {/* Room 2 */}
                        <div className="group cursor-pointer">
                            <div className="overflow-hidden bg-white shadow-xl">
                                <img
                                    src="/hotel-room-2.png"
                                    alt="Forest Spa Suite"
                                    className="w-full h-[500px] object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                            </div>
                            <div className="mt-8 space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-3xl font-medium italic">Zen Forest Retreat</h3>
                                    <span className="font-sans text-lg font-light">$420 <span className="text-sm text-gray-400">/ Night</span></span>
                                </div>
                                <div className="flex gap-6 text-sm text-gray-500 font-sans uppercase tracking-widest">
                                    <span className="flex items-center gap-2"><Wifi className="w-4 h-4" /> 5G WiFi</span>
                                    <span className="flex items-center gap-2"><Star className="w-4 h-4" /> Private Spa</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Amenities */}
            <section id="amenities" className="py-24 px-6 bg-[#2d2d2d] text-white">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    <div className="space-y-4 p-8 border border-white/10 hover:border-[#c5a368] transition-colors">
                        <div className="w-16 h-16 bg-[#c5a368]/20 flex items-center justify-center mx-auto rounded-full">
                            <MapPin className="w-8 h-8 text-[#c5a368]" />
                        </div>
                        <h3 className="text-2xl font-medium italic">Prime Location</h3>
                        <p className="text-gray-400 font-sans font-light">Minutes away from the city's finest cultural landmarks and business districts.</p>
                    </div>
                    <div className="space-y-4 p-8 border border-white/10 hover:border-[#c5a368] transition-colors">
                        <div className="w-16 h-16 bg-[#c5a368]/20 flex items-center justify-center mx-auto rounded-full">
                            <Coffee className="w-8 h-8 text-[#c5a368]" />
                        </div>
                        <h3 className="text-2xl font-medium italic">Michelin Dining</h3>
                        <p className="text-gray-400 font-sans font-light">Taste the extraordinary with menus curated by world-renowned chefs.</p>
                    </div>
                    <div className="space-y-4 p-8 border border-white/10 hover:border-[#c5a368] transition-colors">
                        <div className="w-16 h-16 bg-[#c5a368]/20 flex items-center justify-center mx-auto rounded-full">
                            <Calendar className="w-8 h-8 text-[#c5a368]" />
                        </div>
                        <h3 className="text-2xl font-medium italic">24/7 Concierge</h3>
                        <p className="text-gray-400 font-sans font-light">Your every wish is our command, from private tours to exclusive bookings.</p>
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section id="gallery" className="py-24 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 space-y-12">
                    <div className="text-center space-y-4">
                        <span className="text-[#c5a368] uppercase tracking-[0.4em] text-xs font-sans font-bold">Visual Journey</span>
                        <h2 className="text-4xl md:text-5xl font-medium">The Experience</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[800px]">
                        <div className="md:col-span-8 overflow-hidden group">
                            <img src="/hotel-dining.png" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Dining" />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                        </div>
                        <div className="md:col-span-4 grid gap-6">
                            <div className="overflow-hidden group">
                                <img src="/hotel-spa.png" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Spa" />
                            </div>
                            <div className="overflow-hidden group">
                                <img src="/hotel-hero.png" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Lobby" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final Booking Form */}
            <section id="booking" className="py-24 px-6 bg-[#f4f1ea] border-t border-[#e5e1d8]">
                <div className="max-w-4xl mx-auto bg-white shadow-2xl overflow-hidden flex flex-col md:flex-row">
                    <div className="md:w-1/3 bg-[#2d2d2d] p-12 text-white space-y-8">
                        <h3 className="text-3xl font-medium italic">Reservations</h3>
                        <p className="text-sm font-sans text-gray-400 leading-relaxed font-light">
                            Book direct for exclusive offers and the best available rates. Our concierge is available 24/7.
                        </p>
                        <div className="space-y-4 text-sm font-sans">
                            <p className="flex items-center gap-3"><Phone className="w-4 h-4 text-[#c5a368]" /> +91 1234567890</p>
                            <p className="flex items-center gap-3"><Mail className="w-4 h-4 text-[#c5a368]" /> stay@theaurelia.com</p>
                        </div>
                    </div>
                    <div className="md:w-2/3 p-12">
                        {isBooked ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-fade-in-up">
                                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
                                    <Check className="w-10 h-10 text-green-500" />
                                </div>
                                <h4 className="text-2xl font-medium">Reservation Requested</h4>
                                <p className="text-gray-500 font-sans text-sm">Our concierge will contact you shortly to confirm your stay.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleBooking} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest text-gray-400 font-sans font-bold">First Name</label>
                                        <input name="firstName" value={bookingData.firstName} onChange={handleInputChange} required type="text" className="w-full p-3 border border-gray-100 font-sans text-sm focus:border-[#c5a368] focus:outline-none transition-colors" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest text-gray-400 font-sans font-bold">Last Name</label>
                                        <input name="lastName" value={bookingData.lastName} onChange={handleInputChange} required type="text" className="w-full p-3 border border-gray-100 font-sans text-sm focus:border-[#c5a368] focus:outline-none transition-colors" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-gray-400 font-sans font-bold">Email Address</label>
                                    <input name="email" value={bookingData.email} onChange={handleInputChange} required type="email" className="w-full p-3 border border-gray-100 font-sans text-sm focus:border-[#c5a368] focus:outline-none transition-colors" />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest text-gray-400 font-sans font-bold">Check In</label>
                                        <input name="checkIn" value={bookingData.checkIn} onChange={handleInputChange} required type="date" className="w-full p-3 border border-gray-100 font-sans text-sm focus:border-[#c5a368] focus:outline-none transition-colors" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest text-gray-400 font-sans font-bold">Check Out</label>
                                        <input name="checkOut" value={bookingData.checkOut} onChange={handleInputChange} required type="date" className="w-full p-3 border border-gray-100 font-sans text-sm focus:border-[#c5a368] focus:outline-none transition-colors" />
                                    </div>
                                </div>
                                <button type="submit" className="w-full bg-[#2d2d2d] text-white py-4 font-sans uppercase tracking-[0.3em] text-xs font-bold hover:bg-[#c5a368] transition-all">
                                    Request Reservation
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 px-6 border-t border-[#e5e1d8] bg-white text-[#2d2d2d]">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold tracking-widest uppercase">The Aurelia</h3>
                        <p className="text-sm font-sans text-gray-500 leading-loose">
                            Redefining the art of luxury hospitality for the global elite.
                        </p>
                    </div>
                    <div className="space-y-6">
                        <h4 className="font-sans font-bold uppercase tracking-[0.2em] text-xs">Contact</h4>
                        <div className="space-y-3 font-sans text-sm text-gray-500">
                            <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> +91 1234567890</p>
                            <p className="flex items-center gap-2"><Mail className="w-4 h-4" /> concierge@theaurelia.com</p>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <h4 className="font-sans font-bold uppercase tracking-[0.2em] text-xs">Address</h4>
                        <p className="font-sans text-sm text-gray-500 leading-relaxed">
                            102 Marine Drive, Nariman Point,<br />
                            Mumbai, Maharashtra,<br />
                            400021, India
                        </p>
                    </div>
                    <div className="space-y-6">
                        <h4 className="font-sans font-bold uppercase tracking-[0.2em] text-xs">Newsletter</h4>
                        <div className="flex border-b border-black pb-2">
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="bg-transparent border-none outline-none font-sans text-sm w-full italic"
                            />
                            <button className="text-sm uppercase tracking-widest font-bold">Join</button>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto pt-20 mt-20 border-t border-[#f0eee9] text-center text-xs text-gray-400 font-sans tracking-widest uppercase">
                    © {new Date().getFullYear()} The Aurelia Luxury Hotel. All rights reserved.
                </div>
            </footer>

            <style jsx global>{`
                @keyframes zoom-out {
                    from { transform: scale(1.1); }
                    to { transform: scale(1); }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 1.2s ease-out forwards;
                }
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}
