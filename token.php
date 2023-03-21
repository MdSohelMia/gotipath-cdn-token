<?php

// $secret = '8zh3dphh465hqsevo0rsgj7i6nkbxujo';
$secret = 'a1ekujgxrjpx2nzk7yj2g8bc1ugohlypq2woigdeiaogaecl1eaysbw49chto5cj';
$path = '/aeade654-3332-41e4-9ffa-e549484f888f/playlist.m3u8';
$expires = time() + 10000;

$link = "$expires$path $secret";

$md5 = md5($link, true);



$md5 = base64_encode($md5);

$md5 = strtr($md5, '+/', '-_');


$md5 = str_replace('=', '', $md5);

var_dump($md5);
$url = "http://videocdn.sohel.pro{$path}?md5={$md5}&expires={$expires}";
echo $url;
echo "\n";
