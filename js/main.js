/* Author: BS

*/

function handlePasteEvent(el) {
    // "http(s) links
    var reg1 = /(\b(https?):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/im;
    // "www" links
    var reg2 = /(^|[^\/])(www\.[\S]+(\b|$))/im;
    var urlMatchArr = jQuery(el).val().match(reg1);
    if ( urlMatchArr == null ) {
        urlMatchArr = jQuery(el).val().match(reg2); 
    }
    if ( urlMatchArr == null ) {
        return false;   
    }
    var jqxhr = jQuery.post("php/scrape.php", {
            url: urlMatchArr[0]
        }, "json")
        .success(function(data) {
             scrapedPageData = jQuery.parseJSON( data );
             scrapedPage = new Scraper( scrapedPageData );
             if ( scrapedPage.title == "Error" ) {
                scrapedPage.handleScrapedPageFailure( scrapedPage );
             }
             else {
               scrapedPage.handleScrapedPageSuccess( scrapedPage );
             }
        })
        .error(function() {
            scrapedPage.handleScrapedPageFailure();
        });
}


jQuery(function($) {
    jQuery("#paste_url").bind("paste", function() {
        var el = $(this);
        setTimeout( function() {
            handlePasteEvent(el);
        }, 100 );
    });
});





