<?php
    $lat = $_GET['lat'];
    if( $lat == '' ){
        $lat = 34.994829;
    }
    $lon = $_GET['lon'];
    if( $lon == '' ){
        $lon = 135.785046;
    }
    $distance = $_GET['distance'];
    if( $distance == ''){
        $distance = 1000000;
    }
    $limit = $_GET['limit'];
    if ( $limit == '' ){
        $limit = 10;
    }
    $con = pg_connect("connect");
    if (!$con) {
        die('接続失敗です。'.pg_last_error());
    }
    $res = pg_query('SELECT id, name, detail, ST_AsText(location) as loc, hp, max_hp, energy, def_sunny, def_cloud, def_rain, owner_user_id, color, portal_value, portal_kind FROM portals where ST_DWithin(location, ST_GeographyFromText(\'SRID=4326;POINT('.strval($lon).' '.strval($lat).')\'), '.strval($distance).') ORDER BY ST_Distance(location, ST_GeographyFromText(\'SRID=4326;POINT('.strval($lon).' '.strval($lat).')\') ) limit '.strval($limit));
    if (!$res) {
        die('クエリーが失敗しました。'.pg_last_error());
    }

    $json = array();
    for ($i = 0 ; $i < pg_num_rows($res) ; $i++){
        $portal = array();
        $rows = pg_fetch_array($res, NULL, PGSQL_ASSOC);
        $portal['id'] = $rows['id'];
        $portal['name'] = $rows['name'];
        $portal['detail'] = $rows['detail'];
        $tmp = explode(' ', substr($rows['loc'], 6, strlen($rows['loc'])-7));
        $portal['lon'] = $tmp[0];
        $portal['lat'] = $tmp[1];
        $portal['hp'] = $rows['hp'];
        $portal['max_hp'] = $rows['max_hp'];
        $portal['energy'] = $rows['energy'];
        $portal['def_sunny'] = $rows['def_sunny'];
        $portal['def_cloud'] = $rows['def_cloud'];
        $portal['def_rain'] = $rows['def_rain'];
        $portal['owner_user_id'] = $rows['owner_user_id'];
        $portal['color'] = $rows['color'];
        $portal['portal_value'] = $rows['portal_value'];
        $portal['portal_kind'] = $rows['portal_kind'];
        array_push( $json, $portal );
    }
    header('Content-Type: application/json');
    print( json_encode($json) );
    
    pg_close($con);
    exit();
?>