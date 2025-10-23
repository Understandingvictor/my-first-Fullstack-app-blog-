// core version + navigation, pagination modules:
import {Swiper, SwiperSlide} from 'swiper/react';
import ShinyText from './shinyText';
import { useState } from "react";
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
// import Swiper and modules styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import "swiper/css/pagination";
import style from "../styles/slider.module.css";

function Myslider(){
    return (
      <div className={style.slider}>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
        >
          <SwiperSlide>
            <h1 className={style.h1}><ShinyText 
  text=" UNRAVEL IT" 
  disabled={false} 
  speed={3} 
  className={style.welcome}
/>
</h1>
          </SwiperSlide>
          <SwiperSlide>
            <h1 className={style.h1}>MAKE IT KNOWN</h1>
          </SwiperSlide>
          <SwiperSlide>
            <h1 className={style.h1}>LET OTHERS LEARN FROM IT</h1>
          </SwiperSlide>
          <SwiperSlide>
            <h1 className={style.h1}>MAKE AN IMPACT</h1>
          </SwiperSlide>
        </Swiper>
      </div>
    );
}
export default Myslider;