// Video Player
const videos = [
    { id: 'QM_RsQ9Yeio?si=hqVmX0iNdmBkbR-Z', title: 'REVERSE POLISH NOTATION' },
    { id: '1VjJe1PeExQ?si=bOwKg5_prB4j5cyo', title: 'THE SHUNTING YARD ALGORITHM' },
    { id: 'vXPL6UavUeA?si=XnSRXCkF36Rd9-k1', title: 'INFIX TO POSTFIX CONVERSION' },
    { id: 'vq-nUF0G4fI?si=9TJ6Dz3FungziQWr', title: 'INFIX TO POSTFIX USING STACK' },
    { id: '84BsI5VJPq4?si=YNXATQ00WSHc2BPu', title: 'EVALUATION OF POSTFIX EXPRESSION' },
];

let currentVideoIndex = 0;
const videoPlayer = document.getElementById('videoPlayer');
const videoTitle = document.getElementById('videoTitle');
const prevBtn = document.getElementById('prevButton');
const nextBtn = document.getElementById('nextButton');

function updateVideo()
{
    const video = videos[currentVideoIndex];
    videoPlayer.src = `https://www.youtube.com/embed/${video.id}`;
    videoTitle.textContent = video.title;

    prevBtn.disabled = currentVideoIndex === 0;
    nextBtn.disabled = currentVideoIndex === videos.length - 1;
}

prevBtn.addEventListener('click', () =>
{
    if (currentVideoIndex > 0)
    {
        currentVideoIndex--;
        updateVideo();
    }
});

nextBtn.addEventListener('click', () =>
{
    if (currentVideoIndex < videos.length - 1)
    {
        currentVideoIndex++;
        updateVideo();
    }
});

// Initialize the first video
updateVideo();
