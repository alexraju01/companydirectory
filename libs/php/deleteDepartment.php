<?php
	$executionStartTime = microtime(true);
	include("config.php");
	header('Content-Type: application/json; charset=UTF-8');

	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	if (mysqli_connect_errno()) {
		$output = [
			'status' => [
				'code' => "300",
				'name' => "failure",
				'description' => "database unavailable",
				'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . " ms"
			],
			'data' => []
		];
		echo json_encode($output);
		exit;
	}

	$departmentId = $_POST['departmentId'];

	$query = $conn->prepare('SELECT COUNT(id) as cnt FROM personnel WHERE departmentID = ?');
	$query->bind_param("i", $departmentId);
	$query->execute();

	$result = $query->get_result();
	$row = $result->fetch_assoc();

	if ($row['cnt'] > 0) {
		echo json_encode(['status' => 'error', 'message' => 'Department is linked to one or more personnel and cannot be deleted.']);
		$conn->close();
		exit;
	}

	$query = $conn->prepare('DELETE FROM department WHERE id = ?');
	$query->bind_param("i", $departmentId);
	$query->execute();

	if ($query->affected_rows > 0) {
		echo json_encode(['status' => 'success', 'message' => 'Department deleted successfully.']);
	} else {
		echo json_encode(['status' => 'error', 'message' => 'Failed to delete department.']);
	}

	$conn->close();
?>
