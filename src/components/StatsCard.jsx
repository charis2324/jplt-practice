// StatsCard.js
import React from 'react';
import PropTypes from 'prop-types';

// eslint-disable-next-line react-refresh/only-export-components
function StatsCard({ title, value, description }) {
    return (
        <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">{title}</h2>
            <div className="text-3xl font-bold text-blue-600 mb-2">{value !== null && value !== undefined ? value : '-'}</div>
            <p className="text-sm text-gray-600">{description}</p>
        </div>
    );
}

StatsCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    description: PropTypes.string.isRequired,
};

// eslint-disable-next-line react-refresh/only-export-components
export default React.memo(StatsCard);