// src/components/SwiperSlider.tsx

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper';
import 'swiper/css';
import 'swiper/css/autoplay';

// Import images from your assets
import saas1 from '../assets/images/hero/saas1.jpg';
import saas2 from '../assets/images/hero/saas2.jpg';
import saas3 from '../assets/images/hero/saas3.jpg';

const SwiperSlider = () => {
  const swiperConfig = {
    slidesPerView: 1,
    loop: true,
    spaceBetween: 0,
    autoplay: {
      delay: 3000,
    },
    breakpoints: {
      576: { slidesPerView: 1.2 },
      768: { slidesPerView: 1 },
    },
    roundLengths: true,
  };

  return (
    <Swiper modules={[Autoplay]} {...swiperConfig}>
      {[saas1, saas2, saas3].map((img, index) => (
        <SwiperSlide key={index.toString()}>
          <img src={img} alt="" className="img-fluid rounded-lg" />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default SwiperSlider;
