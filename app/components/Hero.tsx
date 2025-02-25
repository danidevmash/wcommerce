export default function Hero() {
  return (
    <div className="relative h-[80vh] w-full overflow-hidden">
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/videos/w.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>
      
      <div className="absolute inset-0 bg-black/30" />
      
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-4">
          Welcome to {process.env.SITE_NAME}
        </h1>
        <p className="text-xl md:text-2xl text-center max-w-2xl">
          Discover our amazing collection of products
        </p>
      </div>
    </div>
  );
} 