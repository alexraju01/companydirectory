<?php
    $executionStartTime = microtime(true);
    include("config.php");

    header('Content-Type: application/json; charset=UTF-8');

    $conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

    $departmentId = $_POST['departmentId'];

    // Query to get department name and personnel count
    $query = $conn->prepare('SELECT d.name AS departmentName, COUNT(p.id) as personnelCount FROM department d LEFT JOIN personnel p ON (p.departmentID = d.id) WHERE d.id = ?');
    $query->bind_param("i", $departmentId);
    $query->execute();
    $result = $query->get_result();
    $row = $result->fetch_assoc();

    if ($row) {
        $departmentName = $row['departmentName'];
        $personnelCount = $row['personnelCount'];
        echo json_encode(['status' => 'success', 'data' => ['departmentName' => $departmentName, 'personnelCount' => $personnelCount]]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No such department found.']);
    }

    $conn->close();
?>
