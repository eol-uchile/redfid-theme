function toggleMenu() {
    var navContainer = document.querySelector('.header-navigation-container-mobile');
    var content = document.querySelector('#content');

    if (navContainer.style.display === 'none' || navContainer.style.display === '') {
        navContainer.style.display = 'block';
        content.style.marginTop = '220px';
    } else {
        navContainer.style.display = 'none';
        content.style.marginTop = '0';
    }
}

window.onclick = function(event) {
    var navContainer = document.querySelector('.header-navigation-container-mobile');
    if (!event.target.matches('.header-trigger')) {
        navContainer.style.display = 'none';
        document.querySelector('main').style.marginTop = '0';
    }
}

window.onresize = function(event) {
    var screenWidth = window.innerWidth;
    var content = document.querySelector('main');
    if (screenWidth > 940) {
        content.style.marginTop = '0';
        document.querySelector('.header-navigation-container-mobile').style.display = 'none';
    }
};