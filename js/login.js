window.handleCredentialResponse = (response) => {
    const responsePayload = decodeJwtResponse(response.credential);
    console.log('ID: ' + responsePayload.sub);
    console.log('Name: ' + responsePayload.name);
    console.log('Email: ' + responsePayload.email);

    // Redirect to home page after successful login
    window.location.href = 'http://localhost:3000/home.html';
}

function decodeJwtResponse(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

window.onload = function () {
    google.accounts.id.initialize({
        client_id: "1010913735687-pg48gd8ntca7l9uc6jvl8u3ndaqkd2pv.apps.googleusercontent.com",
        callback: handleCredentialResponse
    });
      
    google.accounts.id.renderButton(
        document.querySelector('.g_id_signin'),
        {
            theme: 'outline', 
            size: 'large',       
            shape: 'standard'       
        }
    );
    google.accounts.id.prompt();
}

