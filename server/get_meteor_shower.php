<?php

foreach($_GET as $key => $val) { $$key = $val; }
foreach($_POST as $key => $val) { $$key = $val; }

$con = pg_connect("connect");

if (!$con) {
    die('接続失敗です。'.pg_last_error());
}

$res = pg_query("
    SELECT * FROM meteor_shower 
    where start_date <= '$date' and '$date' <= end_date
    order by start_date limit 20
");

if (!$res) {
    die('クエリーが失敗しました。'.pg_last_error());
}

$rtn = array();
if ($res) {
    $user = array();
    $rows = pg_fetch_array($res, NULL, PGSQL_ASSOC);
    $rtn[] = $rows;
}
pg_close($con);

header('Content-type: application/json');
header("Access-Control-Allow-Origin: *");
echo json_encode($rtn);

?>