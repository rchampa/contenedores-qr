<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
require __DIR__ .'/vendor/autoload.php';
Dotenv::load(__DIR__);

$sendgrid_username = $_ENV['SENDGRID_USERNAME'];
$sendgrid_password = $_ENV['SENDGRID_PASSWORD'];
$to                = $_ENV['TO'];

$id = $_POST["id"];
$from = $_POST["from"];
$to = $_POST["to"];
$subject = "Incidencia del contenedor ".$id;
$description = $_POST["description"];
$latitude = $_POST["latitude"];
$longitude = $_POST["longitude"];

$sendgrid = new SendGrid($sendgrid_username, $sendgrid_password, array("turn_off_ssl_verification" => true));
$email    = new SendGrid\Email();
$email->addTo($to)->
       setFrom($from)->
       setSubject($subject)->
       //setText("Container ID: ".$id." Description: ".$description)->
       setHtml(
       	"Container ID: ".$id."<br>".
       	"Description: ".$description."<br>".
       	"Latitude: ".$latitude."<br>".
       	"Longitude: ".$longitude."<br>")->
       addHeader('X-Sent-Using', 'SendGrid-API')->
       addHeader('X-Transport', 'web')->
       addAttachment($_FILES['attached_image']['tmp_name'], $_FILES['attached_image']['name']);

$response = $sendgrid->send($email);
if(isset($response) && $response->message==="success"){
	//echo "Your email was sent.";
       $send_to_client['msg'] = "success";
       echo json_encode($send_to_client);
}
else{
	$send_to_client['msg'] = "error";
       echo json_encode($send_to_client);
}
//var_dump($response);

?>

