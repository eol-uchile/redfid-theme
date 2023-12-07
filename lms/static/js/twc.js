$(document).ready(function() {
    let display = getUrlParameter("display");
    let displayId = getUrlParameter("displayId");
    if (display === "1" || display === "2" || display === "3") {
        if (displayId == null || isNaN(parseInt(displayId))) {
            showTalleresWebinarsCapsulas(display, 0);
        } else {
            showTalleresWebinarsCapsulas(display, parseInt(displayId));
        }
    } else if (display === "100") {
        showVideoCurso(displayId);
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

function showVideoCurso(displayId) {
    $("#dashboard-main").hide();
    const ipd = [
        "redfid+MODULO1REDFID+2022",
        "redfid+REDFID_IPD_ELEAR_SLF_02+2023_2"
    ];
    if (ipd.includes(displayId)) {
        $("#twc-main").html(`
            <a class="back-to-landing-button" href="/dashboard">
                <i class="fa fa-arrow-left" aria-hidden="true"></i>
                Volver a Aprendizaje Profesional
            </a>
            <h1 class="landing-title">Indagación de la Práctica Docente</h1>
            <p class="landing-description">
                Este curso tiene como finalidad comprender la indagación de la propia práctica docente como una estrategia que posibilita la mejora de la enseñanza en los procesos de formación docente inicial en matemática. Los participantes analizarán situaciones de su propia experiencia docente que les han resultado problemáticas o que quisieran mejorar, a fin de reconocer en ellas oportunidades para un aprendizaje profesional situado y sostenido.
            </p>
            <p class="landing-description">
                El curso está organizado en tres talleres. En primer lugar, se define y caracteriza lo que constituye un problema de la propia práctica docente situado en el contexto de la formación inicial docente. En segundo lugar, se describe las características asociadas a un proceso de la indagación de la propia práctica. Por último, en tercer lugar, se aplican los conceptos aprendidos en la delimitación de un problema de la propia práctica docente factible de indagar.
            </p>
            <div class="ipd-video-iframe">
                <iframe src="https://www.youtube.com/embed/0LftVNmm5us" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>
            </div>
            <div class="ipd-video-register-link-container">
                <a class="ipd-video-register" href="/courses/course-v1:${ipd[ipd.length-1]}/about" target="_self">¡Quiero inscribirme!</a>
            </div>
        `);
    } else {
        window.location.href = "/dashboard";
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
            <p>Categoría de cápsula:</p>
            <select id="twc-select-category">
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
            <select id="twc-select-institution">
                <option value="waiting" disabled selected>Por favor seleccione una opción...</option>
                <option value="other">Otra/Mútliples</option>
                <option value="puc">Pontificia Universidad Católica de Chile</option>
                <option value="pucv">Pontificia Universidad Católica de Valparaíso</option>
                <option value="unach">Universidad Adventista de Chile</option>
                <option value="uah">Universidad Alberto Hurtado</option>
                <option value="unap">Universidad Arturo Prat</option>
                <option value="uab">Universidad Autónoma de Barcelona</option>
                <option value="ubo">Universidad Bernardo O'Higgins</option>
                <option value="ucen">Universidad Central</option>
                <option value="ucn">Universidad Católica del Norte</option>
                <option value="ucsc">Universidad Católica de la Santísima Concepción</option>
                <option value="uct">Universidad Católica de Temuco</option>
                <option value="uda">Universidad de Atacama</option>
                <option value="uch">Universidad de Chile</option>
                <option value="udec">Universidad de Concepción</option>
                <option value="umag">Universidad de Magallanes</option>
                <option value="uoh">Universidad de O'Higgins</option>
                <option value="usach">Universidad de Santiago de Chile</option>
                <option value="utalca">Universidad de Talca</option>
                <option value="uta">Universidad de Tarapacá</option>
                <option value="ubb">Universidad del Biobío</option>
                <option value="udd">Universidad del Desarrollo</option>
                <option value="ufro">Universidad de La Frontera</option>
                <option value="userena">Universidad de La Serena</option>
                <option value="udla">Universidad de Las Américas</option>
                <option value="ula">Universidad de Los Lagos</option>
                <option value="uft">Universidad Finnis Terrae</option>
                <option value="umayor">Universidad Mayor</option>
                <option value="umce">Universidad Metropolitana de Ciencias de la Educación</option>
                <option value="uss">Universidad San Sebastián</option>
                <option value="ust">Universidad Santo Tomas</option>
            </select>
        </div>
    </div>
    <div class="twc-download-template-container">
        <a id="twc-download-template" target="_self">
            Descargar plantilla
        </a>
    </div>
    <div class="twc-download-instructions-container">
        <a class="download-capsula-instructions" href="https://static.redfid.cl/capsulas/CapsulasRedFID.pdf" download="">
            <i class="fa fa-arrow-down" aria-hidden="true"></i>
            Instrucciones para grabación
        </a>
    </div>
    <div class="multiple-institutions-warning-container">
        <p>Ha seleccionado como institución asociada 'Otra/Múltiples'. Deberá incluir manualmente los logotipos de las instituciones en la diapositiva de portada de la cápsula.</p>
    </div>
    <div class="download-link-warning-container">
        <p>Por favor, seleccione una categoría y una institución antes de descargar la plantilla.</p>
    </div>
    <hr>
    <p class="landing-description">
        Una vez que la cápsula se encuentre lista, por favor envíela adjunta a <a class="twc-mailto" href="mailto:capsulas@redfid.cl">capsulas@redfid.cl</a> para que sea revisada. 
        Tras ser aceptada por la administración, se le notificará por correo y se publicará la cápsula.
    </p>
    `);
    const categorySelect = document.querySelector('#twc-select-category');
    const institutionSelect = document.querySelector('#twc-select-institution');
    const downloadLink = document.querySelector('#twc-download-template');
    const downloadLinkWarningContainer = document.querySelector('.download-link-warning-container');

    function updateDownloadLink() {
        const categoryValue = categorySelect.value;
        const institutionValue = institutionSelect.value;
        const warningContainer = document.querySelector('.multiple-institutions-warning-container');
        downloadLinkWarningContainer.style.display = 'none';
        if (institutionValue === 'other') {
            warningContainer.style.display = 'block';
        } else {
            warningContainer.style.display = 'none';
        }
        if (categoryValue !== 'waiting' && institutionValue !== 'waiting') {
            downloadLink.disabled = false;
            const institutionPart = institutionValue === 'other' ? 'any' : institutionValue;
            downloadLink.href = `https://static.redfid.cl/capsulas/templates/${categoryValue.toUpperCase()}_${institutionPart.toUpperCase()}.ptox`;
            downloadLink.setAttribute('download', '');
        } else {
            downloadLink.disabled = true;
        }
    }

    downloadLink.addEventListener('click', function(event) {
        if (!downloadLink.getAttribute('href')) {
            event.preventDefault(); // Prevent default action if href is not valid
            downloadLinkWarningContainer.style.display = 'block';
        }
    });

    categorySelect.addEventListener('change', updateDownloadLink);
    institutionSelect.addEventListener('change', updateDownloadLink);
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