import React from 'react';
import { assets } from '../../assets/assets';

function AuthPromptSection() {
  return (
    <div className="bg-white px-4 py-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="w-full md:w-2/3 flex justify-center md:justify-start">
          <img src={assets.bottompic} alt="signup illustration" className="max-w-full h-auto" />
        </div>

        <div className="w-full md:w-1/3 flex justify-center md:justify-end">
          <button className="bg-[#055B5C] text-white text-sm md:text-base font-bold px-8 md:px-12 py-2 md:py-3 rounded-full transition-all duration-300 cursor-pointer hover:bg-[#044A4B] hover:scale-105 text-center">
            (: اکانت داری؟ وارد شو! نداری؟ همین حالا بسازش
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthPromptSection;