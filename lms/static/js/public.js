$(document).ready(function() {
    let display = getUrlParameter("display");
    let displayId = getUrlParameter("displayId");
    if (display != null){
        if (display === "100") {
            showVideoCurso(displayId);
        } else {
            window.location.href = "/";
        }
    }
});

function showVideoCurso(displayId) {
    $("section.home").hide();
    const ipd = [
        "redfid+MODULO1REDFID+2022",
        "redfid+REDFID_IPD_ELEAR_SLF_02+2023_2"
    ];
    if (ipd.includes(displayId)) {
        $("#twc-main").html(`
            <a class="back-to-landing-button" href="/">
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
                <a class="ipd-video-register" href="https://www.redfid.cl/formulario-de-registro" target="_self">¡Quiero inscribirme!</a>
            </div>
        `);
    } else {
        $("#twc-main").html(`
            <a class="back-to-landing-button" href="/">
                <i class="fa fa-arrow-left" aria-hidden="true"></i>
                Volver a Aprendizaje Profesional
            </a>
            <a class="back-to-landing-button" href="/courses">
                <i class="fa fa-arrow-left" aria-hidden="true"></i>
                Volver a Cursos Disponibles
            </a>
            <h1 class="landing-title">Este curso no posee vídeo promocional.</h1>
            <div class="ipd-video-register-link-container">
                <a class="ipd-video-register" href="https://www.redfid.cl/formulario-de-registro" target="_self">¡Quiero inscribirme!</a>
            </div>
        `);
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
