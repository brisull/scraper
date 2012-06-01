<?php
require_once( 'simplehtmldom/simple_html_dom.php');
class Scraper
{
    private $rawHtml = '';
    private $scrapedPage;
    
    function __construct($scrapedPage){
    	$this->scrapedPage = $scrapedPage ;
        $this->rawHtml = $this->grab_page();
        if ( strpos( substr($this->rawHtml,0,16), '404' ) !== false ) {
        	$this->scrapedPage->title = 'Error';
        	$this->scrapedPage->description = 'Page not found (404)';
        }
        else {
			$this->scrapeUrl();
		}
    }
    
    public function getScrapedPage() {
    	return $this->scrapedPage;	
    }
    
    
    private function grab_page(){
        $this->CurlOP = array(
            CURLOPT_RETURNTRANSFER    => true,    // return web page
            CURLOPT_HEADER        => true,    // don't return headers
            CURLOPT_FOLLOWLOCATION    => true,    // follow redirects
            CURLOPT_ENCODING    => "",        // handle all encodings
            CURLOPT_USERAGENT    => "LWS V1.0",    // who am i
            CURLOPT_AUTOREFERER    => true,    // set referer on redirect
            CURLOPT_CONNECTTIMEOUT    => 120,        // timeout on connect
            CURLOPT_TIMEOUT        => 120,        // timeout on response
            CURLOPT_MAXREDIRS    => 10,        // stop after 10 redirects
            CURLOPT_SSL_VERIFYHOST    => 0,        // don't verify ssl
            CURLOPT_SSL_VERIFYPEER    => false,    //
        );
        $this->ch = curl_init($this->scrapedPage->url);
        curl_setopt_array($this->ch,$this->CurlOP);
        $this->Data = curl_exec($this->ch);
        curl_close($this->ch);
        return $this->Data;
    }
    
    
    
    private function lastIndexOf($string,$item){
    $index=strpos(strrev($string),strrev($item));  
    if ($index){  
        $index=strlen($string)-strlen($item)-$index;  
        return $index;  
    }  
        else  
        return -1;  
	}
	
	private function scrapeUrl() {
        $info = $this->scrapedPage;
        
        // Use simple_html_dom to parse the page data
        $html = str_get_html($this->rawHtml);
        
        //Grab the page title
        $info->title = trim($html->find('title', 0)->plaintext);
        
        //Grab the page description
        foreach($html->find('meta') as $meta) {
			if ($meta->name == "description") {
				$info->description = trim($meta->content);
            }
            if ( strpos( $meta->property, 'og:' ) !== false ) {
            	$info->facebookMeta[substr($meta->property, 3)] = trim($meta->content);
            }
        }
        //Grab the image URLs
        $imgArr = array();
        foreach($html->find('img') as $element)
        {
                $rawUrl = $element->src;

                //Turn any relative Urls into absolutes
                
                if (substr($rawUrl,0,4)=="http") {
					$imgArr[] = $rawUrl ;
                }
                else if ( substr( $rawUrl,0,2 ) == "//" ) {
                	continue;	
                }
                else if ( strlen( $rawUrl > 10 ) ) {
                	$imgArr[] = substr( $this->scrapedPage->url,0, $this->lastIndexOf($this->scrapedPage->url, '/') ) . $rawUrl	;
                }
        }
        // second loop to get image sizes
        $finalImgArr = array();
        foreach ( $imgArr as $img ) {
        	 // $imgSize = getimagesize( $img );
        	 $finalImgArr[] = array('src' => $img, 'sizeInfo' => '{}' );
        }
        $info->images = $finalImgArr;
        
        return $info;
    }
   
}
?>
