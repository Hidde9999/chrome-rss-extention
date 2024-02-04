let categoryList = []

function goToChannels(name) {
    category = ""
    if (name){
        document.getElementById("category-name-title").innerText = name
        category = name
    }

    const videoListElements = document.getElementsByClassName("category-list")
    const channelListElements = document.getElementsByClassName("channel-list")
    if (videoListElements.length > 0) {
        videoListElements[0].style.display = "none"
    }
    if (channelListElements.length > 0) {
        channelListElements[0].style.display = "block"
    }

    loadChannel()
}

function loadCategories() {
    const categoryElement = document.getElementById('categories');

    // Retrieve the JSON string from localStorage
    const retrievedJsonString = localStorage.getItem('category');

    // Convert the JSON string back to an object
    categoryList = JSON.parse(retrievedJsonString);

    // Check if categoryList is not null or undefined
    if (categoryList) {
        categoryList.forEach((list, i) => {
            const listItem = document.createElement('li');

            // Create the strong element for channel name
            const strongElement = document.createElement('strong');
            strongElement.textContent = list.name;
            strongElement.addEventListener('click', function() {
                goToChannels(list.name)
            });

            // Create the button for removing the channel
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.addEventListener('click', function() {
                removeCategory(i);
            });

            // Append the elements to the list item
            listItem.appendChild(strongElement);
            listItem.appendChild(removeButton);

            // Append the list item to the channel element
            categoryElement.appendChild(listItem);
        });
        const strongElement = document.createElement('strong');
        strongElement.textContent = "All Categories";
        strongElement.addEventListener('click', function() {
            goToChannels()
        });
        categoryElement.appendChild(strongElement)
    }
}

function removeCategory(index) {
    const categoryElement = document.getElementById('categories');

    // Ensure categoryList is not null
    if (categoryList === null || categoryList === undefined) {
        return;
    }

    // Remove the channel at the specified index
    categoryList.splice(index, 1);

    // Convert the object to a JSON string
    const jsonString = JSON.stringify(categoryList);

    // Store the updated JSON string in localStorage
    localStorage.setItem('category', jsonString);

    // Clear the channel list on the UI
    categoryElement.innerHTML = "";

    // Re-populate the channel list on the UI
    if (categoryList) {
        categoryList.forEach((list, i) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<strong onclick="getRssFeeds('${list.url}')">${list.name} <button onclick="removeChannel(${i})">Remove</button></strong>`;
            categoryElement.appendChild(listItem);
        });
    }
}

function showCategoryPopup(){
    const channelListElements = document.getElementById("showCategoryPopup")
    const addRSSScreen = document.getElementsByClassName("add-category-screen")
    if (addRSSScreen.length > 0) {
        addRSSScreen[0].style.display = "block"
    }
    channelListElements.style.display = "none"
}
function hideFeedPopup(){
    const categoryListElements = document.getElementById("showCategoryPopup")
    const addRSSScreen = document.getElementsByClassName("add-category-screen")
    if (addRSSScreen.length > 0) {
        addRSSScreen[0].style.display = "none"
    }
    categoryListElements.style.display = "block"
}

function submitCategoryData() {
    const nameField = document.getElementById("category-name");
    if (nameField.value.length < 3) {
        return;
    }

    const name = nameField.value;
    nameField.value = "";

    addCategory(name);
}

function addCategory(name) {
    const categoryElement = document.getElementById('categories');

    // Ensure categoryList is not null
    if (categoryList === null || categoryList === undefined) {
        categoryList = [];
    }

    categoryList.push({
        name: name
    });

    // Convert the object to a JSON string
    const jsonString = JSON.stringify(categoryList);

    // Store the JSON string in localStorage
    localStorage.setItem('category', jsonString);

    const listItem = document.createElement('li');
    listItem.innerHTML = `<strong>${name}</strong>`;
    categoryElement.appendChild(listItem);
}

function backToCategories() {
    const videoListElements = document.getElementsByClassName("channel-list")
    const channelListElements = document.getElementsByClassName("category-list")
    if (videoListElements.length > 0) {
        videoListElements[0].style.display = "none"
    }
    if (channelListElements.length > 0) {
        channelListElements[0].style.display = "block"
    }

    const videosList = document.getElementById('videos')
    videosList.innerHTML = ""
}

window.onload = function () {
    // Your code here, it will run when the entire page is loaded
    // Inside your loadChannels function or script file
    document.getElementById('submitCategoryData').addEventListener('click', function() {
        submitCategoryData()
    })
    document.getElementById('showCategoryPopup').addEventListener('click', function() {
        showCategoryPopup()
    })

    document.getElementById('showFeedPopup').addEventListener('click', function() {
        showFeedPopup()
    })
    document.getElementById('submitChannelData').addEventListener('click', function() {
        submitChannelData()
    })
    document.getElementById('backToChannels').addEventListener('click', function() {
        backToChannels()
    })
    document.getElementById('backToCategories').addEventListener('click', function() {
        backToCategories()
    })
    document.getElementById('exportChannelsBtn').addEventListener('click', function() {
        exportChannels()
    })
    document.getElementById('importChannelsBtn').addEventListener('click', function() {
        importChannels()
    })
    document.getElementById('refresh').addEventListener('click', function() {
        getRssFeeds(selChannel.url, selChannel.name, true)
    })
    
    loadCategories()
    loadChannels()
};