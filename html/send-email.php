<?php
// Display errors for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require '../vendor/autoload.php'; // Adjusted path
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
$domain = "sandboxdc65104b6da0468db96e2741f4c0ebf7.mailgun.org";

// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Debug statement to indicate form submission
    echo "Form submitted.<br>";

    $fullName = $_POST['fullname'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $lessonType = implode(", ", $_POST['lesson_type']); // Convert array to comma-separated string

    // Debug statements to check form data
    echo "Full Name: $fullName<br>";
    echo "Email: $email<br>";
    echo "Phone: $phone<br>";
    echo "Lesson Type: $lessonType<br>";

    // Create a new Mailgun instance
    $mgClient = Mailgun::create($apiKey);

    // Debug statement to indicate Mailgun instance creation
    echo "Mailgun instance created.<br>";

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

    // Debug statement to check email data
    echo "Email data prepared:<br>";
    print_r($emailData);
    echo "<br>";

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
