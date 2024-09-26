import React, { createContext, useState } from "react";

export const BannerContext = createContext()
export const BannerProvider = ({ children }) => {
    const [bannerMessage, setBannerMessage] = useState(null);
    const showBanner = (message) => {
        setBannerMessage(message);
    };
    const hideBanner = () => {
        setBannerMessage(null);
    };
    return (
        <BannerContext.Provider value={{ bannerMessage, showBanner, hideBanner }}>
            {children}
        </BannerContext.Provider>
    );
} 