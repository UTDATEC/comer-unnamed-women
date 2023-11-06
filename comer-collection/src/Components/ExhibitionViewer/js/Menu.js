// quick boolean fix for allowing/not allowing movement where appropriate
export let controls_enabled = false;

// hides menu
export const hideMenu = () => {
    const menu = document.getElementById('menu');
    menu.style.display = 'none';
};

// shows menu
export const showMenu = () => {
    const menu = document.getElementById('menu');
    menu.style.display = 'block';
    controls_enabled = false;
};

// enable controls, hide menu
export const startGallery = (controls) => {
    controls.lock();
    hideMenu();
    controls_enabled = true;
};

// enable play button to start gallery
export const setupPlayButton = (controls) =>  {
    const play_button = document.getElementById('play_button');
    play_button.addEventListener('click', () => startGallery(controls));
};