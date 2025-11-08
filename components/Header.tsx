import React from 'react';

const Header = () => {
  return (
    <header className="absolute top-0 left-0 right-0 z-[1000] p-4 bg-gradient-to-b from-black/70 to-transparent">
      <div className="container mx-auto flex items-center">
        <div className="h-12 w-12 rounded-full border-2 border-amber-300/50 flex items-center justify-center text-3xl" role="img" aria-label="World Map Emoji">
          🗺️
        </div>
        <h1 className="ml-4 text-2xl md:text-3xl font-bold text-amber-200 font-title tracking-wider">
          ℑ𝔫𝔡𝔲𝔰 𝔐𝔞𝔭
        </h1>
      </div>
    </header>
  );
};

export default Header;
