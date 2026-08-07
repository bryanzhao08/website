(() => {
  const galleries = {
    urban: [
      ['photo 11.jpg', 'Shibuya Crossing', 'Tokyo • Japan', 'The organized chaos of one of the busiest intersections in the world, filled with an endless sea of umbrellas and neon lights.'],
      ['shanghai.jpg', 'The Bund', 'Shanghai • China', 'Looking over the Bund as vibrant neon lights reflect beautifully off the dark river waters.'],
      ['shinjuku.jpg', 'Shinjuku Neon', 'Tokyo • Japan', 'The dazzling streetscape of Shinjuku at night, where tradition meets a futuristic cyberpunk aesthetic.'],
      ['photo10.jpg', 'Cyberpunk City', 'Shanghai • China', 'City lights and skyscrapers capture a vibrant futuristic atmosphere.']
    ],
    nature: [
      ['photo1.jpg', 'Boat Exiting Sea Cave', 'Na Pali • Hawaii', 'Natural light filters through the opening of a Na Pali sea cave.'],
      ['photo2.jpg', 'Flight of Faith', 'Saratoga • California', 'A candid, suspended moment of movement and grace.'],
      ['photo3.jpg', 'Emerald-shrouded Sapphire', 'Saratoga • California', 'Vibrant blue water against lush green surroundings.'],
      ['photo4.jpg', 'Tranquil Bonds', 'La Jolla • California', 'A quiet coastal scene and the rhythmic Pacific.'],
      ['photo6.jpg', 'Ribbit', 'Saratoga • California', 'A close look at a local inhabitant.'],
      ['photo7.jpg', 'Winter Wonderland', 'Ukkusissat • Greenland', 'An aerial view of a massive, silky ice canyon.']
    ],
    life: [
      ['photo5.jpg', 'One Last Time', 'Saratoga • California', 'A nostalgic local landmark at golden hour.'],
      ['photo8.jpg', 'Mona Lisa', 'Paris • France', 'Visitors turn into statues as they capture their own version of the painting.'],
      ['photo9.jpg', 'Candelit Dinner', 'San Francisco • California', 'Dim lighting and clinking glasses created a warm, intimate atmosphere.']
    ]
  };
  const html = ([file, title, sub, details]) => `<article class="photo-card" tabindex="0" data-src="assets/photos/${file}" data-title="${title}" data-sub="${sub}" data-details="${details}"><div class="photo-card-img-wrapper"><img loading="lazy" src="assets/photos/${file}" alt="${title}"><div class="photo-card-caption"><h4>${title}</h4><p>${sub}</p></div></div></article>`;
  Object.entries(galleries).forEach(([category, photos]) => {
    const slider = document.getElementById(`photoSlider${category[0].toUpperCase()}${category.slice(1)}`);
    if (slider) slider.innerHTML = photos.map(html).join('');
  });
  document.querySelectorAll('.photo-tab').forEach(tab => tab.addEventListener('click', () => {
    const category = tab.dataset.category;
    document.querySelectorAll('.photo-tab').forEach(item => { item.classList.toggle('active', item === tab); item.setAttribute('aria-selected', String(item === tab)); });
    document.querySelectorAll('.photo-category').forEach(panel => panel.classList.toggle('active', panel.id === `cat-${category}`));
  }));
  document.querySelectorAll('.photo-category').forEach(panel => {
    const slider = panel.querySelector('.photo-slider');
    panel.querySelector('.prev-btn')?.addEventListener('click', () => slider?.scrollBy({ left: -slider.clientWidth * .8, behavior: 'smooth' }));
    panel.querySelector('.next-btn')?.addEventListener('click', () => slider?.scrollBy({ left: slider.clientWidth * .8, behavior: 'smooth' }));
  });
})();
