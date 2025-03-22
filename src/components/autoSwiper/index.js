import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules'; // Modülleri doğru şekilde içe aktar
import 'swiper/css';


export default function AutoSwiper() {
    return (
        <Swiper
            spaceBetween={30} // Slaytlar arası boşluk
            centeredSlides={true} // Slaytları ortalasa
            autoplay={{
                delay: 4000, // 3 saniyede bir geçiş yapar
                disableOnInteraction: false, // Kullanıcı etkileşiminde otomatik döngüyü durdurma
            }}

            modules={[Autoplay, Pagination, Navigation]}
            className="!w-full mt-4"
        >
            <SwiperSlide>
                <div className="w-full h-full bg-red-600">
                    Slide 1
                </div>
            </SwiperSlide>
            <SwiperSlide>
                <div className="w-full h-full bg-blue-600">
                    Slide 2
                </div>
            </SwiperSlide>
            <SwiperSlide>
                <div className="w-full h-full bg-green-400">
                    Slide 3
                </div>
            </SwiperSlide>
            <SwiperSlide>
                <div className="w-full h-full bg-gray-500">
                    Slide 4
                </div>
            </SwiperSlide>
        </Swiper>
    );
};
