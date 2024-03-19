export const pending = (baseUrl, endpoint, threadKey, onCompletion) => {
    const interval = setInterval(() => {
        fetch(`${baseUrl}${endpoint}/${threadKey}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log("pending...");
                if (data.status === "completed") {
                    console.log('Completed');
                    onCompletion(data);
                    clearInterval(interval);
                } else if (data.status === "error") {
                    // Gestion des erreurs si nécessaire
                    console.error('There was an error processing your request:', data.message);
                    clearInterval(interval);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                clearInterval(interval);
            });
    }, 1000); // Fréquence d'actualisation, ajustez selon les besoins
}