import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../AdminSidebar';
import AdminHeader from '../AdminHeader';

import { membership, general, private1 } from '../../assets/assets';

function Courses() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();



    const courseStats = [
        { title: 'VIP', path: '/courses/vip', img: membership },
        { title: 'عمومی', path: '/courses/general', img: general },
        { title: 'خصوصی', path: '/courses/private', img: private1 },
    ];

    const fadeIn = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
    };


    useEffect(() => {
        if (!sidebarOpen) return;

        const scrollY = window.scrollY;
        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollY}px`;
        document.body.style.left = "0";
        document.body.style.right = "0";
        document.body.style.width = "100%";

        return () => {
            const y = -parseInt(document.body.style.top || "0", 10);
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.left = "";
            document.body.style.right = "";
            document.body.style.width = "";
            window.scrollTo(0, y);
        };
    }, [sidebarOpen]);

    return (
        <div className="min-h-screen bg-white font-sans flex flex-col relative">
            <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

            <div className="flex flex-1 relative mt-4">
                <aside className="hidden md:flex mt-3 w-64 z-30 border-t-[3px] border-r-[3px] border-[#055B5C] rounded-tr-[75px]">
                    <AdminSidebar />
                </aside>
                <motion.aside
                    initial={{ x: "-100%" }}
                    animate={{ x: sidebarOpen ? 0 : "-100%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed md:hidden left-0 top-29 h-[calc(100vh-5rem)] z-50 w-[275px]
             bg-[#D1E7D8] border-r-[3px] border-[#055B5C] rounded-tr-[75px]
             p-6 overflow-y-auto"
                >
                    <AdminSidebar />
                </motion.aside>


                {sidebarOpen && (
                    <button
                        type="button"
                        className="fixed md:hidden left-0 right-0 top-[7.4rem] bottom-0 z-40 bg-black/50 overscroll-none touch-none"
                        onClick={() => setSidebarOpen(false)}
                        aria-label="بستن منو"
                    />
                )}

                <main
                    className={`flex-1 p-10 md:p-10 relative z-10 overflow-y-auto border-t-[3px] border-l-[3px] border-[#FF7A00] rounded-tl-[75px] bg-white
            flex flex-col items-center justify-start text-right mt-3 ml-10
            ${sidebarOpen ? 'pointer-events-none select-none' : ''}
          `}
                    style={{ minHeight: 'auto' }}
                >
                    <motion.div
                        className="flex flex-col md:flex-row items-center md:items-start justify-center gap-6 w-full max-w-4xl mt-6 md:mt-20"
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                    >
                        {courseStats.map((c, i) => (
                            <motion.button
                                key={i}
                                onClick={() => navigate(c.path)}
                                className="bg-[#EAF4EF] border-[3px] border-[#055B5C] rounded-2xl shadow-md p-6 w-full md:w-1/3 text-center flex flex-col items-center justify-center gap-2 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.2, duration: 0.5 }}
                            >
                                <img
                                    src={c.img}
                                    alt={c.title}
                                    className="w-10 h-10 md:w-18 md:h-18 object-contain"
                                />
                                <p className="text-[#FF7A00] font-extrabold text-xl mt-2">{c.title}</p>
                            </motion.button>
                        ))}
                    </motion.div>

                </main>
            </div>
        </div>
    );
}

export default Courses;
