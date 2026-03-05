function toggleLinksMenu() {
    var navContainer = document.querySelector('.header-navigation-container-mobile');
    var userContainer = document.querySelector('.header-user-container-mobile');

    if (navContainer.style.display === 'none' || navContainer.style.display === '') {
        userContainer.style.display = 'none';
        navContainer.style.display = 'block';
    } else {
        navContainer.style.display = 'none';
    }
}

function toggleUserMenu() {
    var userContainer = document.querySelector('.header-user-container-mobile');
    var navContainer = document.querySelector('.header-navigation-container-mobile');

    if (userContainer.style.display === 'none' || userContainer.style.display === '') {
        navContainer.style.display = 'none';
        userContainer.style.display = 'block';
    } else {
        userContainer.style.display = 'none';
    }
}

window.onclick = function(event) {
    var navContainer = document.querySelector('.header-navigation-container-mobile');
    var userContainer = document.querySelector('.header-user-container-mobile');
    if (navContainer.style.display !== "none") {
        if (!event.target.matches('.header-navigation-container-mobile')) {
            navContainer.style.display = 'none';
        }
    } else {
        if (event.target.matches('.header-trigger')) {
            toggleLinksMenu();
        }
    }
    if (userContainer.style.display !== "none") {
        if (!event.target.matches('.header-user-container-mobile')) {
            userContainer.style.display = 'none';
        }
    } else {
        if (event.target.matches('.toggle-user-menu')) {
            toggleUserMenu();
        }
    }
}

window.onresize = function(event) {
    var screenWidth = window.innerWidth;
    var navContainer = document.querySelector('.header-navigation-container-mobile');
    if (screenWidth > 940) {
        navContainer.style.display = 'none';
        document.querySelector('.header-navigation-container-mobile').style.display = 'none';
        document.querySelector('.header-user-container-mobile').style.display = 'none';
    }
};