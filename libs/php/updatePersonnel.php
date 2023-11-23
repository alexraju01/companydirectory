<?php
    include("config.php");
    header('Content-Type: application/json; charset=UTF-8');

    $conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

    if (mysqli_connect_errno()) {
        echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
        exit;
    }

    $updatedFirstName = $_POST['updatedFirstName']; 
    $updatedLastName = $_POST['updatedLastName'];
    $updatedJobTitle = $_POST['updatedJobTitle'];
    $updatedEmail = $_POST['updatedEmail'];
    $updatedDepartment = $_POST['updatedDepartment'];
    $personnelId = $_POST['personnelId'];

    $query = $conn->prepare('UPDATE personnel SET firstName = ?, lastName = ?, jobTitle = ?, email = ?, departmentID = ? WHERE id = ?');
    $query->bind_param("ssssii", $updatedFirstName, $updatedLastName, $updatedJobTitle, $updatedEmail,$updatedDepartment, $personnelId);

    if ($query->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Record updated successfully']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to update record: ' . $conn->error]);
    }

    $query->close();
    $conn->close();
?>
