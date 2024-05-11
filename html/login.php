<?php
$servername = "localhost"; // or your server name
$username = "fred_5_10_24";
$password = "HdiS*@b82!13";
$dbname = "newdatabase";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $inputUsername = $_POST['username'];
    $inputPassword = $_POST['password'];

    $sql = "SELECT * FROM users WHERE username = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $inputUsername);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        if (password_verify($inputPassword, $user['password'])) {
            // Start a new session and store user info
            session_start();
            $_SESSION['username'] = $inputUsername;
            header("Location: members.html");
            exit();
        } else {
            echo "Incorrect login";
        }
    } else {
        echo "Incorrect login";
    }

    $stmt->close();
}

$conn->close();
?>
