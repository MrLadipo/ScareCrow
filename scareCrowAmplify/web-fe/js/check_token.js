/*global WildRydes _config*/
var WildRydes = window.WildRydes || {};

(function rideScopeWrapper($) {
    var authToken;
    WildRydes.authToken.then(function setAuthToken(token) {
        if (token) {
            authToken = token;
        } else {
            window.location.replace('../../');
        }
    }).catch(function handleTokenError(error) {
        alert(error);
        window.location.replace('../../');
    });
 
}(jQuery));
