const form = document.getElementById('nameForm');
const responseSection = document.getElementById('responseMessage');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const prenom = formData.get('name');

    try {
        const response = await fetch('http://hiintz.freeboxos.fr:50000/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prenom }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Check the content type to determine how to parse the response
        const contentType = response.headers.get('content-type');
        let message;

        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            message = data.message || JSON.stringify(data);
        } else {
            // Handle as plain text
            message = await response.text();
        }

        displayResponse(message);
    } catch (error) {
        displayResponse('Error: ' + error.message);
    }
});

function displayResponse(message) {
    responseSection.innerText = message;
}