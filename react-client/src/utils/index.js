/**
 * ===============[ TABLE OF CONTENTS ]===============
 * 1. Functions
 *   1.1 generateRandomNumber()
 *   1.2 shuffle_array()
 *   1.3 runEffect()
 *   1.4 AlertMessage()
 ******************************************************/
/* ===============[ 1. FUNCTIONS ]====================*/
import $ from 'jquery';
var Utils = {
  /**
   * 1.1 generateRandomNumber
   * @param {int} min 
   * @param {max} max 
   */
  generateRandomNumber: function(min = 0, max = 10) {
    return Math.floor(Math.random() * Math.floor(+max - +min)) + +min;
  },

  /**
   * 1.2 shuffle_array
   * @param {array} some_array
   * @return {array} some_array - returns the shuffled version. 
   */
  shuffle_array: function(some_array){
    return some_array.sort( () => Math.random() - 0.5);
  },

  /**
   * 1.3 runEffect
   * Runs an effect on the given element. 
   * NOTE: this function depends on the following script links,
   * <script src="https://code.jquery.com/jquery-1.12.4.js"></script>
   * <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js" integrity="sha256-VazP97ZCwtekAsvgPBSUwPFKdrwD3unUfSGVYrahUqU=" crossorigin="anonymous"></script>
   * 
   * @param {element} element 
   * @param {integer} duration_seconds 
   * @param {string}  selectedEffect 
   */
  runEffect: function(element, duration_seconds=2, selectedEffect="pulsate") {
    // Most effect types need no options passed by default
    var options = {};
    
    // some effects have required parameters
    if ( selectedEffect === "scale" ) {
      options = { percent: 50 };
    } else if ( selectedEffect === "transfer" ) {
      options = { to: "#button", className: "ui-effects-transfer" };
    } else if ( selectedEffect === "size" ) {
      options = { to: { width: 200, height: 60 } };
    }
    
    // Run the effect
    element.effect( selectedEffect, options, ( (duration_seconds * 1000)/4 ), setTimeout(function(){
      element.removeAttr( "style" ).hide().fadeIn();
    }, duration_seconds * 1000));
  },

  /**
   * 1.4 AlertMessage()
   * @param {string} message - Message to go in the alert box
   * @param {string} addThisClass - defaults to empty string. Can be info, danger, or success. 
   */
  AlertMessage: function(message="", addThisClass="info", appendAfterElement){
    $('#alert_message').remove();

    var alertElement = $("<div>").addClass("col-12 alert").attr("id","alert_message");
    
    // RESET Alert Message
    if(message === ""){
      $("#main-section .first-row").empty();
      return;
      
    }else if (addThisClass === "info"){ 
      // Default alert
      addThisClass = "alert-info";
      
    }else if (addThisClass === "danger"){
      addThisClass = "alert-danger";
      
    }else if (addThisClass === "success"){
      addThisClass = "alert-success";
    }
    
    // IF same alert message keeps getting spammed then add ! and change color red
    if( $("#alert-messages").html() !== undefined && $("#alert-messages").html() === message ){
      message += "!";
      addThisClass = "alert-danger";
    }
    
    // Add the new class
    alertElement.addClass(addThisClass);
    
    // Display the alert message
    alertElement.html(message);

    if(appendAfterElement === undefined){
      appendAfterElement = $("#main-section");
    }

    appendAfterElement.prepend(alertElement);
    return;
  },

  getFormData: function (formID) {
    let formArray = $("#"+formID).serializeArray();
    var formData = {}; // NOTE: {} creates and object and [] creates an Array.

    for (var i in formArray) {
      var KEY = "";
      var VALUE = "";
  
      for (var key in formArray[i]) {
  
        if (key === "name") {
          KEY = formArray[i][key];
  
        } else if (key === "value") {
          VALUE = formArray[i][key];
        }
  
      }
      formData[KEY] = VALUE.trim();
      if (formData[KEY] === "") {
        return; // prevent empty entries into database
      }
    }

    return formData;
  },

  getBgStyle: function(){
    const bg_collection = [
      '/img/battle-bg1.gif',
      '/img/battle-bg2.webp',
      '/img/battle-bg3.webp',
      '/img/battle-bg4.webp',
      '/img/battle-bg5.webp',
      '/img/choose-hero-bg1.gif',
      '/img/choose-hero-bg2.gif',
      '/img/choose-hero-bg3.webp',
      '/img/choose-hero-bg4.webp',
      '/img/choose-hero-bg5.webp',
    ];

    let bg_url = bg_collection[Math.floor(Math.random()*bg_collection.length)];
    let bg_style = {
      backgroundImage: `url('${bg_url}')`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover'
    }

    return bg_style;
  },

}

export default Utils;