window.onload = function () {
    // Your code here, it will run when the entire page is loaded
    // Inside your loadChannels function or script file
    document.getElementById('submitCategoryData').addEventListener('click', function() {
        submitCategoryData()
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
    document.getElementById('favoritesBtn').addEventListener('click', function() {
        goToFavorites()
    })
    document.getElementById('refresh').addEventListener('click', function() {
        getRssFeeds(selChannel.url, selChannel.name, true)
    })

    loadCategories()
    loadChannels()
    loadFavorites()
    bestYoutubeInstance()
}

// JavaScript function to show the loading spinner
function showLoader() {
    document.querySelector('.loader').style.display = 'block'
}

// JavaScript function to hide the loading spinner
function hideLoader() {
    document.querySelector('.loader').style.display = 'none'
}