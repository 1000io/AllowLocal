/*!
 * Allow Local beta0.0.0 ~ Copyright (c) 2012 1000io, http://1000io.com 
 * Documentación sobre localización:
 * Explorer: http://msdn.microsoft.com/es-es/library/gg589502(v=vs.85).aspx
 */

//Variables de configuración
var timeout         = 3000; //Tiempo de espera en milisegundos
var userLangDefault = 'US'; //Lenguaje por defecto

intl = {
    ES: 'Permita la localización de esta página.',
    US: 'Allow geolocation in this page.'
}

//Inicialización de variables
var AlowLocal_yes   = 0;

//Funciones de detección de navegadores
var BrowserDetect = {
  init: function () {
            this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
            this.version = this.searchVersion(navigator.userAgent)
                    || this.searchVersion(navigator.appVersion)
                    || "an unknown version";
            this.OS = this.searchString(this.dataOS) || "an unknown OS";
	},
	searchString: function (data) {
            for (var i=0;i<data.length;i++)	{
                var dataString = data[i].string;
                var dataProp = data[i].prop;
                this.versionSearchString = data[i].versionSearch || data[i].identity;
                if (dataString) {
                    if (dataString.indexOf(data[i].subString) != -1)
                            return data[i].identity;
                }
                else if (dataProp)
                    return data[i].identity;
            }
	},
	searchVersion: function (dataString) {
            var index = dataString.indexOf(this.versionSearchString);
            if (index == -1) return;
            return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
            {string: navigator.userAgent,subString: "Chrome",identity: "Chrome"},
            {string: navigator.userAgent,subString: "OmniWeb",versionSearch: "OmniWeb/",identity: "OmniWeb"},
            {string: navigator.vendor,subString: "Apple",identity: "Safari",versionSearch: "Version"},
            {prop: window.opera,identity: "Opera",versionSearch: "Version"},
            {string: navigator.vendor,subString: "iCab",identity: "iCab"},
            {string: navigator.vendor,subString: "KDE",identity: "Konqueror"},
            {string: navigator.userAgent,subString: "Firefox",identity: "Firefox"},
            {string: navigator.vendor,subString: "Camino",identity: "Camino"},
            // for newer Netscapes (6+)
            {string: navigator.userAgent,subString: "Netscape",identity: "Netscape"},
            {string: navigator.userAgent,subString: "MSIE",identity: "Explorer",versionSearch: "MSIE"},
            {string: navigator.userAgent,subString: "Gecko",identity: "Mozilla",versionSearch: "rv"},
            // for older Netscapes (4-)
            {string: navigator.userAgent,subString: "Mozilla",identity: "Netscape",versionSearch: "Mozilla"}
	],
	dataOS : [
            {string: navigator.platform,subString: "Win",identity: "Windows"},
            {string: navigator.platform,subString: "Mac",identity: "Mac"},
            {string: navigator.userAgent,subString: "iPhone",identity: "iPhone/iPod"},
            {string: navigator.platform,subString: "Linux",identity: "Linux"}
	]
}

function getLang() {
   
    var lang;
    if (typeof navigator.userLanguage != "undefined") {
        lang = navigator.userLanguage.toUpperCase( );
    } else if (typeof navigator.language != "undefined") {
        lang = navigator.language.toUpperCase( );
    }
    return (lang);

}

function ocultarAviso(){
    $(".AllowLocal_overlay").css("display", "none"); //Ocultamos Capa overlay
    $(".AllowLocal_balloon_"+BrowserDetect.browser).css("display", "none"); //Ocultamos Capa Balloon        
}

function animarAviso(direccion){
    if (direccion == 'up') { //animación de globo en parte inferior de pantalla
        $("#AllowLocal_balloon").delay(1800).fadeIn(100).animate({bottom:"+=20px"},100).animate({bottom:"-=20px"},100).animate({bottom:"+=20px"},100).animate({bottom:"-=20px"},100).animate({bottom:"+=20px"},100).animate({bottom:"-=20px"},100).animate({bottom:"+=20px"},100).animate({bottom:"-=20px"},100);
    } else { //animación de globo en parte superior de pantalla
        $("#AllowLocal_balloon").delay(1800).fadeIn(100).animate({top:"+=20px"},100).animate({top:"-=20px"},100).animate({top:"+=20px"},100).animate({top:"-=20px"},100).animate({top:"+=20px"},100).animate({top:"-=20px"},100).animate({top:"+=20px"},100).animate({top:"-=20px"},100);
    }
}

function avisaNavegador() {
    switch(AlowLocal_yes) {
        case -1: //Navegador NO compatible
            alert("Su navegador no soporta geolocalización");
            break;        
        case 0: //NO se ha compartido la geolocalización
            BrowserDetect.init(); //Comprobamos navegador
            if (BrowserDetect.browser != 'Safari') {
                $("body").append('<div class="AllowLocal_overlay"></div>'); //Mostramos Capa overlay
                var userLang = getLang();
                if (userLang in intl) alert_text = intl[userLang];
                else alert_text = intl[userLangDefault];
                $("body").append('<div id="AllowLocal_balloon" class="AllowLocal_balloon AllowLocal_balloon_'+BrowserDetect.browser+'">'+alert_text+'<a id="allowlocal_close_b" href="javascript:ocultarAviso();">Cerrar</a></div>'); //Mostramos Balloon
                if (BrowserDetect.browser == 'Explorer') animarAviso('up'); 
                else animarAviso('down');
            }
            break;
        case 1: //SI se ha compartido la geolocalización
            ocultarAviso(); //Ocultamos aviso
            alert("Se ha compartido correctamente la geolocalización");
            break;            
    }
}

function successFunction(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    AlowLocal_yes = 1;
    ocultarAviso(); //Ocultamos aviso
    alert('Your latitude is :'+lat+' and longitude is '+lon);
}

function errorFunction(error) {
    AlowLocal_yes = 0;
    var message = "";  

    // Check for known errors
    switch (error.code) {
      case error.PERMISSION_DENIED:
          message = "This website does not have permission to use " + 
                    "the Geolocation API";
          break;
       case error.POSITION_UNAVAILABLE:
          message = "The current position could not be determined.";
          break;
       case error.TIMEOUT:
          message = "The current position could not be determined " + 
                    "within the specified timeout period.";            
          break;
    }

    // If it is an unknown error, build a message that includes 
    // information that helps identify the situation so that 
    // the error handler can be updated.
    if (message == "")
    {
        var strErrorCode = error.code.toString();
        message = "The position could not be determined due to " + 
                  "an unknown error (Code: " + strErrorCode + ").";
    }
    alert(message);

}

//Forzamos la petición de compartir localización
jQuery(document).ready(function(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
    } else {
        AlowLocal_yes = -1;
        alert('It seems like Geolocation, which is required for this page, is not enabled in your browser. Please use a browser which supports it.');
    }       
});

//Lanzamos el proceso de revisión de configuración
jQuery(document).ready(function(){
    setTimeout(function(){avisaNavegador();},timeout)
});
