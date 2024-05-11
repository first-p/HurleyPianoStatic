<?php
require 'vendor/autoload.php';
use Mailgun\Mailgun;

// Mailgun configuration
$apiKey = '3e25649fe9d5e79623b5ec87a665e4bd-ed54d65c-4792bd82';
$domain = "sandbox9cbb0eb1fb1d41b183f40f56b53724a0.mailgun.org";

// Create the Mailgun client
$mgClient = Mailgun::create($apiKey);

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $fullName = $_POST['fullname'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $lessonTypes = isset($_POST['lesson_type']) ? implode(', ', $_POST['lesson_type']) : 'None';

    // Define the PDF file path
    $pdfFilePath = 'path/to/your/file.pdf';

    // Prepare email data
    $emailData = [
        'from'    => 'Mailgun Sandbox <postmaster@sandbox9cbb0eb1fb1d41b183f40f56b53724a0.mailgun.org>',
        'to'      => $email,
        'subject' => 'Your Inquiry at Hurley Piano',
        'text'    => "Hello $fullName,\n\nThank you for your inquiry. We have attached a PDF with more information about our lessons.\n\nBest regards,\nHurley Piano"
    ];

    // Send email with attachment
    $result = $mgClient->messages()->send($domain, $emailData, [
        'attachment' => [
            ['filePath' => $pdfFilePath, 'filename' => './freebook.pdf', 'freebook.pdf']
        ]
    ]);

    if ($result) {
        echo "Email sent successfully.";
    } else {
        echo "Failed to send email.";
    }
}
?>

