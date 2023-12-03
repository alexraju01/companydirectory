<?php
    $executionStartTime = microtime(true);
    include("config.php");

    header('Content-Type: application/json; charset=UTF-8');

    $conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

    if ($conn->connect_error) {
        echo json_encode([
            'status' => ['code' => "300", 'name' => "failure", 'description' => "database unavailable"],
            'data' => []
        ]);
        exit;
    }

    $locationId = $_POST['locationId']; 

    // Fetch Location Name and Department Count
    $query = $conn->prepare('SELECT l.name AS locationName, COUNT(d.id) as departmentCount FROM location l LEFT JOIN department d ON l.id = d.locationID WHERE l.id = ? GROUP BY l.id');
    $query->bind_param("i", $locationId);
    $query->execute();
    $result = $query->get_result();

    if ($result->num_rows == 0) {
        echo json_encode(['status' => 'error', 'message' => 'Location not found.']);
    } else {
        $row = $result->fetch_assoc();
        echo json_encode([
            'status' => ['code' => "200", 'name' => "ok", 'description' => "query successful", 'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . " ms"],
            'data' => ['locationName' => $row['locationName'], 'departmentCount' => $row['departmentCount']]
        ]);
    }

    $query->close();
    $conn->close();
?>
