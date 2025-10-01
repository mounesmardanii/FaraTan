import React, { useState, useEffect } from 'react';
import AdminHeader from '../AdminHeader';
import AdminSidebar from '../AdminSidebar';
import { motion } from 'framer-motion';
import { FaPrint } from 'react-icons/fa';
import html2pdf from 'html2pdf.js';

const Nutrition = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [dietPlan, setDietPlan] = useState({});
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const daysOfWeek = ['شنبه', 'یک‌شنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];
    const mealTitles = ['صبحانه', 'میان‌وعده اول', 'ناهار', 'میان‌وعده دوم', 'شام'];

    useEffect(() => {
        const initialPlan = {};
        daysOfWeek.forEach(day => {
            initialPlan[day] = {};
            mealTitles.forEach(meal => {
                initialPlan[day][meal] = '';
            });
        });
        setDietPlan(initialPlan);

        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleInputChange = (e, day, meal) => {
        setDietPlan(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                [meal]: e.target.value
            }
        }));
    };

    const handleDownloadPDF = () => {
        const original = document.getElementById('dietTable');
        const clone = original.cloneNode(true);

        const inputs = clone.querySelectorAll('input');
        inputs.forEach(input => {
            const span = document.createElement('span');
            span.textContent = input.value || '—'; 
            span.style.display = 'block';
            span.style.padding = '12px 18px';
            span.style.border = '1px solid #e0e0e0';
            span.style.borderRadius = '10px';
            span.style.fontSize = '17px';
            span.style.fontFamily = 'Tahoma, sans-serif';
            span.style.color = '#222';
            span.style.backgroundColor = '#fefefe';
            span.style.textAlign = 'right';
            span.style.direction = 'rtl';
            input.parentNode.replaceChild(span, input);
        });

        const table = clone.querySelector('table');
        if (table) {
            table.style.direction = 'rtl';
            table.style.textAlign = 'right';
            table.style.fontFamily = 'Tahoma, sans-serif';
            table.style.fontSize = '17px';
            table.style.color = '#222';
            table.style.borderCollapse = 'separate';
            table.style.borderSpacing = '0';
            table.style.width = '100%';

            const ths = table.querySelectorAll('th');
            ths.forEach(th => {
                th.style.textAlign = 'right';
                th.style.padding = '14px 20px';
                th.style.fontWeight = 'bold';
                th.style.backgroundColor = '#f3f3f3';
                th.style.borderBottom = '2px solid #ddd';
                th.style.borderTop = '1px solid #eee';
                th.style.borderLeft = 'none';
                th.style.borderRight = 'none';
            });

            const tds = table.querySelectorAll('td');
            tds.forEach(td => {
                td.style.textAlign = 'right';
                td.style.padding = '12px 18px';
                td.style.borderBottom = '1px solid #eee';
                td.style.borderTop = 'none';
                td.style.borderLeft = 'none';
                td.style.borderRight = 'none';
            });
        }

        html2pdf().from(clone).set({
            margin: 10,
            filename: 'برنامه-غذایی-هفتگی.pdf',
            html2canvas: {
                scale: 3,
                useCORS: true,
                allowTaint: true
            },
            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait'
            }
        }).save();
    };

    const handlePrint = () => {
        const printContents = document.getElementById('dietTable').outerHTML;
        const printWindow = window.open('', '', 'width=800,height=600');
        printWindow.document.write(`
            <html>
                <head>
                    <title>چاپ برنامه غذایی</title>
                    <style>
                        body { font-family: sans-serif; direction: rtl; }
                        table { width: 100%; border-collapse: collapse; }
                        th, td { border: 1px solid #055B5C; padding: 8px; text-align: center; }
                        th { background-color: #D1E7D8; color: #055B5C; }
                        td input { width: 100%; padding: 4px; border: 1px solid #D3E8DB; }
                    </style>
                </head>
                <body>${printContents}</body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
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
                    className={`flex-1 p-6 md:p-10 relative z-10 overflow-y-auto border-t-[3px] border-l-[3px] border-[#FF7A00] rounded-tl-[75px] bg-white
                        flex flex-col items-center justify-start text-right mt-3 ml-10
                        ${sidebarOpen ? 'pointer-events-none select-none' : ''}`}
                >
                    <div className="w-full max-w-full bg-[#D1E7D8] p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl text-[#055B5C] font-bold mb-4">برنامه غذایی هفتگی</h2>

                        <div id="dietTable">
                            {isMobile ? (
                                <div className="flex flex-col gap-6">
                                    {daysOfWeek.map(day => (
                                        <div key={day} className="bg-white p-4 rounded-lg shadow-md border border-[#055B5C]">
                                            <h3 className="text-[#055B5C] font-bold text-lg mb-2">{day}</h3>
                                            <div className="flex flex-col gap-2">
                                                {mealTitles.map(meal => (
                                                    <div key={meal} className="flex flex-col">
                                                        <label className="text-[#FF7A00] font-semibold mb-1">{meal}</label>
                                                        <input
                                                            type="text"
                                                            value={dietPlan[day]?.[meal] || ''}
                                                            onChange={(e) => handleInputChange(e, day, meal)}
                                                            className="w-full p-2 border border-[#D3E8DB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#055B5C] text-right"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <table className="w-full bg-white border-collapse border border-[#055B5C] text-sm" dir="rtl">
                                    <thead>
                                        <tr>
                                            <th className="border px-4 py-2 text-[#FF7A00]">روز</th>
                                            {mealTitles.map(meal => (
                                                <th key={meal} className="border px-4 py-2 text-[#FF7A00]">{meal}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {daysOfWeek.map(day => (
                                            <tr key={day}>
                                                <td className="border px-4 py-2 font-bold text-[#055B5C] text-right">{day}</td>
                                                {mealTitles.map(meal => (
                                                    <td key={meal} className="border px-2 py-1 text-right">
                                                        <input
                                                            type="text"
                                                            value={dietPlan[day]?.[meal] || ''}
                                                            onChange={(e) => handleInputChange(e, day, meal)}
                                                            className="w-full p-2 border border-[#D3E8DB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#055B5C] text-right"
                                                        />
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        <div className="flex flex-wrap justify-center gap-4 mt-6">
                            <button
                                onClick={handleDownloadPDF}
                                className="bg-[#FF7A00] text-white px-6 py-2 rounded-md shadow-md hover:bg-[#e56c00]"
                            >
                                دانلود PDF
                            </button>

                            <button
                                onClick={handlePrint}
                                className="bg-[#FF7A00] text-white px-6 py-2 rounded-md shadow-md hover:bg-[#e56c00] flex items-center"
                            >
                                <FaPrint className="ml-2" />
                                چاپ جدول
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Nutrition;
