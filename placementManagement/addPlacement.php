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

if (isset($data['Placement ID'], $data['Student ID'], $data['Company'], $data['Date'], $data['Details'])) {
    try {
        $sql = "INSERT INTO placements (`Placement ID`, `Student ID`, Company, Date, Details) VALUES (?, ?, ?, ?, ?)";
        $stmt= $pdo->prepare($sql);
        $stmt->execute([$data['Placement ID'], $data['Student ID'], $data['Company'], $data['Date'], $data['Details']]);
        echo json_encode(['status' => 'success']);
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'SQL error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Not all required fields are set.']);
}
?>