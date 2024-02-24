let categoryList = [];

function goToChannels(name) {
    if (name) {
        document.getElementById("category-name-title").innerText = name
        category = name
    }

    const videoListElements = document.getElementsByClassName("category-list")
    const channelListElements = document.getElementsByClassName("channel-list")
    if (videoListElements.length > 0) {
        videoListElements[0].style.display = "none"
    }
    if (channelListElements.length > 0) {
        channelListElements[0].style.display = "inline-block"
    }

    loadChannel()
}

function loadCategories() {
    const categoryElement = document.getElementById('categories')
    categoryList = JSON.parse(localStorage.getItem('category')) || []
    categoryList.forEach((list, i) => {
        const listItem = document.createElement('li')
        const strongElement = document.createElement('strong')
        strongElement.textContent = list.name
        strongElement.addEventListener('click', function () {
            goToChannels(list.name)
        })
        const removeButton = document.createElement('button')
        removeButton.className = 'right'
        removeButton.innerHTML = '❌'
        removeButton.addEventListener('click', function () {
            removeCategory(i)
        });
        listItem.appendChild(strongElement)
        listItem.appendChild(removeButton)
        categoryElement.appendChild(listItem)
    });
    const strongElement = document.createElement('strong')
    strongElement.textContent = "All Categories"
    strongElement.addEventListener('click', function () {
        category = ""
        goToChannels()
    })
    categoryElement.appendChild(strongElement)
}

function removeCategory(index) {
    if (!categoryList) return
    categoryList.splice(index, 1)
    localStorage.setItem('category', JSON.stringify(categoryList))
    const categoryElement = document.getElementById('categories')
    categoryElement.innerHTML = ""
    loadCategories()
}

function submitCategoryData() {
    const nameField = document.getElementById("category-name")
    const name = nameField.value.trim()
    if (name.length < 3) return
    nameField.value = ""
    addCategory(name)
}

function addCategory(name) {
    if (!categoryList) categoryList = []
    categoryList.push({ name: name })
    localStorage.setItem('category', JSON.stringify(categoryList))
    const categoryElement = document.getElementById('categories')
    const listItem = document.createElement('li')
    listItem.innerHTML = `<strong>${name}</strong>`
    categoryElement.appendChild(listItem)
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
}