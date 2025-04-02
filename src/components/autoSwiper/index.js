import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import {Link} from "react-router-dom";

export default function MainHeroSlider() {
    const slides = [
        {
            id: 1,
            title: "İkinci El Alışverişin Yeni Adresi",
            subtitle: "Güvenle al, kolayca sat",
            image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da",
            cta: "Hemen İlan Ver",
            bgColor: "bg-gradient-to-r from-blue-600 to-blue-800",
            textColor: "text-white",
            link: "/post-advert"
        },
        {
            id: 2,
            title: "Telefon Alım-Satımında Fırsatlar",
            subtitle: "Sıfır ayarında ikinci el telefonlar",
            image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
            cta: "Telefonları Gör",
            bgColor: "bg-gradient-to-r from-purple-500 to-pink-500",
            textColor: "text-white",
            link: "/category/UYG3bKBMUWd1FNauXwvk/sub/Tb2kHribBr21WUA2gNCC"
        },
        {
            id: 3,
            title: "Ev Eşyaları Uygun Fiyatlarla",
            subtitle: "Yakınındaki avantajlı ilanlar",
            image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6",
            cta: "Keşfet",
            bgColor: "bg-gradient-to-r from-amber-500 to-amber-700",
            textColor: "text-white",
            link: "/category/95yT0C0hpf1bjDndStgC"
        },
        {
            id: 4,
            title: "Araçlar Uygun Fiyatlarla",
            subtitle: "Yakınındaki avantajlı ilanlar",
            image: "https://images.unsplash.com/photo-1543465077-db45d34b88a5?q=80&w=3165&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            cta: "Keşfet",
            bgColor: "bg-gradient-to-r from-gray-500 to-red-700",
            textColor: "text-white",
            link: "/category/FecwhXkriZmMzoepLg4E"
        }
    ];

    return (
        <div className="relative w-full h-[300px] md:h-[400px] lg:h-[450px] rounded-lg overflow-hidden shadow-lg mt-4">
            <Swiper
                spaceBetween={0}
                centeredSlides={true}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}


                modules={[Autoplay]}
                className="h-full !w-full relative"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <Link to={slide.link} className="block h-full w-full relative no-underline">
                            <div className={`absolute inset-0 ${slide.bgColor} opacity-90`}></div>
                            <div
                                className="absolute right-0 bottom-0 w-full md:w-1/2 h-full bg-cover bg-center"
                                style={{ backgroundImage: `url(${slide.image})` }}
                            ></div>
                            <div className={`relative h-full flex items-center ${slide.textColor} z-10`}>
                                <div className="container mx-auto px-6">
                                    <div className="max-w-md">
                                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight no-underline">
                                            {slide.title}
                                        </h2>
                                        <p className="text-lg md:text-xl mb-6 opacity-90 no-underline">
                                            {slide.subtitle}
                                        </p>
                                        <button className={`px-8 py-3 rounded-full font-medium text-lg ${slide.textColor.includes('white') ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'} hover:opacity-90 transition`}>
                                            {slide.cta}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </SwiperSlide>
                ))}

                {/* Custom Pagination */}
                <div className="custom-pagination absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2" />


            </Swiper>
        </div>
    );
}