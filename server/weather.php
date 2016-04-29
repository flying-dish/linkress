<?php

foreach($_GET as $key => $val) { $$key = $val; }
foreach($_POST as $key => $val) { $$key = $val; }

$url = "https://[your token]@twcservice.mybluemix.net/api/weather/v2/observations/current?geocode=$lat,$lng&units=m&language=ja%27";
$content = json_decode(@file_get_contents($url));

// $ch = curl_init(); 
// curl_setopt_array($ch,
// 	array(
// 		CURLOPT_URL => $url,
// 		CURLOPT_SSL_VERIFYPEER =>false,
// 		CURLOPT_RETURNTRANSFER =>true,
// 	) 
// );

// curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);

// $content = curl_exec($ch);
// curl_close($ch);

header('Content-type: application/json');
header("Access-Control-Allow-Origin: *");
echo json_encode($content);

?>