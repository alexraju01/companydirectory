<?php
    include("config.php");
    header('Content-Type: application/json; charset=UTF-8');

    $conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

    if (mysqli_connect_errno()) {
        echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
        exit;
    }

    $updatedDepartmentName = $_POST['updatedDepartmentName'];
    $updatedDepartmentLocation = $_POST['updatedDepartmentLocation'];
    $departmentId = $_POST['departmentId'];

    $query = $conn->prepare('UPDATE department SET  name = ?, locationID = ? WHERE id = ?');
    $query->bind_param("sii", $updatedDepartmentName, $updatedDepartmentLocation, $departmentId);

    if ($query->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Record updated successfully']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to update record: ' . $conn->error]);
    }

    $query->close();
    $conn->close();
?>
