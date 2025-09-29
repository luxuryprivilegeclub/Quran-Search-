import React from 'react';

interface HomePageProps {
    onNavigate: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
    return (
        <div
            className="h-screen w-screen bg-cover bg-center flex items-center justify-center text-white overflow-hidden"
            style={{ backgroundImage: "url('https://images.pexels.com/photos/36704/pexels-photo.jpg')" }}
        >
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black bg-opacity-60"></div>
            
            <div className="relative text-center animate-home-fade-in">
                <button
                    onClick={onNavigate}
                    className="bg-transparent border-2 border-yellow-400 text-yellow-400 font-amiri text-4xl sm:text-6xl font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-lg 
                               hover:bg-yellow-400 hover:text-gray-900 
                               transition-all duration-300 ease-in-out 
                               shadow-lg hover:shadow-2xl hover:shadow-yellow-400/40
                               transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-yellow-400/50"
                    aria-label="Go to Quran Ayah Search page"
                >
                    Quran Ayah Search
                </button>
            </div>

            <footer className="absolute bottom-0 left-0 right-0 p-4 text-center">
                <p dir="rtl" className="font-nastaliq text-sm text-gray-300 bg-black/30 backdrop-blur-sm inline-block px-4 py-2 rounded-lg">
                    نوٹ: تمام قرآنی آیات اور ترجمہ (فتح محمد جالندھری) مستند ذرائع سے لیے گئے ہیں۔
                </p>
            </footer>
        </div>
    );
};

// Add custom animation for the home page entrance
const style = document.createElement('style');
style.innerHTML = `
@keyframes homeFadeIn {
  from { opacity: 0; transform: translateY(20px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.animate-home-fade-in {
  animation: homeFadeIn 0.8s ease-out forwards;
}
`;
document.head.appendChild(style);