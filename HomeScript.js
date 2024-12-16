// Function to show dropdown and change icon
function showDropdown() {
    // Find the clicked dropdown link
    const dropdownToggle = event.currentTarget;
    const icon = dropdownToggle.querySelector('.menu-icon');
    
    // Change the icon to up arrow
    if (icon) {
        icon.innerHTML = '&#9652;';
    }
    
    // Show the dropdown menu
    const dropdownMenu = dropdownToggle.nextElementSibling;
    if (dropdownMenu) {
        dropdownMenu.classList.add('show');
    }
}

// Function to hide dropdown and revert icon
function hideDropdown() {
    // Find the clicked dropdown link
    const dropdownToggle = event.currentTarget;
    const icon = dropdownToggle.querySelector('.menu-icon');
    
    // Change the icon back to down arrow
    if (icon) {
        icon.innerHTML = '&#9662;';
    }
    
    // Hide the dropdown menu
    const dropdownMenu = dropdownToggle.nextElementSibling;
    if (dropdownMenu) {
        // Add a small delay to allow moving to submenu
        setTimeout(() => {
            if (!dropdownMenu.matches(':hover')) {
                dropdownMenu.classList.remove('show');
            }
        }, 100);
    }
}

// Add event listeners when document is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Handle dropdown menu hover as well
    const dropdownMenus = document.querySelectorAll('.dropdown-menu');
    
    dropdownMenus.forEach(menu => {
        menu.addEventListener('mouseleave', function() {
            this.classList.remove('show');
            const icon = this.previousElementSibling.querySelector('.menu-icon');
            if (icon) {
                icon.innerHTML = '&#9662;';
            }
        });
        
        menu.addEventListener('mouseenter', function() {
            this.classList.add('show');
            const icon = this.previousElementSibling.querySelector('.menu-icon');
            if (icon) {
                icon.innerHTML = '&#9652;';
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    
    let currentPosition = 0;
    let slideWidth = calculateSlideWidth();
    let maxPosition = calculateMaxPosition();
    let autoSlideInterval;

    function calculateSlideWidth() {
        if (window.innerWidth <= 768) {
            return 100; // Show 1 slide on mobile
        } else if (window.innerWidth <= 1024) {
            return 50; // Show 2 slides on tablets
        } else {
            return 100/3; // Show 3 slides on desktop
        }
    }

    function calculateMaxPosition() {
        if (window.innerWidth <= 768) {
            return -(slides.length - 1) * 100;
        } else if (window.innerWidth <= 1024) {
            return -(slides.length - 2) * 50;
        } else {
            return -(slides.length - 3) * (100/3);
        }
    }

    function updateCarousel() {
        // Ensure position doesn't exceed bounds
        currentPosition = Math.max(Math.min(currentPosition, 0), maxPosition);
        track.style.transform = `translateX(${currentPosition}%)`;
        
        // Update button states
        prevBtn.disabled = currentPosition >= 0;
        nextBtn.disabled = currentPosition <= maxPosition;
    }

    function startAutoSlide() {
        stopAutoSlide(); // Clear any existing interval
        autoSlideInterval = setInterval(() => {
            if (currentPosition <= maxPosition) {
                currentPosition = 0;
            } else {
                currentPosition -= slideWidth;
            }
            updateCarousel();
        }, 5000);
    }

    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
    }

    function handleResize() {
        // Recalculate dimensions
        slideWidth = calculateSlideWidth();
        maxPosition = calculateMaxPosition();
        
        // Reset position if needed
        if (currentPosition < maxPosition) {
            currentPosition = maxPosition;
        }
        updateCarousel();
    }

    // Event Listeners
    nextBtn.addEventListener('click', () => {
        currentPosition = Math.max(currentPosition - slideWidth, maxPosition);
        updateCarousel();
        stopAutoSlide();
        startAutoSlide(); // Reset auto slide timer
    });

    prevBtn.addEventListener('click', () => {
        currentPosition = Math.min(currentPosition + slideWidth, 0);
        updateCarousel();
        stopAutoSlide();
        startAutoSlide(); // Reset auto slide timer
    });

    // Handle touch events for mobile swipe
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        stopAutoSlide();
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
        touchEndX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', () => {
        const swipeDistance = touchStartX - touchEndX;
        if (Math.abs(swipeDistance) > 50) { // Minimum swipe distance
            if (swipeDistance > 0) {
                // Swipe left
                currentPosition = Math.max(currentPosition - slideWidth, maxPosition);
            } else {
                // Swipe right
                currentPosition = Math.min(currentPosition + slideWidth, 0);
            }
            updateCarousel();
        }
        startAutoSlide();
    });

    // Handle window resize
    window.addEventListener('resize', handleResize);

    // Initialize
    updateCarousel();
    startAutoSlide();

    // Pause auto-slide when user hovers over carousel
    track.addEventListener('mouseenter', stopAutoSlide);
    track.addEventListener('mouseleave', startAutoSlide);
});