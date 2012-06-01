/* Author: BS

*/


// custom callback... do something with the data
function cb(data) {
    alert(data._toHTML());
    // console.log(data._toJSON());

}

jQuery(function($) {
        // use custom callback
        // jQuery("#paste_url").fetchUrl({callback: cb});
        
        // use default callback
        jQuery("#paste_url").fetchUrl();
});





