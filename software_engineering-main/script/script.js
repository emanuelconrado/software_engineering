//<button class="tab-trigger" data-tab="add">Add Restaurant</button>
document.addEventListener('DOMContentLoaded', function() {
  // Initialize Lucide icons
  lucide.createIcons();
  
  // Tab switching functionality
  const tabTriggers = document.querySelectorAll('.tab-trigger');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      // Remove active class from all triggers and contents
      tabTriggers.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      // Add active class to clicked trigger
      trigger.classList.add('active');
      
      // Show corresponding tab content
      const tabId = trigger.getAttribute('data-tab');
      document.getElementById(`${tabId}-tab`).classList.add('active');
    });
  });
  
  // Restaurant form submission
  const restaurantForm = document.getElementById('restaurant-form');
  
  restaurantForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const location = document.getElementById('location').value;
    const phoneNumber = document.getElementById('phone').value;
    const cuisine = document.getElementById('cuisine').value;
    const description = document.getElementById('description').value;
    
    // Get selected restrictions
    const restrictionCheckboxes = document.querySelectorAll('input[name="restrictions"]:checked');
    const restrictions = Array.from(restrictionCheckboxes).map(cb => cb.value);
    
    // Create new restaurant object
    const newRestaurant = {
      id: Date.now().toString(),
      name,
      location,
      phoneNumber,
      cuisine,
      description,
      restrictions
    };
    
    // Get existing restaurants from localStorage or initialize empty array
    let restaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
    
    // Add new restaurant
    restaurants.push(newRestaurant);
    
    // Save to localStorage
    localStorage.setItem('restaurants', JSON.stringify(restaurants));
    
    // Reset form
    restaurantForm.reset();
    
    // Show success message
    alert('Restaurant added successfully!');
    
    // Refresh restaurant list
    loadRestaurants();
    
    // Switch to explore tab
    document.querySelector('.tab-trigger[data-tab="explore"]').click();
  });
  
  // Load restaurants from localStorage
  function loadRestaurants() {
    const restaurantList = document.querySelector('.restaurant-list');
    const restaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
    
    // Get the default restaurants if none in localStorage
    if (restaurants.length === 0) {
      const defaultRestaurants = [
        {
          id: "1",
          name: "Green Leaf Bistro",
          location: "123 Vegan St, Plant City",
          phoneNumber: "(555) 234-5678",
          cuisine: "Vegan, International",
          description: "A cozy bistro offering creative plant-based dishes from around the world. All ingredients are locally sourced and organic when possible.",
          restrictions: ["vegan", "gluten-free", "nut-free"]
        },
        {
          id: "2",
          name: "Celiac's Haven",
          location: "456 Wheat-Free Ave, Glutenville",
          phoneNumber: "(555) 345-6789",
          cuisine: "American, Italian",
          description: "Dedicated gluten-free kitchen serving classic comfort foods and Italian favorites. Safe for those with celiac disease.",
          restrictions: ["gluten-free", "vegetarian"]
        },
        {
          id: "3",
          name: "Halal Delight",
          location: "789 Halal Blvd, East Village",
          phoneNumber: "(555) 456-7890",
          cuisine: "Middle Eastern, Mediterranean",
          description: "Authentic halal cuisine featuring shawarma, falafel, and other Middle Eastern specialties.",
          restrictions: ["halal", "dairy-free"]
        }
      ];
      
      // Save default restaurants if none exist
      localStorage.setItem('restaurants', JSON.stringify(defaultRestaurants));
      return loadRestaurants();
    }
    
    // Clear existing restaurant list
    restaurantList.innerHTML = '';
    
    // Add each restaurant to the list
    restaurants.forEach(restaurant => {
      const restaurantCard = document.createElement('div');
      restaurantCard.className = 'restaurant-card';
      
      restaurantCard.innerHTML = `
        <div class="restaurant-header">
          <h3 class="restaurant-name">${restaurant.name}</h3>
          <i data-lucide="utensils-crossed" class="icon-small"></i>
        </div>
        <div class="restaurant-location">
          <i data-lucide="map-pin" class="icon-tiny"></i>
          ${restaurant.location}
        </div>
        <div class="restaurant-description">${restaurant.description}</div>
        ${restaurant.phoneNumber ? `
          <div class="restaurant-location">
            <i data-lucide="phone" class="icon-tiny"></i>
            ${restaurant.phoneNumber}
          </div>
        ` : ''}
        <div class="restaurant-cuisine">Cuisine: ${restaurant.cuisine}</div>
        <div class="restaurant-restrictions">
          ${restaurant.restrictions.map(r => `<span class="badge">${r}</span>`).join('')}
        </div>
      `;
      
      restaurantList.appendChild(restaurantCard);
    });
    
    // Re-initialize Lucide icons for dynamically added elements
    lucide.createIcons();
  }
  
  // Mobile menu toggle
  const mobileMenuButton = document.querySelector('.button-mobile-menu');
  const navbar = document.querySelector('.navbar-nav');
  
  if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', () => {
      navbar.style.display = navbar.style.display === 'flex' ? 'none' : 'flex';
    });
  }
  
  // Initialize app by loading restaurants
  loadRestaurants();
});
