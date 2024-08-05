self.addEventListener('push', function(event) {
    const data = event.data.json();
    console.log('Push received:', data);

    const options = {
        body: data.body,
        icon: '/icon.png' // Add an icon for the notification if you have one
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});