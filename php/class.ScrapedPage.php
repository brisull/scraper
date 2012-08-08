<?php
require_once( 'class.Scraper.php');

class ScrapedPage
{
	private $rawHtml = '';
	public $url;
	public $depth;
	public $title;
	public $description;
	public $frames;
	public $embeds;
	public $video;
	public $video_type;
	public $video_width;
	public $video_height;
	public $facebookMeta = array();
	public $images;
	
	function __construct($url = null, $depth = 0) {
        $this->url = $url;
        $this->depth = $depth;
        $scraper = new Scraper( $this );
    }
    
	public function _toJson() {
		$retVal = array() ;
		$retVal['url'] = $this->url ;
		$retVal['title'] = $this->title ;
		$retVal['description'] = $this->description ;
		$retVal['frames'] = $this->frames ;
		$retVal['embeds'] = $this->embeds ;
		$retVal['video'] = $this->video ;
		$retVal['video:type'] = $this->video_type ;
		$retVal['video:height'] = $this->video_height ;
		$retVal['video:width'] = $this->video_width ;
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

		// Promote video tags from iframe if parent is empty 
		$videoTags = array('video', 'video:type', 'video:width', 'video:height');
		if ( empty($retVal['video'] ) ) {
			foreach ( $this->frames as $frame ) {
				$frame = json_decode($frame);
				foreach( $frame as $property => $content  ) {
					if ( in_array( $property, $videoTags ) && !empty($content) ) {
						$retVal[$property] = trim($content) ;
					}
				}
			}
		}
			
		// print_r( $retVal );
		return json_encode($retVal);
	}
}
?>
