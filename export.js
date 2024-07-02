//hoi
function exportChannels() {

    const exportData = {
        channelList: channelList,
        categoryList: categoryList
    }

    const jsonData = JSON.stringify(exportData, null, 2)

    // Create a Blob containing the JSON data
    const blob = new Blob([jsonData], { type: 'application/json' })

    // Create a temporary anchor element
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'rss-settings.json'

    // Append the anchor to the body and trigger a click event to start the download
    document.body.appendChild(a)
    a.click()

    // Remove the anchor from the DOM
    document.body.removeChild(a)
}

function importChannels() {
    const input = document.createElement('input')
    input.type = 'file'

    // Listen for the change event on the file input
    input.addEventListener('change', function (event) {
        const file = event.target.files[0]

        if (file) {
            const reader = new FileReader()

            reader.onload = function (e) {
                try {
                    const parsedData = JSON.parse(e.target.result)

                    if (parsedData.channelList) {
                        channelList = parsedData.channelList
                        localStorage.setItem('channels', JSON.stringify(parsedData.channelList))
                        // Update the channel list on the UI or perform other actions as needed
                        // console.log('Imported channelList:', channelList)
                    }

                    if (parsedData.categoryList) {
                        categoryList = parsedData.categoryList
                        localStorage.setItem('category', JSON.stringify(parsedData.categoryList))
                        // Update the channel list on the UI or perform other actions as needed
                        // console.log('Imported channelList:', categoryList)
                    }

                    // console.log('Import successful');
                    window.location.reload();
                } catch (error) {
                    console.error('Error importing data:', error)
                }
            };

            // Read the file as text
            reader.readAsText(file)
        }
    });

    // Trigger a click event to open the file dialog
    input.click()
}
