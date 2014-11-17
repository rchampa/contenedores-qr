<?php

/*$content_type_args = explode(';', $_SERVER['CONTENT_TYPE']); //parse content_type string
if ($content_type_args[0] == 'application/json')
  $_POST = json_decode(file_get_contents('php://input'),true);

*/
$id= $_POST['id'];

$send_to_client['id'] = $id;
$send_to_client['msg'] = 'cool baby';

$fileInfo = pathinfo($_FILES['filedata']['name']);
$ruta_actual = str_replace("\\","/",getcwd());
$nueva_ruta = $ruta_actual."/imagensubida.".$fileInfo['extension'];
copy($_FILES['filedata']['tmp_name'], $nueva_ruta);

echo json_encode($send_to_client);

?>