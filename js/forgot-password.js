document.addEventListener('DOMContentLoaded', function() {
    const forgotPasswordForm = document.getElementById('forgot-password-form');

    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const email = document.getElementById('email_ip').value;

            try {
                const response = await fetch('http://localhost:3005/forgot-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }),
                });

                if (!response.ok) {
                    // Log the response status and text
                    const errorText = await response.text();
                    console.error('Response status:', response.status);
                    console.error('Response text:', errorText);
                    throw new Error('Network response was not ok: ' + errorText);
                }

                const data = await response.text();
                alert(data);
            } catch (error) {
                console.error('There was a problem with your fetch operation:', error);
                alert('Error: ' + error.message);
            }
        });
    } else {
        console.error('Element with ID "forgot-password-form" not found in the DOM.');
    }
});
