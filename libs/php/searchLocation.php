<?php
	$executionStartTime = microtime(true);
	include("config.php");
	header('Content-Type: application/json; charset=UTF-8');

    $conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

    // Use $_POST for production
    $name = $_POST['locationName'];
    $name = '%' . strtolower($name) . '%';

    $query = $conn->prepare('SELECT id, name FROM location WHERE LOWER(name) LIKE ?');
    $query->bind_param("s", $name);
    $query->execute();

    $result = $query->get_result();
    $data = $result->fetch_all(MYSQLI_ASSOC);

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = $data;

    mysqli_close($conn);
    echo json_encode($output); 
?>