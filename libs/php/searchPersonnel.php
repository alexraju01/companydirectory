<?php
$executionStartTime = microtime(true);
include("config.php");
header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

$searchTerm = $_POST['searchTerm'];

// Prepare the wildcards for SQL LIKE statement
$searchTerm = '%' . strtolower($searchTerm) . '%';

$query = $conn->prepare('SELECT p.id, p.lastName, p.firstName, p.jobTitle, p.email, d.name as department, l.name as location FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) WHERE LOWER(p.lastName) LIKE ? OR LOWER(p.email) LIKE ?');
$query->bind_param("ss", $searchTerm, $searchTerm);
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
