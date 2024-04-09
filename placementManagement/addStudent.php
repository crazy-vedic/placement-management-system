<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

$host = 'localhost';
$db = 'placement data';
$user = 'Placement Management';
$pass = 'pass';

$dsn = "mysql:host=$host;dbname=$db";
$opt = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];
$pdo = new PDO($dsn, $user, $pass, $opt);

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['id'], $data['name'], $data['year'], $data['cgpa'], $data['email'], $data['placement'])) {
    try {
        $sql = "INSERT INTO students (`Student ID`, Name, Year, CGPA, Email, `Placement ID`) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt= $pdo->prepare($sql);
        $stmt->execute([$data['id'], $data['name'], $data['year'], $data['cgpa'], $data['email'], $data['placement']]);
        echo json_encode(['status' => 'success']);
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'SQL error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Not all required fields are set.']);
}
?>