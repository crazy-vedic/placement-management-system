<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
// Database connection parameters
$host = 'localhost';
$dbname = 'placement data';
$username = 'Placement Management';
$password = 'pass';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    
    // Setting the PDO error mode to exception
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "SELECT students.*, GROUP_CONCAT(skills.Skills SEPARATOR ', ') AS Skills
            FROM students
            LEFT JOIN skills ON students.`Student ID` = skills.`Student ID`
            GROUP BY students.`Student ID`
			ORDER BY students.`Student ID`";

	$stmt = $pdo->query($sql);

	$students = $stmt->fetchAll(PDO::FETCH_ASSOC);

	// Create a new array with the desired keys
	$studentsList = array();
	foreach ($students as $student) {
		$studentsList[] = array(
			'id' => $student['Student ID'],
			'name' => $student['Name'],
			'year' => $student['Year'],
			'cgpa' => $student['CGPA'],
			'skills' => $student['Skills'],
			'email' => $student['Email'],
			'placement' => $student['Placement ID']
		);
	}

	echo json_encode($studentsList);
    
} catch(PDOException $e) {
    die("ERROR: Could not connect. " . $e->getMessage());
}
?>
