<?php
require_once( '/php/class.ScrapedPage.php');



	$url = 'http://www.microsoft.com/windows/pc-selector/';
	$page = new ScrapedPage($url);
	// echo '<pre>';
    // print_r( $page );
    // echo '</pre>';
    echo  $page->_toJson(); 

?> 
