(function($){  
 $.fn.fetchUrl = function(options) {  
  var plugin = this;
  plugin.defaults = { 
   show: ['title', 'url', 'description', 'video', 'fbimage', 'moreImages']
  };
  

  plugin.options = $.extend(plugin.defaults, options);  
  
  var Scraper = function( el, scrapedPageData) {
    var self = this;
    self.el = el; 
    self.scrapedPageData = scrapedPageData;
    self.displayId = 'images'+ Math.floor(Math.random()*1199999);
    self.scrapedPageData.imageBlock = jQuery('<div>');
   
    self.displayNextImage = function() {
        var currImg = jQuery("#"+ self.displayId +" img:visible");
        var imgCount = jQuery("#"+ self.displayId +" img").size()-1;
        if ( $(currImg).index() == imgCount ) {
            return false;   
        }
        if ( $(currImg).index() == imgCount-1 ) {
            jQuery("#"+ self.displayId +" a.next-image").hide();  
        }
        jQuery("#"+ self.displayId +" a.prev-image").show();
        currImg.fadeOut(200, function() {
           currImg.addClass("img-carousel-inactive").next("img").removeClass("img-carousel-inactive").fadeIn(200);
        });
    };
    
    self.displayPrevImage = function() {
        var currImg = jQuery("#"+ self.displayId +" img:visible");
        var imgCount = jQuery("#"+ self.displayId +" img").size();
        if ( $(currImg).index() == 0 ) {
            return false;   
        }
        if ( $(currImg).index() == 1 ) {
            jQuery("#"+ self.displayId +" a.prev-image").hide();  
        }
        jQuery("#"+ self.displayId +" a.next-image").show();
        currImg.fadeOut(200, function() {
           currImg.addClass("img-carousel-inactive").prev("img").removeClass("img-carousel-inactive").fadeIn(200);
        });
    }
    
    self.callback = function() {
      jQuery(".scrapedurl-container").remove();
      jQuery(self.el).after( '<div id="'+ self.displayId +'" class="scrapedurl-container"><div class="scrapedurl-box">'+ self._toHTML() +'</div></div>' );
      jQuery("#"+ self.displayId).on("click", "a.get-images", function(e) {
          e.preventDefault();
          self.getSiteImages();
          return false;
       });
      jQuery("#"+ self.displayId).on("click", "a.next-image", function(e) {
          e.preventDefault();
          self.displayNextImage();
          return false;
       });
      jQuery("#"+ self.displayId).on("click", "a.prev-image", function(e) {
          e.preventDefault();
          self.displayPrevImage();
          return false;
       });
      console.log(self);
    };
    if ( plugin.options.callback ) {
      self.callback = function() { plugin.options.callback(self)
      };
    }
    
    
    self.handleScrapedPageFailure = function() {
     self.scrapedPageData.title = 'Failed to load url' ;
     return self;
    };
    
    self._toJSON = function() {
       return self.scrapedPageData;
    }
    
    self._toHTML = function() {
      var ret = '';
      if ( self.scrapedPageData.title ) {
           ret += "<h1 class='title'>"+ self.scrapedPageData.title +"</h1>";
       }
       if ( self.scrapedPageData.imageBlock && self.scrapedPageData.image ) {
           ret += '<div class="img-carousel-wrapper">'+ self.scrapedPageData.imageBlock.html() +'</div>';
           jQuery("#"+ self.displayId+ " .img-carousel-wrapper").show();
       }
       if ( self.scrapedPageData.url ) {
           ret += "<a class='link' href='"+ self.scrapedPageData.url +"'>"+ self.scrapedPageData.url +"</a>";
       }
       if ( self.scrapedPageData.description ) {
           ret += "<p class='description'>"+ self.scrapedPageData.description +"</p>";
       }
       if ( self.scrapedPageData.video ) {
           ret += "<p class='video'><a href='"+ self.scrapedPageData.video +"'>"+ self.scrapedPageData.video +"</a></p>";
       }
      return ret;
    }
    
    self.handleScrapedPageSuccess = function() {
       
      
       if ( self.scrapedPageData.image ) {
        self.scrapedPageData.imageBlock.append('<div class="img-carousel"><img src="'+ self.scrapedPageData.image +'" /></div>');
       }
       if ( self.scrapedPageData.images && !self.scrapedPageData.image  ) {
           self.getSiteImages();
       }
       else if ( self.scrapedPageData.images ) {
           self.setupMoreImagesTrigger();
       }
       return self;
    };
    
    self.setupMoreImagesTrigger = function() {
       var morelinks = $('<div class="more-images"><a class="get-images" href="#">More images</a><a class="next-image"  style="display: none;" href="#">&gt;&gt;</a><a class="prev-image" style="display: none;" href="#">&lt;&lt;</a></div>');
      $(morelinks).appendTo(self.scrapedPageData.imageBlock);
    };   
    
    self.getSiteImages = function() {
        jQuery("#"+ self.displayId+ " a.get-images").remove();
        self.scrapedPageData.imageChoices = new Array();
        for ( var i in self.scrapedPageData.images ) {
            var img = self.scrapedPageData.images[i];
            self.getImageSize(img);
        }
        return self;
    };

    self.addImageToChoices = function(img) {
        self.scrapedPageData.imageChoices.push(img);
        jQuery("#"+ self.displayId).find(".img-carousel").append('<img class="img-carousel-inactive" src="'+ img.src +'" />');
        jQuery("#"+ self.displayId +" a.next-image").show();
        jQuery("#"+ self.displayId+ " .img-carousel-wrapper").show();
    };
    
    self.getImageSize = function(img) {
        var image = new Image();
         if ( jQuery.browser.msie && parseInt($.browser.version, 10) < 9 ) {
            img.src += "?" + new Date().getTime();
        }
        image.src = img.src;
       
        $(image).load( function(response) {
            if ( self.scrapedPageData.imageChoices.length <= 10 && image.height > 199 && image.width > 199 ) {
               self.addImageToChoices(img);
            }
        });
        
    };
  };
  
  plugin.getUrlFromText = function( text ) {
    var reg1 = /(\b(https?):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/im;
      // "www" links
      var reg2 = /(^|[^\/])(www\.[\S]+(\b|$))/im;
      var urlMatchArr = text.match(reg1);
      if ( urlMatchArr == null ) {
          urlMatchArr = text.match(reg2); 
      }
      if ( urlMatchArr == null ) {
          return false;   
      }
      return urlMatchArr[0];
  };
    
  plugin.handlePasteEvent = function(obj) {
    obj.body = (obj.val()) ? obj.val() : obj.html();
    var url = plugin.getUrlFromText( obj.body );
      if ( !url ) {
        return false;   
      }
      var jqxhr = jQuery.post("php/scrape.php", {
          url: url
      }, "json")
      .success(function(data) {
           var scrapedPageData = jQuery.parseJSON( data );
           scrapedPage = new Scraper( obj, scrapedPageData );
           if ( scrapedPage.title == "Error" ) {
              scrapedPage.handleScrapedPageFailure();
           }
           else {
             scrapedPage.handleScrapedPageSuccess();
             
           }
      })
      .error(function() {
          scrapedPage = new Scraper( obj, {"title": "Error"} );
          scrapedPage.handleScrapedPageFailure();
      })
      .complete(function() {
          obj.scrapedPage = scrapedPage;
          obj.scrapedPage.callback();
      });
      
  };
  
  
        
  return this.each(function(t) {
   obj = $(this);
   
  obj.bind("paste", function() {
        setTimeout( function() {
            plugin.handlePasteEvent(obj);
        }, 100 );
    });
  
  // obj.bind("keyup", function() {
  //       setTimeout( function() {
  //           plugin.handlePasteEvent(obj);
  //       }, 500 );
  //   });
     
  });  
 };  
})(jQuery);
