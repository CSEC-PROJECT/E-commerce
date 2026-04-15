import React from 'react';

const StatCard = ({ title, value, change, trendingInfo, icon: Icon, iconBg, iconColor }) => {
  return (
    <div className="bg-white rounded-[20px] p-6 flex flex-col justify-between shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 min-h-[140px]">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-[11px] font-bold text-[#92959E] uppercase tracking-wider mb-2">{title}</h3>
          <div className="text-[32px] font-extrabold text-[#1A1D1F] leading-none mb-3">{value}</div>
        </div>
        <div className={`p-3 rounded-2xl ${iconBg} ${iconColor}`}>
          {Icon && <Icon size={24} strokeWidth={2.5} />}
        </div>
      </div>
      
      {change ? (
        <div className="text-sm font-semibold flex items-center gap-1">
          <span className="text-green-500">{change}</span>
          <span className="text-[#92959E] font-medium">{trendingInfo}</span>
        </div>
      ) : (
        <div className="text-[13px] font-bold flex items-center gap-1">
           {/* If there's no change text but there is trending info (like "ACTIVE NOW" or "Daily average") */}
           {trendingInfo && (
             <>
               {trendingInfo === 'ACTIVE NOW' && <span className="w-2 h-2 rounded-full bg-green-500 inline-block mr-1"></span>}
               <span className={trendingInfo === 'ACTIVE NOW' ? 'text-green-600' : 'text-[#92959E] font-medium '}>
                 {trendingInfo}
               </span>
             </>
           )}
        </div>
      )}
    </div>
  );
};

export default StatCard;
