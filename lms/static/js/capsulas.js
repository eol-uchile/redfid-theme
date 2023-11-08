var authToken = null;

$(document).ready(function() {
    let display = getUrlParameter("display");
    if (display === "2") {
        console.log("cache check")
        if (!authToken) {
            loginUser();
        }
        let displayId = getUrlParameter("displayId");
        if (displayId == null || isNaN(parseInt(displayId))) {
            showCapsulas(display, 0);
        } else {
            showCapsulas(display, parseInt(displayId));
        }
    } else {
        hideCapsulas();
    }
});

function showCapsulas(display, displayId) {
    $("#dashboard-main").hide();
    if (display === "2"){
        makeAuthenticatedRequest('https://api.redfid.cl/get_capsulas', "GET", function(response) {
            fillCapsulas(response.capsulas);
        });
        // salio bien? hay capsulas?
        // ver si displayId es 0, en caso que no, validar, y si si, mostrar capsula correspondiente
    }
}

function hideCapsulas() {
    $("#capsulas-main").hide();
    $("#capsulas-image").on("click", function(){
        var currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('display', "2");
        currentUrl.searchParams.set('displayId', "0");
        window.location.href = currentUrl.toString(); 
    });
}

function fillCapsulas(items){
    console.log("CAPSULAS");
    console.log(items);
}

function loginUser(callback) {
    let username = 'redfid_user';
    let password = 'A290EmmAN821N9a982nfz8932MSFSF9nsdf9N32BGSGGmf8F';
    $.ajax({
        url: 'https://api.redfid.cl/login',
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({username: username, password: password}),
        success: function(response) {
            if (response.status === 100) {
                authToken = response.access_token;
                if (callback) {
                    callback();
                }
            } else {
                console.error("Login failed:", response.message);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("AJAX call for login failed", textStatus);
        }
    });
}

function makeAuthenticatedRequest(url, method, data, successCallback) {
    $.ajax({
        url: url,
        method: method,
        contentType: "application/json",
        processData: false, // Prevent jQuery from automatically transforming the data into a query string
        headers: {
            Authorization: 'Bearer ' + authToken
        },
        data: data ? JSON.stringify(data) : null, // Stringify data if present
        success: successCallback,
        error: function(jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 401) {
                // Token expired or unauthorized, login again and retry
                loginUser(function() {
                    // Retry the request with the new token
                    makeAuthenticatedRequest(url, method, data, successCallback);
                });
            } else {
                console.error(`AJAX call to ${url} failed`, textStatus, errorThrown);
            }
        }
    });
}
