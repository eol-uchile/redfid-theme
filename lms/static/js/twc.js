$(document).ready(function() {
    let display = getUrlParameter("display");
    if (display === "1" || display === "2" || display === "3") {
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

CAPSULAS = {
    "rep": {
        "color": "#e36a5b",
        "name": "Estudio propio"
    },
    "reo": {
        "color": "#7783dc",
        "name": "Estudio realizado por otro"
    },
    "rhii": {
        "color": "#83cce5",
        "name": "Habilidad de innovación o investigación"
    },
    "reac": {
        "color": "#b282dc",
        "name": "Elementos a considerar para enseñar algo"
    },
    "rap": {
        "color": "#e1d883",
        "name": "Actividad pedagógica"
    }
}

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
            fillTalleres({"active": null, "default": null, "summarizedItems": []});
        });
    } else if (display === "2") {
        $.getJSON('https://static.redfid.cl/capsulas/capsulas.json', function(data){
            items = getAndClassifyItems(data, displayId);
            if (displayId === 0 && items["defaultItem"] != null) {
                setUrlParameter('displayId', items["defaultItem"]["id"]);
            }
            fillCapsulas(items);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            fillCapsulas({"active": null, "default": null, "summarizedItems": []});
        });
    } else if (display === "3") {
        fillCreateCapsula()
    } else {
        window.location.href = "/dashboard";
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

function fillCreateCapsula() {
    $("#twc-main").html(`
    <a class="back-to-landing-button" href="/dashboard">
        <i class="fa fa-arrow-left" aria-hidden="true"></i>
        Volver a Aprendizaje Profesional
    </a>
    <a class="back-to-landing-button" href="/dashboard?display=2">
        <i class="fa fa-arrow-left" aria-hidden="true"></i>
        Volver a Cápsulas
    </a>
    <h1 class="landing-title">Crear cápsula</h1>
    <p class="landing-description">
    Si deseas aportar con una cápsula a la comunidad RedFID, por favor seleccione una categoría y la institución asociada. Se le proporcionará una plantilla de 
    PowerPoint, sobre la cual podrá armar su cápsula, y un documento con instrucciones para realizar la grabación.
    </p>
    <hr>
    <div class="twc-create-container">
        <div class="twc-create-capsula-input-container">
            <p>Tipo de cápsula:</p>
            <select>
                <option value="waiting" disabled selected>Por favor seleccione una opción...</option>
                <option value="rep">Estudio propio</option>
                <option value="reo">Estudio realizado por otro</option>
                <option value="rhii">Habilidades para la innovación e investigación</option>
                <option value="reac">Elementos a considerar para enseñar algo</option>
                <option value="rap">Actividad pedagógica</option>
            </select>
        </div>
        <div class="twc-create-capsula-input-container">
            <p>Institución asociada</p>
            <select>
                <option value="waiting" disabled selected>Por favor seleccione una opción...</option>
                <option value="uch">Universidad de Chile</option>
                <option value="puc">Pontificia Universidad Católica de Chile</option>
            </select>
        </div>
    </div>
    `);

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
            <div class="twc-content-date"></div>
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
            $(".twc-content-date").text(items.active.date);
            var videoEmbed = `<iframe src="${convertToEmbedUrl(items.active.video_url)}" frameborder="0" allowfullscreen></iframe>`;
            $(".twc-content-video-container").append(videoEmbed);
            $(".twc-content-subtitle-container").append(`
                <div class="twc-content-tag" style="background-color: ${items.active.kind === "taller" ? "#A5D6D9" : "#eb947e6e"};">${items.active.kind}</div>
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
                    <div class="twc-summary-date">${item.date}</div>
                    <div class="twc-summary-image-container">
                        <a href="/dashboard?display=1&displayId=${item.id}" target="_self"><img src="${convertToThumbnailUrl(item.video_url)}" alt="${item.title}"></a>
                    </div>
                    <div class="twc-summary-subtitle-container">
                        <div class="twc-summary-tag" style="background-color: ${item.kind === "taller" ? "#A5D6D9" : "#eb947e6e"};">${item.kind}</div>
                    </div>
                    <p class="twc-summary-description">${item.description}</p>
                    <p class="twc-summary-exposes">${item.exposes}</p>
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
    <div class="twc-title-container">
        <h1 id="capsulas-title" class="landing-title">Cápsulas</h1>
        <a class="create-capsula-button" href="/dashboard?display=3" target="_self">Crear cápsula</a>
    </div>
    <p class="landing-description">Aquí podrás acceder a cápsulas con contenido pedagógico que puede resultar útil para tu formación docente.</p>
    <hr>
    <div class="twc-container">
        <div class="twc-content">
            <div class="twc-content-error-container" style="display: none;">
                <p>La cápsula seleccionada no existe.</p>
            </div>
            <h1 class="twc-content-title"></h1>
            <div class="twc-content-date"></div>
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
            $(".twc-content-date").text(items.active.date);
            var videoEmbed = `<iframe src="${convertToEmbedUrl(items.active.video_url)}" frameborder="0" allowfullscreen></iframe>`;
            $(".twc-content-video-container").append(videoEmbed);
            $(".twc-content-subtitle-container").append(`
            <div class="twc-content-tag" style="background-color: ${CAPSULAS[items.active.kind]["color"]};">${CAPSULAS[items.active.kind]["name"]}</div>
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
                    <div class="twc-summary-date">${item.date}</div>
                    <div class="twc-summary-image-container">
                        <a href="/dashboard?display=2&displayId=${item.id}" target="_self"><img src="${convertToThumbnailUrl(item.video_url)}" alt="${item.title}"></a>
                    </div>
                    <div class="twc-summary-subtitle-container">
                        <div class="twc-summary-tag" style="background-color: ${CAPSULAS[item.kind]["color"]};">${CAPSULAS[item.kind]["name"]}</div>
                    </div>
                    <p class="twc-summary-description">${item.description}</p>
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