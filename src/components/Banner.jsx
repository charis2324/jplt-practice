import React, { useContext } from "react";
import { BannerContext } from "../contexts/BannerContext";

function Banner() {
    const { bannerMessage, hideBanner } = useContext(BannerContext);

    if (!bannerMessage) {
        return null;
    }

    return (
        <div className="bg-blue-600 text-white px-4 py-2 flex items-center">
            <span className="flex-grow">{bannerMessage}</span>
            <button
                onClick={() => hideBanner()}
                className="text-white hover:text-gray-200 focus:outline-none font-bold ml-4"
            >
                &times;
            </button>
        </div>
    );
}

export default Banner;