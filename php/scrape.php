<?php
require_once( 'class.ScrapedPage.php');

if ( strtolower($_SERVER['REQUEST_METHOD']) == 'post' || !empty( $_POST['url'] ) ) {
	$url = trim($_POST['url']);
	if ( (substr($url,0,3)=="www") ) {
		$url = 'http://' . $url;	
	}
	$page = new ScrapedPage($url,0);
	echo $page->_toJson(); 
}
?> 
