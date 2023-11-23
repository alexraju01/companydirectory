<?php
	$executionStartTime = microtime(true);
	include("config.php");
	header('Content-Type: application/json; charset=UTF-8');

	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	if (mysqli_connect_errno()) {	

		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);
		echo json_encode($output);
		exit;
	}	

	$departmentId = $_POST['departmentId']; 

	// Check if any personnel are linked to this department table
	$query = $conn->prepare('SELECT COUNT(*) as cnt FROM personnel WHERE departmentID = ?');
	$query->bind_param("i", $departmentId);
	$query->execute();
	$result = $query->get_result();
	$row = $result->fetch_assoc();
	if ($row['cnt'] > 0) {
		echo json_encode(['status' => 'error', 'message' => 'Department is linked to one or more personnel and cannot be deleted.']);
		exit;
	}

	// If no personnel or locations are linked to the department, proceed with deletion
	$query = $conn->prepare('DELETE FROM department WHERE id = ?');
	$query->bind_param("i", $departmentId);
	$query->execute();

	// Check for successful deletion
	if ($query->affected_rows > 0) {
		echo json_encode(['status' => 'success', 'message' => 'Department deleted successfully.']);
		exit;
	} else {
		echo json_encode(['status' => 'error', 'message' => 'Failed to delete department.']);
	}

$conn->close();

	if (false === $query) {
		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);
		echo json_encode($output); 
		exit;
	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];
	
	mysqli_close($conn);
	echo json_encode($output); 
?>