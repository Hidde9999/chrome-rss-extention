let videoListOpen = false
let channelList = []
let selChannel= {}
let category = ""
let bestYoutubeSite = ""
const corsSites = ["odysee.com", "youtube.com"]

function getRssFeeds(rssUrl, name, refresh) {
    if (videoListOpen){
        return
    }
    if (corsSites.some(site => rssUrl.includes(site))) {
        rssUrl = noCORSProxy(rssUrl);
    }
    document.getElementById("channel-name").innerText = name

    const videoListElements = document.getElementsByClassName("video-list")
    const channelListElements = document.getElementsByClassName("channel-list")
    if (videoListElements.length > 0) {
        videoListElements[0].style.display = "block"
    }
    if (channelListElements.length > 0) {
        channelListElements[0].style.display = "none"
    }
    hideFeedPopup()

    if (!refresh){
        videoList = []
    }

    if(localStorage.getItem(name) && !refresh){
        loadVideo(name)
    } else {
        getItems(rssUrl, name, refresh)
    }

}
function getRssFeedTitle(feedUrl) {
    if (corsSites.some(site => feedUrl.includes(site))) {
        feedUrl = noCORSProxy(feedUrl);
    }

    return fetch(feedUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch RSS feed. Status: ${response.status}`);
            }

            return response.text();
        })
        .then(xmlString => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString, 'application/xml');

            if (xmlDoc.documentElement === null) {
                throw new Error('Invalid XML structure.');
            }

            const titleElement = xmlDoc.querySelector('title');
            if (!titleElement) {
                throw new Error('No title found in the RSS feed.');
            }

            return titleElement.textContent;
        })
        .catch(error => {
            console.error('Error:', error.message);
            return null;
        });
}
function noCORSProxy(url){
    const proxyUrl = 'https://corsproxy.io/?'
    return proxyUrl + url
}
function bestYoutubeInstance(){
    fetch("https://api.invidious.io/instances.json?sort_by=type,health")
        .then(response => response.text())
        .then(jsonString => {
            jsonString = JSON.parse(jsonString)
            bestYoutubeSite = jsonString[0][0]
        })
        .catch(error => {
            console.error('Error fetching RSS feed:', error);
        });
}
function getItems(rssUrl, name, refresh){
    fetch(rssUrl)
        .then(response => response.text())
        .then(xmlString => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString, 'application/xml');

            const videosList = document.getElementById('videos');
            videosList.innerHTML= ""

            if (rssUrl.includes("yewtu.be") || rssUrl.includes("youtube.com")){
                const entries = xmlDoc.querySelectorAll('entry');
                entries.forEach((entry, i) => {
                    const title = entry.querySelector('title').textContent;
                    const linkElement = entry.querySelector('link[rel="alternate"]');
                    let link = linkElement ? linkElement.getAttribute('href') : entry.querySelector('link').textContent;
                    const published = entry.querySelector('published').textContent

                    saveVideo(title, link, published, name, refresh, i)
                });
            } else {
                const items = xmlDoc.querySelectorAll('item');
                items.forEach((item, i) => {
                    const title = item.querySelector('title').textContent;
                    const link = item.querySelector('link').textContent;
                    const pubDate = item.querySelector('pubDate').textContent;

                    saveVideo(title, link, pubDate, name, refresh, i)
                });

            }
            cookieSave(name)
        })
        .catch(error => {
            console.error('Error fetching RSS feed:', error);
        });
}
function loadChannels() {
    // Retrieve the JSON string from localStorage
    const retrievedJsonString = localStorage.getItem('channels');

    // Convert the JSON string back to an object
    channelList = JSON.parse(retrievedJsonString);

    loadChannel()
}
function loadChannel(){
    const channelElement = document.getElementById('channels');
    channelElement.innerHTML = ''
    // Check if channelList is not null or undefined
    if (channelList) {
        channelList.forEach((list, i) => {
            if (list.category.includes(category) || category == ""){
                const listItem = document.createElement('li');

                // Create the strong element for channel name
                const strongElement = document.createElement('strong');
                strongElement.textContent = list.name;
                strongElement.addEventListener('click', function() {
                    selChannel = channelList[i]
                    getRssFeeds(list.url, list.name, false);
                });

                // Create the button for removing the channel
                const removeButton = document.createElement('button');
                removeButton.textContent = 'Remove';
                removeButton.addEventListener('click', function() {
                    removeChannel(i);
                });

                // Append the elements to the list item
                listItem.appendChild(strongElement);
                listItem.appendChild(removeButton);

                // Append the list item to the channel element
                channelElement.appendChild(listItem);
            }
        });
    }
}
function addChannel(name, url, selcategory) {
    const channelElement = document.getElementById('channels');

    // Ensure channelList is not null
    if (channelList === null || channelList === undefined) {
        channelList = [];
    }

    channelList.push({
        name: name,
        url: url,
        category: selcategory
    });

    // Convert the object to a JSON string
    const jsonString = JSON.stringify(channelList);

    // Store the JSON string in localStorage
    localStorage.setItem('channels', jsonString);

    const listItem = document.createElement('li');
    listItem.innerHTML = `<strong onclick="getRssFeeds('${url}')">${name}</strong>`;
    channelElement.appendChild(listItem);
}
function removeChannel(index) {
    const channelElement = document.getElementById('channels');

    // Ensure channelList is not null
    if (channelList === null || channelList === undefined) {
        return;
    }

    // Remove the channel at the specified index
    channelList.splice(index, 1);

    // Convert the object to a JSON string
    const jsonString = JSON.stringify(channelList);

    // Store the updated JSON string in localStorage
    localStorage.setItem('channels', jsonString);

    // Clear the channel list on the UI
    channelElement.innerHTML = "";

    // Re-populate the channel list on the UI
    if (channelList) {
        channelList.forEach((list, i) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<strong onclick="getRssFeeds('${list.url}')">${list.name} <button onclick="removeChannel(${i})">Remove</button></strong>`;
            channelElement.appendChild(listItem);
        });
    }
}
function youtubeHandleToUrl(handle) {
// Making the API request
    fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet,id&q=${handle}&type=channel&key=AIzaSyBMH3Qszwmxjdha65PZTZhr7L2Oa0d937c`)
        .then(response => response.json())  // Parse the response as JSON
        .then(data => {
            // Accessing the first item in the 'items' array and extracting the channel ID
            const channelId = data.items[0].id.channelId;

            console.log(channelId);
            getTitle(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`)
        })
        .catch(error => console.error('Error:', error));
}
function submitChannelData() {
    const urlField = document.getElementById("channel-url");
    const handleField = document.getElementById("channel-handle");
    const url = urlField.value;

    if (handleField.value.length > 0){
        youtubeHandleToUrl(handleField.value)
    }
    if (urlField.value.length < 3) {
        return;
    }

    urlField.value = "";

    getTitle(url, urlField)

}
function getTitle(url, urlField){
    getRssFeedTitle(url)
        .then(title => {
            if (title !== null && title.length > 0) {
                addChannel(title, url, category);
                hideFeedPopup();
            } else {
                urlField.value = url;
                console.log('Failed to retrieve valid RSS feed title.');
            }
        })
}
function backToChannels(){
    videoListOpen = false
    const videoListElements = document.getElementsByClassName("video-list")
    const channelListElements = document.getElementsByClassName("channel-list")
    if (videoListElements.length > 0) {
        videoListElements[0].style.display = "none"
    }
    if (channelListElements.length > 0) {
        channelListElements[0].style.display = "block"
    }

    const videosList = document.getElementById('videos')
    videosList.innerHTML = ""
}
function showFeedPopup(){
    const channelListElements = document.getElementById("showFeedPopup")
    const addRSSScreen = document.getElementsByClassName("add-channel-screen")
    if (addRSSScreen.length > 0) {
        addRSSScreen[0].style.display = "block"
    }
    channelListElements.style.display = "none"
}
function hideFeedPopup(){
    const channelListElements = document.getElementById("showFeedPopup")
    const addRSSScreen = document.getElementsByClassName("add-channel-screen")
    if (addRSSScreen.length > 0) {
        addRSSScreen[0].style.display = "none"
    }
        channelListElements.style.display = "block"
}