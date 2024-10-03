const LoadingIndicator = ({ sizeRem = 3 }) => {

    return (
        <div className="flex justify-center items-center" style={{
            '--size': `${sizeRem}rem`
        }}>
            <div className="animate-spin rounded-full border-t-4 border-b-4 border-blue-500" style={{
                width: 'var(--size)',
                height: 'var(--size)',
            }}></div>
        </div >
    )
}

export default LoadingIndicator;