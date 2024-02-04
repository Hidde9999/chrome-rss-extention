function exportChannels() {
    const jsonData = JSON.stringify(channelList, null, 2);

    // Create a Blob containing the JSON data
    const blob = new Blob([jsonData], { type: 'application/json' });

    // Create a temporary anchor element
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'channelList.json';

    // Append the anchor to the body and trigger a click event to start the download
    document.body.appendChild(a);
    a.click();

    // Remove the anchor from the DOM
    document.body.removeChild(a);
}

function importChannels() {
    const input = document.createElement('input');
    input.type = 'file';

    // Listen for the change event on the file input
    input.addEventListener('change', function (event) {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {
                try {
                    const importedChannels = JSON.parse(e.target.result);

                    // Check if the imported data is an array
                    if (Array.isArray(importedChannels)) {
                        // Clear existing channels and add the imported ones
                        channelList = [];
                        importedChannels.forEach(channel => {
                            addChannel(channel.name, channel.url, channel.category);
                        });

                        // Refresh the UI with the updated channel list
                        loadChannels();

                        alert('Channels imported successfully!');
                    } else {
                        alert('Invalid format. Please select a valid JSON file.');
                    }
                } catch (error) {
                    alert('Error parsing JSON. Please select a valid JSON file.');
                    console.error('Error parsing JSON:', error);
                }
            };

            // Read the file as text
            reader.readAsText(file);
        }
    });

    // Trigger a click event to open the file dialog
    input.click();
}