let videoList = []
let allVideosList = []
let tempVideoList = []
let favoriteList = []
let favoriteScreen = false

function saveVideo(title, link, date, channelName) {
    tempVideoList.push({
        title: title,
        channelName: channelName,
        link: link,
        date: date,
        isFavorite: false
    })
}

function saveVideoList(name, refresh, multiple) {
    if (refresh) {
        updateVideoList(name)
    } else if (!multiple) {
        videoList = tempVideoList.slice()
        cookieSave(name)
    }
}

function updateVideoList(name) {
    tempVideoList.sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
    tempVideoList.forEach((item) => {
        if (videoList.length > 0 && Date.parse(item.date) > Date.parse(videoList[0].date)) {
            videoList.push(item)
        }
    });
    cookieSave(name)
}

function cookieSave(name) {
    videoList.sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
    localStorage.setItem(name, JSON.stringify(videoList))
    tempVideoList = []
    loadVideo(name)
}

function loadVideo(name, multiple) {
    const videosList = document.getElementById('videos')
    videoList = JSON.parse(localStorage.getItem(name)) || []
    videoList.sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
    videoList.forEach((item, i) => {
        allVideosList.push(item)
        if (!multiple) {
            appendVideo(videosList, item, name, i)
        }
    })
    if (multiple) {
        videosList.innerHTML = ""
        allVideosList.sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
        allVideosList.forEach((item, i) => {
            appendVideo(videosList, item, name, i)
        })
    }
}

function loadVideoFromFavorite() {
    favoriteScreen = true
    const videosList = document.getElementById('videos')
    favoriteList = JSON.parse(localStorage.getItem("favorite")) || []
    favoriteList.sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
    favoriteList.forEach((item, i) => {
        allVideosList.push(item)
        appendVideo(videosList, item, null, i)
    })
}

function appendVideo(videosList, video, name, id) {
    hideLoader()
    const listItem = createVideoElement(video, name, id)
    videosList.appendChild(listItem)
}

function createVideoElement(video, name, id) {
    const listItem = document.createElement('li')
    const paragraphElement = document.createElement('p')
    if (!video){
        return listItem
    }
    if (video.link) {
        // If the 'link' property is present, use it
        video.link = video.link.replace("www.youtube.com", bestYoutubeSite)
    }
    paragraphElement.innerHTML = `<a href="${video.link}" target="_blank">${video.title}</a> - ${video.channelName} (Published on ${video.date})`
    listItem.appendChild(paragraphElement)
    const favoriteButton = document.createElement('button')
    favoriteButton.textContent = video.isFavorite ? 'Remove Favorite' : 'Add to Favorites'
    favoriteButton.addEventListener('click', function () {
        toggleFavorite(id, name)
    });
    listItem.appendChild(favoriteButton)
    return listItem
}

function toggleFavorite(id) {
    const channelName = allVideosList[id].channelName

    tempVideoList = JSON.parse(localStorage.getItem(channelName))
    allVideosList[id].isFavorite = !allVideosList[id].isFavorite
    tempVideoList[id].isFavorite = !tempVideoList[id].isFavorite
    if (allVideosList[id].isFavorite) {
        favoriteList.push(allVideosList[id])
    } else {
        const index = favoriteList.indexOf(allVideosList[id])
        if (index !== -1) {
            favoriteList.splice(index, 1)
            allVideosList.splice(index, 1)

            if (favoriteScreen){
                // Remove the corresponding listItem from the videosList
                const videosList = document.getElementById('videos')
                const listItemToRemove = videosList.children[id]
                if (listItemToRemove) {
                    videosList.removeChild(listItemToRemove)
                }
            }
        }
    }
    localStorage.setItem("favorite", JSON.stringify(favoriteList))
    localStorage.setItem(channelName, JSON.stringify(tempVideoList))
    if (!favoriteScreen){
        loadVideoById(id, channelName)
    }
    tempVideoList = []
}

function loadVideoById(id, name) {
    const videosList = document.getElementById('videos')
    const itemToReplace = videosList.children[id]
    if (itemToReplace) {
        videosList.replaceChild(createVideoElement(allVideosList[id], name, id), itemToReplace)
    }
}

function loadFavorites() {
    // Retrieve the JSON string from localStorage
    const retrievedJsonString = localStorage.getItem('favorite')

    // Convert the JSON string back to an object
    favoriteList = JSON.parse(retrievedJsonString)
}