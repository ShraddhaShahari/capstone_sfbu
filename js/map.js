let menu = document.querySelector('.header .menu');
const listingsContainer = document.querySelector('.listings-container');

function fetchPropertyListingsMap() {
    axios.get('http://localhost:3005/properties')
        .then(function (response) {
            const listingsContainer = document.querySelector('.box-container');

            // Check if the element was found
            if (!listingsContainer) {
                console.error('Error: .listings-container not found in the DOM.');
                return;
            }

            listingsContainer.innerHTML = ''; // Clear existing listings
            console.log(response.data.res);

            response.data.res.forEach(function (property) {
                const box = document.createElement('div');
                box.classList.add('box');
                
                // Array of potential image sources
                const imageSources = [
                    'images/homeimage1.jpg',
                    'images/homeimage2.jpg',
                    'images/homeimage3.jpg',
                    'images/homeimage4.webp',
                    'images/homeimage5.jpg',
                    'images/homeimage6.jpg',
                    'images/homeimage7.jpg',
                    'images/homeimage8.jpg'
                ];

                // Function to get random unique images
                function getRandomImages(count) {
                    // Shuffle array to get random selection
                    const shuffled = imageSources.sort(() => 0.5 - Math.random());
                    return shuffled.slice(0, count); // Return 'count' number of images
                }

                // Get 3-4 random images
                const randomImages = getRandomImages(1);

                // Generate the image elements
                const imageElements = randomImages.map(src => `<img src="${src}" alt="Property Image">`).join('');

                // Set the inner HTML of the box
                box.innerHTML = `
                    <div class="thumb slider">
                        ${imageElements}
                    </div>
                    <p class="location"><i class="fas fa-map-marker-alt"></i><span>${property.city}</span></p>
                    <div class="flex">
                        <p><i class="fas fa-bed"></i><span>${property.bedroom}</span></p>
                        <p><i class="fas fa-maximize"></i><span>${property.lot_area}</span></p>
                    </div>
                    <a href="view_property.html" class="btn">view property</a>
                `;

                listingsContainer.appendChild(box);
            });
        })
        .catch(function (error) {
            console.error('Error fetching property listings:', error);
        });
}

document.addEventListener('DOMContentLoaded', function () {
    fetchPropertyListingsMap(); // Fetch property listings when the page loads
});


window.fetchPropertyListingsMap = fetchPropertyListingsMap;