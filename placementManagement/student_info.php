<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['reset'])) {
    unset($_SESSION['students']);
    
    header("Location: {$_SERVER['PHP_SELF']}");
    exit();
}

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['submit'])) {
    $studentName = $_POST['studentName'];
    $registrationNo = $_POST['registrationNo'];
    $_SESSION['students'][] = ['name' => $studentName, 'regNo' => $registrationNo];
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Student Info with Session</title>
</head>
<body>
    <form method="post">
        Student Name: <input type="text" name="studentName" required><br>
        Registration No: <input type="text" name="registrationNo" required><br>
        <input type="submit" name="submit" value="Submit">
        
        <button type="submit" name="reset">Reset All Data</button>
    </form>

    <h2>Submitted Students:</h2>
    <ul>
        <?php
        if (isset($_SESSION['students'])) {
            $displayedStudents = array_slice($_SESSION['students'], 0, 5);
            
            foreach ($displayedStudents as $student) {
                echo "<li>" . htmlspecialchars($student['name']) . " - " . htmlspecialchars($student['regNo']) . "</li>";
            }
        }
        ?>
    </ul>
</body>
</html>
