<?php
require 'vendor/autoload.php';
use Mailgun\Mailgun;

// Function to load the API key from a file
function getApiKey($filePath) {
    if (!file_exists($filePath)) {
        die("Error: API key file not found.");
    }
    return trim(file_get_contents($filePath));
}

// Path to the file containing the API key
$apiKeyFilePath = '../../mail-api.txt';

// Load the API key from the file
$apiKey = getApiKey($apiKeyFilePath);
$domain = "sandbox9cbb0eb1fb1d41b183f40f56b53724a0.mailgun.org";

// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $fullName = $_POST['fullname'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $lessonType = implode(", ", $_POST['lesson_type']); // Convert array to comma-separated string

    // Create a new Mailgun instance
    $mgClient = Mailgun::create($apiKey);

    // Prepare the email data
    $emailData = [
        'from'    => 'Hurley Piano <postmaster@sandbox9cbb0eb1fb1d41b183f40f56b53724a0.mailgun.org>',
        'to'      => $email,
        'subject' => 'Your Music Lesson Inquiry',
        'text'    => "Dear $fullName,\n\nThank you for your interest in our $lessonType lessons. We will contact you soon.\n\nBest regards,\nHurley Piano",
        'attachment' => [
            ['filePath' => '/path/to/your/pdf/file.pdf', 'filename' => 'YourLessonInfo.pdf']
        ]
    ];

    // Send the email
    try {
        $mgClient->messages()->send($domain, $emailData);
        echo "Email sent successfully.";
    } catch (Exception $e) {
        echo "Error sending email: " . $e->getMessage();
    }
} else {
    echo "Invalid request method.";
}
?>
