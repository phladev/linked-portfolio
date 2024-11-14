'use client'

import { SiNextdotjs, SiTypescript, SiMysql, SiMongodb } from 'react-icons/si'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import { FaCss3Alt, FaHtml5, FaJs, FaPhp, FaReact } from 'react-icons/fa'
import {
  DiGit,
  DiJqueryLogo,
  DiNodejsSmall,
  DiPostgresql,
} from 'react-icons/di'
import { RiTailwindCssFill } from 'react-icons/ri'

const Carousel = () => {
  return (
    <Swiper
      spaceBetween={10}
      slidesPerView={4}
      loop={true}
      autoplay={{
        delay: 2000,
        disableOnInteraction: false,
      }}
      modules={[Autoplay]}
    >
      {[
        FaReact,
        SiNextdotjs,
        FaJs,
        SiTypescript,
        DiNodejsSmall,
        RiTailwindCssFill,
        SiMysql,
        SiMongodb,
        DiPostgresql,
        FaPhp,
        DiGit,
        DiJqueryLogo,
        FaHtml5,
        FaCss3Alt,
      ].map((Icon, index) => (
        <SwiperSlide key={index}>
          <div className="flex flex-col items-center text-white">
            <Icon className="text-[40px] md:text-[60px]" />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

export default Carousel
