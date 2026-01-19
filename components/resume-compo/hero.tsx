interface HerProps {
    showButton: boolean;
    onClick: () => void;
}
export default function Hero({ showButton, onClick }: HerProps) {
    return (
        <div className="flex justify-center items-center h-screen">
            {showButton && (
                <button onClick={onClick} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-4xl">Make Resume</button>
            )}
        </div>
    );
}