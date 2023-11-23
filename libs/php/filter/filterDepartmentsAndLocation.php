<?php
    include("../config.php");
    header('Content-Type: application/json; charset=UTF-8');

    $conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

    if (mysqli_connect_errno()) {
        echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
        exit;
    }

    // Retrieve the department and location from the POST request
    $department = isset($_POST['department']) ? $_POST['department'] : 'all';
    $location = isset($_POST['location']) ? $_POST['location'] : 'all';

    // Start with the base query
    $query = 'SELECT p.id, p.lastName, p.firstName, p.jobTitle, p.email, d.name as department, l.name as location 
              FROM personnel p 
              LEFT JOIN department d ON (d.id = p.departmentID) 
              LEFT JOIN location l ON (l.id = d.locationID)';

    // Initialize an array to hold the parameters for the SQL statement
    $params = [];
    $types = '';

    // Add conditions for department and location if necessary
    $conditions = [];
    if ($department !== 'all') {
        $conditions[] = 'd.id = ?';
        $params[] = $department;
        $types .= 's'; // assuming id is a string; if it's an integer, use 'i'
    }
    if ($location !== 'all') {
        $conditions[] = 'l.id = ?';
        $params[] = $location;
        $types .= 's'; // likewise, change to 'i' if location id is an integer
    }

    // If there are any conditions, append them to the query
    if (!empty($conditions)) {
        $query .= ' WHERE ' . implode(' AND ', $conditions);
    }

    // Finish the query with the order clause
    $query .= ' ORDER BY p.firstName, p.lastName, d.name, l.name';

    // Prepare the statement
    $stmt = $conn->prepare($query);

    // Bind the parameters to the prepared statement if needed
    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }

    // Execute the query
    if ($stmt->execute()) {
        $result = $stmt->get_result();
        $personnel = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode(['status' => 'success', 'data' => $personnel]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to fetch records: ' . $conn->error]);
    }

    // Close the statement and connection
    $stmt->close();
    $conn->close();
?>
