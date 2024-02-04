let videoList = []

function saveVideo(title, link, date, name){
    videoList.push({
        title: title,
        link: link,
        date: date,
        isFavorite: false
    })

    const jsonString = JSON.stringify(videoList);
    localStorage.setItem(name, jsonString);
}

function loadVideo(name){
    const videosList = document.getElementById('videos');
    // Retrieve the JSON string from localStorage
    const retrievedJsonString = localStorage.getItem(name);

    // Convert the JSON string back to an object
    videoList = JSON.parse(retrievedJsonString);

    videoList.forEach(item => {
        otherVideo(videosList, item.title, item.link, item.date)
    })
}

function otherVideo(videosList, title, link, pubDate){
    // Create list item and append to the ordered list
    const listItem = document.createElement('li');
    listItem.innerHTML = `<strong><a href="${link}" target="_blank">${title}</a></strong> - (Published on ${pubDate})`;
    videosList.appendChild(listItem);
}