import React from 'react';
import { assets } from '../../assets/assets';

const AboutUs = () => {
  return (
    <div id="about" className="max-w-7xl mx-auto px-6 py-10">

      <div className="relative flex flex-col-reverse md:flex-row items-center justify-center gap-6 md:gap-0">

        <div className="relative w-full md:w-1/2 text-[#055B5C] text-right leading-7 p-4 md:p-6 mt-6 md:mt-0">

          <div className="absolute top-4 left-4 flex flex-col items-start gap-0 -mt-4">
            <img src={assets.lin1} alt="line1" className="w-20 h-auto rotate-0" />
            <img src={assets.lin2} alt="line2" className="w-1 h-16" />
          </div>

          <div className="absolute bottom-4 right-4 flex flex-col-reverse items-end gap-0 -mb-3">
            <img src={assets.lin1} alt="line1" className="w-20 h-auto rotate-0" />
            <img src={assets.lin2} alt="line2" className="w-1 h-16" />
          </div>

          <div className="text-[#055B5C] text-center px-2 cursor-context-menu">
            <h2 className="text-base md:text-xl font-bold mb-3 md:mb-4 leading-tight">
              چرا باشگاه <span className="font-extrabold text-[#055B5C]">فراتن</span> بهترین انتخاب شماست؟
            </h2>
            <p className="text-xs md:text-base font-medium leading-relaxed md:leading-loose">
              در دنیای امروز، حفظ سلامت جسم و روح اهمیت زیادی دارد. باشگاه ورزشی <span className="font-extrabold">فراتن</span> با امکانات مدرن و مربیان مجرب، محیطی امن و حرفه‌ای برای همه سنین و سطوح آمادگی فراهم کرده است
              <br />
              ورزش کردن نه تنها به تناسب اندام و سلامت جسمانی کمک می‌کند، بلکه باعث <span className="font-extrabold">کاهش استرس، افزایش انرژی و بهبود کیفیت زندگی</span> می‌شود. در <span className="font-extrabold">فراتن</span> باور داریم که هر حرکت، یک قدم به سوی زندگی بهتر است
              <br />
              ما با برنامه‌های متنوع و حمایت مستمر از ورزشکاران، انگیزه و همراهی لازم را برای رسیدن به اهداف شما فراهم می‌کنیم. چه بخواهید وزن کم کنید، قدرت‌تان را افزایش دهید یا فقط سالم‌تر زندگی کنید، <span className="font-extrabold">فراتن</span> بهترین همراه شماست
              <br />
              همین امروز به خانواده بزرگ <span className="font-extrabold">فراتن</span> بپیوندید و تغییری مثبت در زندگی‌تان ایجاد کنید
            </p>
          </div>

        </div>

        <div className="w-full md:w-1/2 flex justify-center mt-2 md:mt-0">

          <img
            src={assets.aboutUsPic}
            alt="about us"
            className="w-[240px] md:w-[580px] ml-0 md:ml-[120px]"
          />
        </div>

      </div>

<div className="w-full flex justify-center mt-6">
  <button
    className="bg-[#FF6600] text-white font-extrabold text-xs md:text-base px-6 md:px-20 py-1.5 md:py-2 rounded-full border-2 border-dashed border-[#055B5C] cursor-pointer hover:scale-105 hover:bg-[#e65c00] transition-all duration-300"
  >
    الان وقتشه! وارد دنیای تمرین شو
  </button>
</div>


    </div>
  );
};

export default AboutUs;
