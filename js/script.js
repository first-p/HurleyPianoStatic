/***********************************************
Author: Fred Butoma
Hurley Piano New Concept Website
File: script.js
Purpose: Javascript file for website functions
************************************************/

document.getElementById('hamburger').addEventListener('click', function() {
    var menu = document.getElementById('nav-menu');
    if (menu.style.display === 'block') {
        menu.style.display = 'none';
    } else {
        menu.style.display = 'block';
    }
});
