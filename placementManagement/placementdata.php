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

// Get placement ID from the query string
$placementId = isset($_GET['id']) ? $_GET['id'] : die(json_encode(['error' => 'Placement ID not specified.']));

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "SELECT * FROM placements WHERE `Placement ID` = :placementId";
    
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':placementId', $placementId, PDO::PARAM_INT);
    $stmt->execute();
    
    $placementData = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if($placementData) {
        $data=array(
            'id' => $placementData['Placement ID'],
            'student_id' => $placementData['Student ID'],
            'company' => $placementData['Company'],
            'date' => $placementData['Date'],
            'details' => $placementData['Details']);
        echo json_encode($data);
    } else {
        echo json_encode(['error' => 'No placement found with the specified ID.']);
    }
    
} catch(PDOException $e) {
    die("ERROR: Could not connect. " . $e->getMessage());
}
?>
