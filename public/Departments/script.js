// Function to toggle classes and apply the selected color to the pre-loader
const toggleClasses = (color) => {
    const classMap = {
        black: ['is-black', 'black-bg'],
        green: ['is-green', 'green-bg'],
        brown: ['is-brown', 'brown-bg'],
    };

    const elements = ['.loader-wrapper', '.section', 'body', '.menu-overlay', '.menu-line', '.pre-loader'];

    // Remove existing color classes and apply the new selected color class
    elements.forEach(el => {
        $(el).removeClass('is-black is-green is-brown');
        $(el).addClass(classMap[color][0]); // Apply color class to each element including the pre-loader
    });

    // Change the body's background class as well
    $('body').removeClass('black-bg green-bg brown-bg');
    $('body').addClass(classMap[color][1]); // Apply corresponding background class
};

// On page load, set the pre-loader color based on the saved cookie value
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    const content = document.getElementById('Content'); // Ensure the ID matches the HTML

    console.log('Preloader:', preloader); // Log the preloader element
    console.log('Content:', content); // Log the content element

    // Get the saved color mode from cookies
    const colorMode = Cookies.get("colorMode");
    if (colorMode) {
        toggleClasses(colorMode); // Apply the saved color mode to the pre-loader and other elements
    }

    if (preloader && content) {
        setTimeout(() => {
            preloader.style.opacity = 0; // Fades out the preloader
            preloader.style.visibility = 'hidden'; // Hides the preloader
            content.classList.remove('hidden'); // Displays the content
            document.body.style.overflow = 'auto'; // Allows scrolling
        }, 2500); // Adjust the timeout as needed
    } else {
        console.error('Preloader or content element not found');
    }
});

// Store color preference in cookies when a color option is selected
$('.color-option-w').click(function() {
    let currentColor = $(this).attr("data-color");
    Cookies.set("colorMode", currentColor, { expires: 14 }); // Save color preference in cookies
    toggleClasses(currentColor); // Update pre-loader and elements with the new color
});

// Allow users to change color theme by clicking buttons
$('#black-color').click(() => toggleClasses('black'));
$('#green-color').click(() => toggleClasses('green'));
$('#brown-color').click(() => toggleClasses('brown'));
