window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    const content = document.getElementById('content');

    console.log('Preloader:', preloader); // Should log the element or null
    console.log('Content:', content); // Should log the element or null

    if (preloader && content) {
        setTimeout(() => {
            preloader.style.opacity = 0;
            preloader.style.visibility = 'hidden';
            content.classList.remove('hidden');
            document.body.style.overflow = 'auto';
        }, 3000); // Adjust the timeout as needed
    } else {
        console.error('Preloader or content element not found');
    }
});
