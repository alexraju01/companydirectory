<?php
    $executionStartTime = microtime(true);
    include("config.php");

    header('Content-Type: application/json; charset=UTF-8');

    $conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

    if (mysqli_connect_errno()) {
        echo json_encode([
            'status' => [
                'code' => "300",
                'name' => "failure",
                'description' => "database unavailable",
                'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . " ms"
            ],
            'data' => []
        ]);
        mysqli_close($conn);
        exit;
    }	

    $locationId = $_POST['locationId']; 

    // Check departments
    $query = $conn->prepare('SELECT COUNT(id) as cnt FROM department WHERE locationID = ?');
    if (false === $query) {
        echo json_encode(['status' => 'error', 'message' => 'Failed to prepare department query.']);
        mysqli_close($conn);
        exit;
    }

    $query->bind_param("i", $locationId);
    $query->execute();
    $result = $query->get_result();
    $row = $result->fetch_assoc();
    if ($row['cnt'] > 0) {
        echo json_encode(['status' => 'error', 'message' => 'Location is linked to one or more departments.']);
        mysqli_close($conn);
        exit;
    }

    // Check personnel
    $query = $conn->prepare('SELECT COUNT(p.id) as cnt FROM personnel p JOIN department d ON p.departmentID = d.id WHERE d.locationID = ?');
    if (false === $query) {
        echo json_encode(['status' => 'error', 'message' => 'Failed to prepare personnel query.']);
        mysqli_close($conn);
        exit;
    }

    $query->bind_param("i", $locationId);
    $query->execute();
    $result = $query->get_result();
    $row = $result->fetch_assoc();
    if ($row['cnt'] > 0) {
        echo json_encode(['status' => 'error', 'message' => 'Location is linked to one or more personnel records.']);
        mysqli_close($conn);
        exit;
    }

    // If we've reached this point, it is safe to delete
    $query = $conn->prepare('DELETE FROM location WHERE id = ?');
    if (false === $query) {
        echo json_encode(['status' => 'error', 'message' => 'Failed to prepare delete query.']);
        mysqli_close($conn);
        exit;
    }

    $query->bind_param("i", $locationId);
    $query->execute();

    // Check for successful deletion
    if ($query->affected_rows > 0) {
        echo json_encode(['status' => 'success', 'message' => 'Location deleted successfully.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to delete location.']);
    }

    mysqli_close($conn);
?>
