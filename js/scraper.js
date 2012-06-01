    var Scraper = function(scrapedPage) {
        var self = this;
        this.scrapedPage = scrapedPage;
        this.displayBox = jQuery("#display_box");
        this.display = "";
        
        self.handleScrapedPageSuccess = function() {
           if ( self.scrapedPage.title ) {
               self.display += "<h1 class='title'>"+ self.scrapedPage.title +"</h1>";
           }
           if ( self.scrapedPage.image ) {
               self.display += "<div class='img-carousel'><img src='"+ self.scrapedPage.image +"' width='100' /></div>";
           }
           if ( self.scrapedPage.url ) {
               self.display += "<a class='link' href='"+ self.scrapedPage.url +"'>"+ self.scrapedPage.url +"</a>";
           }
           if ( self.scrapedPage.description ) {
               self.display += "<p class='description'>"+ self.scrapedPage.description +"</p>";
           }
           self.displayBox.html( self.display );
           
           if ( self.scrapedPage.images ) {
               self.getSiteImages();
           }
        };
        
        
        self.handleScrapedPageFailure = function() {
            console.log( 'fail' );   
        };
        
        self.displaySiteImage = function(img) {
            this.displayBox.find(".img-carousel").append('<img src="'+ img.src +'" width="100" />');
        };
        
        self.getSiteImages = function() {
            self.scrapedPage.imageChoices = new Array();
            for ( var i in self.scrapedPage.images ) {
                var img = self.scrapedPage.images[i];
                self.getImageSize(img);
            }
            return true;
        };
    
        self.addImageToChoices = function(img) {
            self.scrapedPage.imageChoices.push(img);
            self.displaySiteImage(img);
        };
        
        self.getImageSize = function(img) {
            var image = new Image();
             if ( jQuery.browser.msie && parseInt($.browser.version, 10) < 9 ) {
                img.src += "?" + new Date().getTime();
            }
            image.src = img.src;
           
            $(image).load( function(response) {
                if ( self.scrapedPage.imageChoices.length <= 10 && image.height > 199 && image.width > 199 ) {
                   self.addImageToChoices(img);
                }
            });
            
        };
        
        
    };

   

