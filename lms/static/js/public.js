$(document).ready(function() {
    let display = getUrlParameter("display");
    if (display === "1" || display === "2" || display === "3") {
        let displayId = getUrlParameter("displayId");
        if (displayId == null || isNaN(parseInt(displayId))) {
            showTalleresWebinarsCapsulas(display, 0);
        } else {
            showTalleresWebinarsCapsulas(display, parseInt(displayId));
        }
    } else if (display === "101") {
        showVideoCurso();
    } else {
        hideTalleresWebinarsCapsulas();
    }
});