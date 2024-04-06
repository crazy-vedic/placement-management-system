<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Adjust this as per your CORS policy
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Database configuration
$host = 'localhost';
$dbname = 'placement data'; // Make sure the database name is correct. Spaces in names are unusual and might cause issues.
$username = 'Placement Management'; // Username usually doesn't contain spaces. Double-check this.
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
$id = $data->id;
$name = $data->name;
$year = $data->year;
$cgpa = $data->cgpa;
$email = $data->email;
$placement = $data->placement;

// Prepare SQL statement to update student
$sql = "UPDATE students SET `Name` = :name, `Year` = :year, `CGPA` = :cgpa, `Email` = :email, `Placement ID` = :placement WHERE `Student ID` = :id";

try {
    $stmt = $pdo->prepare($sql);
    
    // Bind parameters
    $stmt->bindParam(':id', $id, PDO::PARAM_INT); // Make sure the placeholder names match those in the SQL statement
    $stmt->bindParam(':name', $name, PDO::PARAM_STR);
    $stmt->bindParam(':year', $year, PDO::PARAM_INT);
    $stmt->bindParam(':cgpa', $cgpa); // Assuming CGPA is a float, PDO will manage it correctly
    $stmt->bindParam(':email', $email, PDO::PARAM_STR);
    $stmt->bindParam(':placement', $placement, PDO::PARAM_INT);
    
    // Execute the prepared statement
    $stmt->execute();

    $rowCount = $stmt->rowCount();
    echo json_encode(['message' => "Student updated successfully. Rows affected: $rowCount"]);
} catch(PDOException $e) {
    // Handle SQL execution error
    http_response_code(500); // Internal Server Error
    echo json_encode(['message' => "Error updating record: " . $e->getMessage()]);
}
