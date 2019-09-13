<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);
define('MY_DS', DIRECTORY_SEPARATOR);
require_once('../generic' . MY_DS . 'constants.php');
require_once(MY_APPLICATION_DIR . 'functions' . MY_DS . 'generic.php');
require_once('generic' . MY_DS . 'autorize.php');

function dircopy($srcdir, $dstdir, $verbose = false) {
  $num = 0;
  if(!is_dir($dstdir)) mkdir($dstdir);
  if($curdir = opendir($srcdir)) {
    while($file = readdir($curdir)) {
      if($file != '.' && $file != '..') {
        $srcfile = $srcdir . '/' . $file;
       $dstfile = $dstdir . '/' . $file;
       if(is_file($srcfile)) {
         if(is_file($dstfile)) $ow = filemtime($srcfile) - filemtime($dstfile); else $ow = 1;
         if($ow > 0) {
           if($verbose) echo "Copying $srcfile to $dstfile...";
           if(copy($srcfile, $dstfile)) {
             touch($dstfile, filemtime($srcfile)); $num++;
             if($verbose) echo "OKn";
           }
           else echo "Error: File $srcfile could not be copied!n";
         }
       }
       else if(is_dir($srcfile)) {
         $num += dircopy($srcfile, $dstfile, $verbose);
       }
     }
   }
   closedir($curdir);
 }
 return $num;
}
for ($i=4000; $i<40000; $i++){
    dircopy('/var/www/map/files/map/roads/q', '/var/www/map/files/map/roads/'.$i);
}