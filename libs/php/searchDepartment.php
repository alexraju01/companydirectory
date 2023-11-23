<?php

	$executionStartTime = microtime(true);
	include("config.php");
	header('Content-Type: application/json; charset=UTF-8');

    $conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

    // Use $_POST for production
    $name = $_POST['departmentName'];
    $name = '%' . strtolower($name) . '%';

    $query = $conn->prepare('SELECT d.id, d.name, l.name as location FROM department d LEFT JOIN location l on (l.id = d.locationID) WHERE LOWER(d.name) LIKE ?');
    $query->bind_param("s", $name);
    $query->execute();

    if (false === $query) {
        $output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);
		echo json_encode($output); 
		exit;
    }

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