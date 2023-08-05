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
        }).fail(function(jqXHR, textStatus, errorThrown) {
            fillTalleres({"active": null, "default": null, "summarizedItems": []})
        });
    } else {
        $.getJSON('https://static.redfid.cl/capsulas/capsulas.json', function(data){
            items = getAndClassifyItems(data, displayId);
            if (displayId === 0 && items["defaultItem"] != null) {
                setUrlParameter('displayId', items["defaultItem"]["id"]);
            }
            fillCapsulas(items);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            fillTalleres({"active": null, "default": null, "summarizedItems": []})
        });
    }
}

function hideTalleresWebinarsCapsulas() {
    $("#twc-main").hide();
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
    $("#twc-main").html(`
    <a class="back-to-landing-button" href="/dashboard">
        <i class="fa fa-arrow-left" aria-hidden="true"></i>
        Volver a Aprendizaje Profesional
    </a>
    <h1 class="landing-title">Talleres y webinars</h1>
    <p class="landing-description">Aquí podrás volver a revisar los talleres y webinars impartidos hacia la comunidad de formadores de RedFID.</p>
    <hr>
    <div class="twc-container">
        <div class="twc-content">
            <div class="twc-content-error-container" style="display: none;">
                <p>El taller o webinar seleccionado no existe.</p>
            </div>
            <h1 class="twc-content-title"></h1>
            <div class="twc-content-video-container"></div>
            <div class="twc-content-subtitle-container"></div>
            <p class="twc-content-description"></p>
            <p class="twc-content-exposes"></p>
        </div>
        <hr class="twc-mobile-separator">
        <div class="twc-summary">
        </div>
    </div>
    <div class="twc-error-container" style="display: none;">
        <p>No hay talleres ni webinars disponibles.</p>
    </div>
    `);
    if (items.active == null && items.summarizedItems.length === 0){
        $(".twc-container").hide();
        $(".twc-error-container").show();
    } else {
        if (items.active == null){
            $(".twc-content-error-container").show();
        } else {
            $(".twc-content-title").text(items.active.title);
            var videoEmbed = `<iframe src="${convertToEmbedUrl(items.active.video_url)}" frameborder="0" allowfullscreen></iframe>`;
            $(".twc-content-video-container").append(videoEmbed);
            $(".twc-content-subtitle-container").append(`
                <div class="twc-content-tag" style="background-color: ${items.active.kind === "taller" ? "#A5D6D9" : "#eb947e6e"};">${items.active.kind}</div>
                <div class="twc-content-date">${items.active.date}</div>
            `);
            $(".twc-content-description").text(items.active.description);
            $(".twc-content-exposes").text(items.active.exposes);
        }
        if (items.summarizedItems.length !== 0) {
            var first = true;
            items.summarizedItems.sort((a, b) => b.priority - a.priority);
            for(let item of items.summarizedItems) {
                if (!first) {
                    $(".twc-summary").append("<hr>")
                }
                first = false;
                $(".twc-summary").append(`
                    <h1 class="twc-summary-title">${item.title}</h1>
                    <div class="twc-summary-image-container">
                        <img src="${convertToThumbnailUrl(item.video_url)}" alt="${item.title}">
                    </div>
                    <div class="twc-summary-subtitle-container">
                        <div class="twc-summary-tag" style="background-color: ${item.kind === "taller" ? "#A5D6D9" : "#eb947e6e"};">${item.kind}</div>
                        <div class="twc-summary-date">${item.date}</div>
                    </div>
                    <p class="twc-summary-description">${item.description}</p>
                    <p class="twc-summary-exposes">${item.exposes}</p>
                    <div class="twc-summary-button-container">
                        <a class="twc-summary-button" href="/dashboard?display=1&displayId=${item.id}" target="_self">Ver ${item.kind}</a>
                    </div>
                `);
            }
        } else {
            $(".twc-summary").append(`
                <p class="twc-summary-empty-message">¡Próximamente más talleres y webinars!</p>
            `);
        }
        $(".twc-container").show();
        $(".twc-error-container").hide();
    }
}

function fillCapsulas(items){
    $("#twc-main").html(`
    <a class="back-to-landing-button" href="/dashboard">
        <i class="fa fa-arrow-left" aria-hidden="true"></i>
        Volver a Aprendizaje Profesional
    </a>
    <h1 class="landing-title">Cápsulas</h1>
    <p class="landing-description">Aquí podrás acceder a cápsulas con contenido pedagógico que puede resultar útil para tu formación docente.</p>
    <hr>
    <div class="twc-container">
        <div class="twc-content">
            <div class="twc-content-error-container" style="display: none;">
                <p>La cápsula seleccionada no existe.</p>
            </div>
            <h1 class="twc-content-title"></h1>
            <div class="twc-content-video-container"></div>
            <div class="twc-content-subtitle-container"></div>
            <p class="twc-content-description"></p>
        </div>
        <hr class="twc-mobile-separator">
        <div class="twc-summary">
        </div>
    </div>
    <div class="twc-error-container" style="display: none;">
        <p>No hay cápsulas disponibles.</p>
    </div>
    `);
    if (items.active == null && items.summarizedItems.length === 0){
        $(".twc-container").hide();
        $(".twc-error-container").show();
    } else {
        if (items.active == null){
            $(".twc-content-error-container").show();
        } else {
            $(".twc-content-title").text(items.active.title);
            var videoEmbed = `<iframe src="${convertToEmbedUrl(items.active.video_url)}" frameborder="0" allowfullscreen></iframe>`;
            $(".twc-content-video-container").append(videoEmbed);
            $(".twc-content-subtitle-container").append(`
                <div class="twc-content-tag" style="background-color: #A5D6D9">${items.active.tag}</div>
                <div class="twc-content-date">${items.active.date}</div>
            `);
            $(".twc-content-description").text(items.active.description);
        }
        if (items.summarizedItems.length !== 0) {
            var first = true;
            items.summarizedItems.sort((a, b) => b.priority - a.priority);
            for(let item of items.summarizedItems) {
                if (!first) {
                    $(".twc-summary").append("<hr>")
                }
                first = false;
                $(".twc-summary").append(`
                    <h1 class="twc-summary-title">${item.title}</h1>
                    <div class="twc-summary-image-container">
                        <img src="${convertToThumbnailUrl(item.video_url)}" alt="${item.title}">
                    </div>
                    <div class="twc-summary-subtitle-container">
                        <div class="twc-summary-tag" style="background-color: #A5D6D9">${item.tag}</div>
                        <div class="twc-summary-date">${item.date}</div>
                    </div>
                    <p class="twc-summary-description">${item.description}</p>
                    <div class="twc-summary-button-container">
                        <a class="twc-summary-button" href="/dashboard?display=2&displayId=${item.id}" target="_self">Ver cápsula</a>
                    </div>
                `);
            }
        } else {
            $(".twc-summary").append(`
                <p class="twc-summary-empty-message">¡Próximamente más cápsulas!</p>
            `);
        }
        $(".twc-container").show();
        $(".twc-error-container").hide();
    }
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
        if (item.id === displayId){
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
    if (activeItem == null && displayId === 0){
        activeItem = defaultItem;
    }
    if (activeItem != null){
        summarizedItems = summarizedItems.filter(function(item) {
            return item.id !== activeItem.id;
        });
    }
    return {"active": activeItem, "summarizedItems": summarizedItems, "defaultItem": defaultItem}
}

function convertToEmbedUrl(youtubeUrl) {
    const match = youtubeUrl.match(/v=([\w-]+)/);
    if (match && match[1]) {
        return 'https://www.youtube.com/embed/' + match[1];
    }
    return youtubeUrl;
}

function convertToThumbnailUrl(youtubeUrl) {
    const match = youtubeUrl.match(/v=([\w-]+)/);
    if (match && match[1]) {
        return 'https://img.youtube.com/vi/' + match[1] + '/mqdefault.jpg';
    }
    return null;
}
