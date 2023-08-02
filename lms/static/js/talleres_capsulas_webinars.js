$(document).ready(function() {
    let display = getUrlParameter("display");
    if (display === "1" || display === "2") {
        let displayId = getUrlParameter("displayId");
        if (displayId == null || isNaN(parseInt(displayId))) {
            showTalleresWebinarsCapsulas(display, 0);
        } else {
            showTalleresWebinarsCapsulas(display, parseInt(displayId));
        }
    } else {
        hideTalleresWebinarsCapsulas();
    }
});

function showTalleresWebinarsCapsulas(display, displayId) {
    $("#dashboard-main").hide();
    if (display === "1"){
        $.getJSON('https://static.redfid.cl/talleres/talleres.json', function(data){
            items = getAndClassifyItems(data, displayId);
            if (displayId === 0 && items["defaultItem"] != null) {
                setUrlParameter('displayId', items["defaultItem"]["id"]);
            }
            fillTalleres(items);
        });
    } else {
        $.getJSON('https://static.redfid.cl/capsulas/capsulas.json', function(data){
            items = getAndClassifyItems(data, displayId);
            if (displayId === 0 && items["defaultItem"] != null) {
                setUrlParameter('displayId', items["defaultItem"]["id"]);
            }
            fillCapsulas(items);
        });
    }
    $("#back-to-dashboard").on("click", function() {
        var currentUrl = new URL(window.location.href);
        currentUrl.search = "";
        window.location.href = currentUrl.toString();
    });
    
}

function hideTalleresWebinarsCapsulas() {
    $("#talleres-webinars-capsulas-main").hide();
    $("#talleres-image").on("click", function(){
        var currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('display', "1");
        currentUrl.searchParams.set('displayId', "0");
        window.location.href = currentUrl.toString(); 
    });
    $("#capsulas-image").on("click", function(){
        var currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('display', "2");
        currentUrl.searchParams.set('displayId', "0");
        window.location.href = currentUrl.toString(); 
    });
}

function fillTalleres(items){
    console.log(items);
    // ver caso vacio
    // sino rellenar
}

function fillCapsulas(items){ 
    console.log(items);
    // ver caso vacio
    // sino rellanar
}

function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};

function setUrlParameter(key, value) {
    let params = new URLSearchParams(window.location.search);
    params.set(key, value);
    window.history.replaceState({}, '', window.location.pathname + '?' + params);
}

function cleanURLParameters(){
    var currentUrl = window.location.href;
    var indexOfQuestionMark = currentUrl.indexOf("?");
    if (indexOfQuestionMark != -1) {
        var urlWithoutParameters = currentUrl.substring(0, indexOfQuestionMark);
        window.history.pushState({}, document.title, urlWithoutParameters);
    }
}

function getAndClassifyItems(data, displayId){
    activeItem = null;
    defaultItem = null;
    summarizedItems = [];
    data.forEach((item, index) => {
        if (item.id.toString() === displayId){
            activeItem = item;
        }
        if (defaultItem == null){
            defaultItem = item;
        }
        if (item.priority > defaultItem.priority){
            defaultItem = item;
        }
        summarizedItems.push(item);
    });
    if (activeItem == null){
        activeItem = defaultItem;
    }
    summarizedItems = summarizedItems.filter(function(item) {
        return item.id !== activeItem.id;
    });
    return {"active": activeItem, "summarizedItems": summarizedItems, "defaultItem": defaultItem}
}
