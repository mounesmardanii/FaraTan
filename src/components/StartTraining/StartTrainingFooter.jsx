import React from "react";
import { FaInstagram } from "react-icons/fa";
import { motion } from "framer-motion";

function StartTrainingFooter() {
  const hoverItem = {
    initial: { scale: 1 },
    whileHover: { scale: 1.05, x: -3 },
    transition: { type: "spring", stiffness: 200, damping: 25 },
  };

  return (
    <footer id="footer" className="text-right px-6 md:px-12 py-12 mt-16 mb-0">
      <motion.div
        className="mx-auto h-[2px] w-full max-w-7xl bg-[#FF6600] rounded-full"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 0.8 }}
        style={{ transformOrigin: "left" }}
      />
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10 mt-6">
        <motion.div
          className="w-full md:w-1/3 flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-[#FF6600] font-extrabold text-2xl md:text-3xl mb-3 text-left">
            باشگاه فراتن
          </h2>
          <p className="text-[#055B5C] text-[15px] md:text-[17px] leading-relaxed mb-4 max-w-md">
            همراه حرفه‌ای تو برای ساختن زندگی سالم‌تر 💪
            <br />
            !ما اینجاییم تا هر روز قوی‌تر از دیروز باشی
          </p>
          <motion.a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{
              scale: 1.15,
              rotate: 10,
              transition: { duration: 0.4 },
            }}
            className="w-10 h-10 flex items-center justify-center mx-auto rounded-full border border-[#055B5C] shadow-sm text-[#FF6600] hover:bg-[#055B5C] hover:text-white transition-all duration-300"
          >
            <FaInstagram className="w-5 h-5" />
          </motion.a>
        </motion.div>

        <div className="w-full md:w-2/3 flex flex-col sm:flex-row justify-between gap-6 mt-10 md:mt-0">
          <motion.div
            className="rounded-xl px-4 py-5 w-full sm:w-1/2 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-[#055B5C] font-extrabold mb-3 border-b border-dashed border-[#055B5C] pb-1 text-[16px] md:text-lg">
              اطلاعات تماس
            </h3>
            <ul className="space-y-3 text-[#055B5C] text-[15px] md:text-[16px] font-medium mt-3">
              {[
                "آدرس باشگاه: بابل، میدان بزاز، فیضیه ۷، جنب تالار کریم‌نژاد",
                "شماره تماس: ۰۹۱۱۴۰۰۲۶۶۶",
                "ساعات کاری: زوج‌ها ۸ تا ۲۲ / فردها ۸ تا ۱۰:۳۰",
              ].map((item, index) => (
                <motion.li
                  key={index}
                  className="flex items-center justify-center gap-2 cursor-pointer"
                  {...hoverItem}
                >
                  <span>{item}</span>
                  <span className="w-2 h-2 bg-[#055B5C] rounded-full mt-1"></span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="rounded-xl px-4 py-5 w-full sm:w-1/2 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h3 className="text-[#055B5C] font-extrabold mb-3 border-b border-dashed border-[#055B5C] pb-1 text-[16px] md:text-lg">
              دسترسی سریع
            </h3>
            <ul className="space-y-2 text-[#055B5C] text-[15px] md:text-[16px] font-medium mt-3">
              {[{ label: "ثبت‌نام و ورود", link: "#auth" }].map(
                (item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-center justify-center gap-2 cursor-pointer"
                    {...hoverItem}
                  >
                    <a href={item.link} className="flex items-center gap-2">
                      <span>{item.label}</span>
                      <span className="w-2 h-2 bg-[#055B5C] rounded-full mt-1"></span>
                    </a>
                  </motion.li>
                )
              )}
            </ul>
          </motion.div>
        </div>
      </div>
      <motion.div
        className="mt-10 mx-auto h-[2px] w-full max-w-7xl bg-[#FF6600] rounded-full"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 0.8 }}
        style={{ transformOrigin: "right" }}
      />
    </footer>
  );
}

export default StartTrainingFooter;
