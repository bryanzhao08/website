import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

// Use Vite's import.meta.glob to eagerly import all jpgs in assets/photos
const imageImports = import.meta.glob('../assets/photos/*.jpg', { eager: true, query: '?url', import: 'default' });

const photosDataMap: Record<string, { category: string, title: string, sub: string, details: string }> = {
  'photo1.jpg': { category: 'Nature', title: 'Boat Exiting Sea Cave', sub: 'Na Pali • Hawaii', details: 'A stunning view from within a sea cave on the Na Pali coast, captured during a boat tour. The natural light filtering through the opening creates a magical atmosphere and highlights the textures of the volcanic rock.' },
  'photo2.jpg': { category: 'Nature', title: 'Flight of Faith', sub: 'Saratoga • California', details: 'A candid moment of movement and grace captured in the heart of Saratoga. This shot captures the split-second beauty of a bird in flight, frozen against the backdrop of the afternoon sun.' },
  'photo3.jpg': { category: 'Nature', title: 'Emerald-shrouded Sapphire', sub: 'Saratoga • California', details: 'The vibrant blue of the water contrasting with the lush green foliage. Taken at a hidden spring, this photo highlights the purity and stillness of the local ecosystem.' },
  'photo4.jpg': { category: 'Nature', title: 'Tranquil Bonds', sub: 'La Jolla • California', details: 'A peaceful scene by the coast in La Jolla, reflecting the quiet beauty of nature and the rhythmic flow of the Pacific tides against the rugged shoreline.' },
  'photo5.jpg': { category: 'Life', title: 'One Last Time', sub: 'Saratoga • California', details: 'A nostalgic look at a local landmark during the golden hour, symbolizing the end of an era and the fleeting beauty of a California sunset.' },
  'photo6.jpg': { category: 'Nature', title: 'Ribbit', sub: 'Saratoga • California', details: 'A macro shot of a local inhabitant, highlighting the intricate details and vibrant colors of nature that often go unnoticed in our daily lives.' },
  'photo7.jpg': { category: 'Nature', title: 'Winter Wonderland', sub: 'Ukkusissat • Greenland', details: 'An aerial shot of the Arctic, covering a massive canyon, filled with smooth silky ice.' },
  'photo8.jpg': { category: 'Life', title: 'Mona Lisa', sub: 'Paris • France', details: 'Amidst the view of the most recognizable painting, people turn into statues as they try to capture their own version of her.' },
  'photo9.jpg': { category: 'Life', title: 'Candelit Dinner', sub: 'San Francisco • California', details: 'The dim lighting and clinking glasses created a warm and intimate atmosphere.' },
  'photo10.jpg': { category: 'Urban', title: 'Cyberpunk City', sub: 'Shanghai • China', details: 'The city lights and skyscrapers capture the vibrant and futuristic atmosphere of the city.' },
  'photo 11.jpg': { category: 'Urban', title: 'Shibuya Crossing', sub: 'Tokyo • Japan', details: 'The organized chaos of one of the busiest intersections in the world, filled with an endless sea of umbrellas and neon lights.' },
  'shanghai.jpg': { category: 'Urban', title: 'Shanghai Nights', sub: 'Shanghai • China', details: 'Looking over the Bund as vibrant neon lights reflect beautifully off the dark river waters.' },
  'shinjuku.jpg': { category: 'Urban', title: 'Shinjuku Neon', sub: 'Tokyo • Japan', details: 'The dazzling streetscape of Shinjuku at night, where tradition meets a futuristic cyberpunk aesthetic.' }
};

interface Photo {
  id: number;
  src: string;
  category: string;
  title: string;
  sub: string;
  details: string;
}

const photos: Photo[] = Object.entries(imageImports)
  .filter(([path]) => !path.includes('profile.jpg'))
  .map(([path, url], index) => {
    const filename = path.split('/').pop() || '';
    const data = photosDataMap[filename] || { 
      category: 'Life', 
      title: filename.split('.')[0], 
      sub: 'Unknown Location', 
      details: 'A beautiful moment captured in time.' 
    };

    return {
      id: index,
      src: url as string,
      ...data
    };
  });

const CATEGORIES = ["Urban", "Nature", "Life"];

export default function PhotographyGallery() {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedPhoto) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [selectedPhoto]);

  return (
    <div className="w-full py-8">
      {CATEGORIES.map(category => {
        const categoryPhotos = photos.filter(p => p.category === category);
        if (categoryPhotos.length === 0) return null;

        return (
          <div key={category} className="mb-24">
            <div className="flex flex-col items-start mb-10">
              <h3 className="font-serif italic text-4xl text-[#2D3A31] mb-2">{category}</h3>
              <div className="w-16 h-[1px] bg-[#8C9A84]"></div>
            </div>

            <motion.div 
              layout
              className="flex gap-8 overflow-x-auto snap-x snap-mandatory pb-8"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {categoryPhotos.map((photo) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  key={photo.id}
                  className="min-w-[85vw] md:min-w-[400px] lg:min-w-[500px] snap-center shrink-0 cursor-pointer"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <div className="relative group overflow-hidden rounded-[40px] bg-[#EAE6DE] shadow-sm hover:shadow-lg transition-all duration-700 h-[50vh] md:h-[500px] w-full">
                    <motion.img 
                      src={photo.src} 
                      alt={photo.title}
                      className="w-full h-full object-cover rounded-[40px]"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2D3A31]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[40px] flex flex-col justify-end p-8">
                      <h4 className="text-white font-serif text-2xl italic leading-tight">{photo.title}</h4>
                      <p className="text-[#DCCFC2] font-sans text-sm tracking-wider uppercase mt-1">{photo.sub}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        );
      })}

      {/* Fullscreen Photo Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-[#2D3A31]/95 backdrop-blur-md"
            onClick={() => setSelectedPhoto(null)}
          >
            {/* We apply pointer-events-none to the background and enable it on the content */}
            <motion.div 
              initial={{ y: 30, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#F9F8F4] w-full max-w-6xl max-h-[90vh] rounded-[40px] overflow-hidden flex flex-col md:flex-row shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-6 right-6 z-10 w-12 h-12 bg-white/50 backdrop-blur-md hover:bg-white border border-[#E6E2DA] rounded-full flex items-center justify-center text-[#2D3A31] transition-all duration-300"
                aria-label="Close"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              <div className="w-full md:w-[60%] h-[40vh] md:h-full bg-black relative flex items-center justify-center overflow-hidden">
                <img 
                  src={selectedPhoto.src} 
                  alt={selectedPhoto.title}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="w-full md:w-[40%] p-8 md:p-12 flex flex-col justify-center overflow-y-auto">
                <p className="font-sans text-sm font-semibold tracking-widest uppercase text-[#8C9A84] mb-4">
                  {selectedPhoto.category}
                </p>
                <h3 className="font-serif text-4xl md:text-5xl font-bold text-[#2D3A31] mb-2 leading-tight">
                  {selectedPhoto.title}
                </h3>
                <p className="font-serif italic text-xl text-[#667269] mb-8">
                  {selectedPhoto.sub}
                </p>
                <div className="w-12 h-[1px] bg-[#E6E2DA] mb-8"></div>
                <p className="font-sans text-lg text-[#556259] leading-relaxed">
                  {selectedPhoto.details}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
