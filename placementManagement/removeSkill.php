<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Database configuration
$host = 'localhost';
$dbname = 'placement data';
$username = 'Placement Management';
$password = 'pass';

// Establish connection to the database
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    // Set the PDO error mode to exception
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("ERROR: Could not connect. " . $e->getMessage());
}

// Get the JSON POST body
$json = file_get_contents('php://input');
$data = json_decode($json);

// Extract the data
$studentId = $data->studentId;
$skill = $data->skill;

// Prepare SQL statement to remove skill
$sql = "DELETE FROM skills WHERE `Student ID` = :studentId AND Skills = :skill";

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['studentId' => $studentId, 'skill' => $skill]);

    if ($stmt->rowCount()) {
        http_response_code(200);
        echo json_encode(['message' => 'Skill removed successfully']);
    }
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Database error: ' . $e->getMessage()]);
}