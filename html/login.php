<?php
$servername = "localhost";
$username = "fred_5_10_24";
$password = "HdiS*@b82!13";
$dbname = "newdatabase";

$conn = new mysqli($servername, $username, $password, $dbname);

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
        // echo "Debug: Fetched user: " . print_r($user, true) . "<br>";
        // echo "Debug: Input password: " . $inputPassword . "<br>";
        // echo "Debug: Stored hash: " . $user['password'] . "<br>";
        if (password_verify($inputPassword, $user['password'])) {
            session_start();
            $_SESSION['username'] = $inputUsername;
            header("Location: members.html");
            exit();
        } else {
            echo "Incorrect login - Password mismatch";
        }
    } else {
        echo "Incorrect login - Username not found";
    }

    $stmt->close();
}

$conn->close();
?>

