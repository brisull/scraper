<?php
require_once( 'class.Scraper.php');

class ScrapedPage
{
	private $rawHtml = '';
	public $url;
	public $title;
	public $description;
	public $facebookMeta = array();
	public $images;
	
	function __construct($url = null) {
        $this->url = $url;
        $scraper = new Scraper( $this );
    }
    
	public function _toJson() {
		$retVal = array() ;
		$retVal['url'] = $this->url ;
		$retVal['title'] = $this->title ;
		$retVal['description'] = $this->description ;
		$retVal['images'] = $this->images ;
		
		// We prefer $faceBook Meta over regular
		foreach ( $this->facebookMeta as $property => $content ) {
			if ( array_key_exists( $property, $retVal ) && !empty($content) ) {
				$retVal[$property] = trim($content) ;
			}
			if ($property == 'image' && !empty($content) ) {
				$retVal[$property] = trim($content) ;
			}
		}
		return json_encode($retVal);
	}
}
?>
