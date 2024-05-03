document.addEventListener('DOMContentLoaded', function() {
    // Set default values on page load
    const categorySelector = document.getElementById('category-selector');
    const videoSelector = document.getElementById('video-selector');

    // Set default category and video
    categorySelector.value = 'children';  // Assuming 'children' is the value attribute for the Children option
    videoSelector.value = 'video1';       // Assuming 'video1' is the value attribute for the Video 1 option

    // Manually trigger change events to load the default video
    updateVideoPlayer();
    changeVideo();
});

// Function to handle changes in category selection
function updateVideoPlayer() {
    const videoSource = document.getElementById('video-source');
    const videoPlayer = document.getElementById('video-player');
    const videoContainer = document.getElementById('video-container');
    const nextVideoButton = document.getElementById('next-video-button');
    const categorySelector = document.getElementById('category-selector');

    if (categorySelector.value) {
        videoSource.src = '../img/members/' + categorySelector.value + '.mp4';
        videoPlayer.load();  // Necessary to load the new video
        videoContainer.style.display = 'block';
        nextVideoButton.style.display = 'block';
    } else {
        videoContainer.style.display = 'none';
        nextVideoButton.style.display = 'none';
    }
}

// Function to handle changes in video selection
function changeVideo() {
    const videoSource = document.getElementById('video-source');
    const videoPlayer = document.getElementById('video-player');
    const videoSelector = document.getElementById('video-selector');

    videoSource.src = '../img/members/' + videoSelector.value + '.mp4';
    videoPlayer.load();  // Necessary to load the new video
}

// Handle the "Next Video" button click
document.getElementById('next-video-button').addEventListener('click', function() {
    const select = document.getElementById('video-selector');
    select.selectedIndex = (select.selectedIndex + 1) % select.options.length;
    changeVideo();  // Make sure to call changeVideo to update the player
});

// Add event listeners for category and video selector changes
document.getElementById('category-selector').addEventListener('change', updateVideoPlayer);
document.getElementById('video-selector').addEventListener('change', changeVideo);

// Custom selector 
function toggleDropdown() {
    const options = document.querySelector('.custom-options');
    options.style.display = options.style.display === 'block' ? 'none' : 'block';
    options.style.opacity = options.style.opacity === '1' ? '0' : '1';
    options.style.visibility = options.style.visibility === 'visible' ? 'hidden' : 'visible';
    options.style.pointerEvents = options.style.pointerEvents === 'all' ? 'none' : 'all';
}

document.querySelectorAll('.custom-option').forEach(option => {
    option.addEventListener('click', function() {
        const value = this.getAttribute('data-value');
        const text = this.innerText;
        const trigger = document.querySelector('.custom-select-trigger');
        trigger.textContent = text;
        toggleDropdown();
        console.log("Selected value:", value); // for debug or further use
    });
});

