<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

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

$json = file_get_contents('php://input');
$data = json_decode($json);

$studentId = $data->studentId;
$skill = $data->skill;

$sql = "INSERT INTO skills (`Student ID`, Skills) VALUES (:studentId, :skill)";
$stmt = $pdo->prepare($sql);
$stmt->execute(['studentId' => $studentId, 'skill' => $skill]);

if ($stmt->rowCount()) {
    http_response_code(200);
    echo json_encode(['message' => 'Skill added successfully']);
} else {
    http_response_code(400);
    echo json_encode(['message' => 'Failed to add skill']);
}
?>