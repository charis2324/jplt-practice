function StatsCard({ title, value, description }) {
    return (
        <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">{title}</h2>
            <div className="text-3xl font-bold text-blue-600 mb-2">{value ? value : '-'}</div>
            <p className="text-sm text-gray-600">{description}</p>
        </div>
    )
}

export default StatsCard;