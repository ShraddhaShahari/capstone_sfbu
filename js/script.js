// import axios from 'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js';
let menu = document.querySelector('.header .menu');
const listingsContainer = document.querySelector('.listings-container');


document.querySelector('#menu-btn').onclick = () => {
    menu.classList.toggle('active');
};

window.onscroll = () => {
    menu.classList.remove('active');
};

document.querySelectorAll('input[type="number"]').forEach(inputNumber => {
    inputNumber.oninput = () => {
        if (inputNumber.value.length > inputNumber.maxLength) inputNumber.value = inputNumber.value.slice(0, inputNumber.maxLength);
    };
});

document.querySelectorAll('.faq .box-container .box h3').forEach(headings => {
    headings.onclick = () => {
        headings.parentElement.classList.toggle('active');
    };
});

function showPopup(type) {
    hideAllPopups();
    document.getElementById(type + '-popup').style.display = 'flex';
}

function hidePopup(type) {
    document.getElementById(type + '-popup').style.display = 'none';
}

function hideAllPopups() {
    document.querySelectorAll('.popup').forEach(popup => popup.style.display = 'none');
    document.querySelector('.login-container') && (document.querySelector('.login-container').style.display = 'none');
    document.querySelector('.register-container') && (document.querySelector('.register-container').style.display = 'none');
}

function clearFields() {
    document.querySelectorAll('input').forEach(input => input.value = '');
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => checkbox.checked = false);
}

function validatePassword(password) {
    const requirements = {
        length: password.length >= 8,
        lettersAndNumbers: /[a-zA-Z]/.test(password) && /[0-9]/.test(password),
        specialCharacter: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        lowerAndUpper: /[a-z]/.test(password) && /[A-Z]/.test(password)
    };

    return Object.values(requirements).every(value => value);
}

function validateSignIn(event) {
    event.preventDefault();
    const email = document.getElementById('signin-email')?.value || document.getElementById('signin-popup-email')?.value;
    const password = document.getElementById('signin-password')?.value || document.getElementById('signin-popup-password')?.value;
    const errorMessage = document.getElementById('signin-error') || document.getElementById('signin-popup-error');
    const successMessage = document.getElementById('signin-success') || document.getElementById('signin-popup-success');

    const users = JSON.parse(localStorage.getItem('users')) || [];

    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        successMessage.style.display = 'block';
        successMessage.textContent = "Login successful! Redirecting...";
        setTimeout(() => {
            clearFields(); // Clear the fields
            window.location.href = 'home.html'; // Redirect to home page
        }, 2000);
    } else {
        errorMessage.style.display = 'block';
        errorMessage.textContent = "Invalid email or password";
    }
}

function submitSignUp(event) {
    event.preventDefault();
    const username = document.getElementById('signup-username')?.value || document.getElementById('signup-popup-username')?.value;
    const email = document.getElementById('signup-email')?.value || document.getElementById('signup-popup-email')?.value;
    const password = document.getElementById('signup-password')?.value || document.getElementById('signup-popup-password')?.value;
    const confirmPassword = document.getElementById('signup-confirm-password')?.value || document.getElementById('signup-popup-confirm-password')?.value;
    const isLandlord = document.getElementById('is-landlord')?.checked || document.getElementById('is-popup-landlord')?.checked;
    const errorMessage = document.getElementById('signup-error') || document.getElementById('signup-popup-error');
    const successMessage = document.getElementById('signup-success') || document.getElementById('signup-popup-success');

    if (password !== confirmPassword) {
        errorMessage.style.display = 'block';
        errorMessage.textContent = "Passwords do not match";
        return;
    }

    if (!validatePassword(password)) {
        errorMessage.style.display = 'block';
        errorMessage.textContent = "Password does not meet the requirements";
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];

    if (users.some(user => user.email === email)) {
        errorMessage.style.display = 'block';
        errorMessage.textContent = "Email is already registered";
        return;
    }

    users.push({ username, email, password, isLandlord });
    localStorage.setItem('users', JSON.stringify(users));

    errorMessage.style.display = 'none';
    successMessage.style.display = 'block';
    successMessage.textContent = "Sign up successful! Please sign in.";

    setTimeout(() => {
        clearFields(); // Clear the fields
        successMessage.style.display = 'none';
        hidePopup('signup'); // Hide the signup popup
        showPopup('signin'); // Show the signin popup
    }, 2000);
}

function googleSignIn() {
    alert("Google Sign-In is not set up.");
}

// Image slider functionality for listings page
document.addEventListener('DOMContentLoaded', function() {
    const sliders = document.querySelectorAll('.slider');
    
    sliders.forEach(slider => {
        let currentIndex = 0;
        const images = slider.querySelectorAll('img');
        
        function showImage(index) {
            images.forEach((img, i) => {
                img.style.display = i === index ? 'block' : 'none';
            });
        }
        
        showImage(currentIndex);
        
        setInterval(() => {
            currentIndex = (currentIndex + 1) % images.length;
            showImage(currentIndex);
        }, 3000);
    });

    const modal = document.getElementById('image-modal');
    const modalImg = modal.querySelector('#modal-img');
    let currentImages = [];

    sliders.forEach(slider => {
        const images = slider.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('click', function() {
                currentImages = Array.from(images);
                modalImg.src = this.src;
                modal.style.display = 'block';
                currentIndex = currentImages.indexOf(this);
            });
        });
    });

    const prev = document.querySelector('.prev');
    const next = document.querySelector('.next');

    prev.addEventListener('click', function() {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : currentImages.length - 1;
        modalImg.src = currentImages[currentIndex].src;
    });

    next.addEventListener('click', function() {
        currentIndex = (currentIndex + 1) % currentImages.length;
        modalImg.src = currentImages[currentIndex].src;
    });

    document.querySelector('.close').addEventListener('click', function() {
        modal.style.display = 'none';
    });
});

// Calculate price function
function calculatePrice() {
    var sqft_living = document.getElementsByName('sqft_living')[0].value;
    var sqft_lot = document.getElementsByName('sqft_lot')[0].value;
    var price_per_sqft = document.getElementsByName('price_per_sqft')[0].value;

    if (sqft_living && price_per_sqft) {
        var price = sqft_living * price_per_sqft;
        document.getElementById('calculated-price').innerText = 'Calculated Price: $' + price.toLocaleString();
    } else {
        document.getElementById('calculated-price').innerText = 'Please fill in all required fields';
    }
}

// Add min and max value enforcement for number inputs
document.querySelectorAll('input[type="number"]').forEach(inputNumber => {
    inputNumber.addEventListener('input', () => {
        let min = parseFloat(inputNumber.min);
        let max = parseFloat(inputNumber.max);
        let value = parseFloat(inputNumber.value);

        if (value < min) inputNumber.value = min;
        if (value > max) inputNumber.value = max;
    });
});

function addProperty() {
    const form = document.getElementById('add-property-form');
    if (!form) {
        console.error('Form not found!');
        return;
    }
    const data = new FormData(form);
    const formDataObject = Object.fromEntries(data.entries());
    const transformedObject = {
        bedroom: formDataObject.bedrooms,
        floors: formDataObject.floors,
        living_area: formDataObject.sqft_living,
        view: formDataObject.view,
        lot_area: formDataObject.sqft_lot,
        condition: formDataObject.condition,
        above_ground: formDataObject.sqft_above,
        date_renovated: formDataObject.yr_renovated,
        basement: formDataObject.sqft_basement,
        street: formDataObject.street,
        city: formDataObject.city,
        price: formDataObject.price
    };
    axios.post('http://localhost:3005/property', transformedObject)
      .then(function (response) {
        console.log(response);
        form.reset();
        alert("Property has been added successfully....!");
      })
      .catch(function (error) {
        console.log(error);
        alert("Unable to add the property...!");
      });
}


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
                const randomImages = getRandomImages(3 + Math.floor(Math.random() * 2));

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
                    <button class="btn" onclick="viewProperty(${property.id})">view property</button>
                `;

                listingsContainer.appendChild(box);
            });
        })
        .catch(function (error) {
            console.error('Error fetching property listings:', error);
        });
}


function viewProperty(propertyId) {
    axios.get(`http://localhost:3005/property/${propertyId}`)
        .then(function (response) {
            if (response.status === 200) {
                window.location.href = `view_property.html?id=${propertyId}`;
            } else {
                console.error('Error fetching property details:', response.status);
            }
        })
        .catch(function (error) {
            console.error('Error fetching property details:', error);
        });
}

function onPageLoad() {
    console.log("fetching locations");
    axios.get("http://127.0.0.1:5000/get_location_names")
        .then(function(response) {
            var locations = response.data.locations;
            // console.log("got response for get_location_names request ", locations);
            var ui_city = document.getElementById("ui_city");
            // $('#ui_city').empty();
            locations.forEach(function(location) {
                var opt = new Option(location);
                ui_city.appendChild(opt);
            });
        })
        .catch(function(error) {
            console.error("Error fetching locations:", error);
        });
}

function onClickedEstimatePrice() {
    console.log("Estimate price button clicked");
    var sqft_living = document.getElementById("ui_sqft_living").value;
    var sqft_lot = document.getElementById("ui_sqft_lot").value;
    var city = document.getElementById("ui_city").value;
    var bedrooms = document.getElementById("ui_bedrooms").value;
    console.log("Estimate price button clicked after", sqft_living, sqft_lot, bedrooms, city);
    var t1 =   parseInt(sqft_living)
    console.log("after", t1)

    
    axios.post("http://127.0.0.1:5000/predict_home_price", {
        sqft_living: parseInt(sqft_living),
        sqft_lot: parseInt(sqft_lot),
        bedrooms: parseInt(bedrooms),
        city: city
    })
    .then(function(response) {
        console.log("Response from server:", response.data);
        // Assuming you have an element with id "ui_estimated_price" to show the result
        var estPrice = document.getElementById("ui_estimated_price");
        if (response.data && response.data.estimated_price !== undefined) {
            estPrice.innerHTML = "<h2>Estimated Price: $" + response.data.estimated_price.toString() + "</h2>";
        } else {
            estPrice.innerHTML = "<h2>Error: Failed to estimate price</h2>";
        }
    })
    .catch(function(error) {
        console.error("Error in POST request:", error);
        var estPrice = document.getElementById("ui_estimated_price");
        estPrice.innerHTML = "<h2>Error: Failed to estimate price</h2>";
    });
}


document.addEventListener('DOMContentLoaded', function () {
    fetchPropertyListingsMap(); // Fetch property listings when the page loads
});


window.addProperty = addProperty;
window.viewProperty = viewProperty;
window.fetchPropertyListingsMap = fetchPropertyListingsMap;
window.onload = onPageLoad;