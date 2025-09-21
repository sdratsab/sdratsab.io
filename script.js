document.addEventListener('DOMContentLoaded', () => {

    // --- YOUR CUSTOMIZED PROJECTS ---
    const projects = [
        {
            id: 'project1',
            title: 'photography',
            images: [
                'images/52AAC25F-72FF-452C-95F6-58B4FC2E5618-2.jpg',
                'images/B460342B-324B-416D-883C-D12A7B4A96F4.jpg',
                'images/IMGP5699.jpg_dimensions_7_by_5-2.jpg',
                'images/IMGP9203.JPG',
                'images/IMGP9208.JPG',
                'images/IMGP9591-2.jpg'
            ]
        },
        {
            id: 'project2',
            title: 'digital art',
            images: [
                'images/e008677578c160c060583d94affdb74b.png',
                'images/ig bipolar ep.png',
                'images/bea water color.png',
                'images/quickb quick.png',
                'images/feng.png',
                'images/8.9.25.png',
                'images/bea drawing idk.png',
                'images/bea evagolion 3.png',
                'images/bea uk.png',
                'images/bea wheel.png',
                'images/momoXbri.png',
                'images/pbm ipod camo.png',
                'images/pbm ipod2.png',
                'images/pbm pink camo ipod.png',
                'images/talks art.png',
                'images/talks work 8.3.25.jpg',
                'images/talktopia(withwatermark).png',
                'images/Untitled-2.jpg'
            ]
        }
    ];
    // --- END OF CUSTOMIZATION ---


    const desktop = document.getElementById('desktop');
    const projectWindow = document.getElementById('project-window');
    const aboutWindow = document.getElementById('about-window');
    const imageViewerWindow = document.getElementById('image-viewer-window');
    const viewerImage = document.getElementById('viewer-image');
    const allWindows = document.querySelectorAll('.window');
    let highestZIndex = 10;
    
    // Live Clock for Memphis (CDT)
    const clockElement = document.getElementById('clock');
    function updateClock() {
        const now = new Date();
        const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'America/Chicago' };
        clockElement.textContent = now.toLocaleDateString('en-US', options);
    }
    setInterval(updateClock, 1000);
    updateClock();

    // Function to bring a window to the front
    const bringToFront = (windowEl) => {
        highestZIndex++;
        windowEl.style.zIndex = highestZIndex;
    };

    // Handle opening windows
    desktop.addEventListener('click', (e) => {
        const icon = e.target.closest('.icon');
        if (!icon) return;

        const targetId = icon.dataset.target;
        let windowToOpen;

        if (targetId === 'about') {
            windowToOpen = aboutWindow;
        } else {
            const project = projects.find(p => p.id === targetId);
            if (project) {
                const projectTitle = projectWindow.querySelector('#project-title');
                const projectContent = projectWindow.querySelector('#project-content');
                projectTitle.textContent = project.title;
                projectContent.innerHTML = ''; // Clear previous images
                project.images.forEach(imgPath => {
                    const img = document.createElement('img');
                    img.src = imgPath;
                    img.alt = project.title;

                    img.addEventListener('dblclick', () => {
                        viewerImage.src = imgPath;
                        imageViewerWindow.style.display = 'flex';
                        bringToFront(imageViewerWindow);
                    });

                    projectContent.appendChild(img);
                });
                windowToOpen = projectWindow;
            }
        }
        
        if (windowToOpen) {
            windowToOpen.style.display = 'flex';
            bringToFront(windowToOpen);
        }
    });

    // Handle closing windows
    document.querySelectorAll('.close').forEach(button => {
        const window = button.closest('.window');
        if (window.id !== 'now-playing-window') {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                window.style.display = 'none';
            });
        }
    });

    // Make windows draggable and bring to front on click
    allWindows.forEach(windowEl => {
        const titleBar = windowEl.querySelector('.title-bar');
        let isDragging = false;
        let offsetX, offsetY;

        windowEl.addEventListener('mousedown', () => bringToFront(windowEl));

        titleBar.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - windowEl.offsetLeft;
            offsetY = e.clientY - windowEl.offsetTop;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                windowEl.style.left = `${e.clientX - offsetX}px`;
                windowEl.style.top = `${e.clientY - offsetY}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    });
    
    // --- LAST.FM NOW PLAYING ---
    const lastFm = {
        apiKey: '5fe73ca039a7a9996fcf048788009098',
        user: 'Lovingmachinee'
    };
    const nowPlayingContent = document.querySelector('.now-playing-content');

    async function getNowPlaying() {
        try {
            const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${lastFm.user}&api_key=${lastFm.apiKey}&format=json&limit=1`);
            const data = await response.json();
            
            if (data.recenttracks && data.recenttracks.track.length > 0) {
                const track = data.recenttracks.track[0];
                const artist = track.artist['#text'];
                const title = track.name;
                const albumArt = track.image[2]['#text']; 
                
                nowPlayingContent.innerHTML = `
                    <img src="${albumArt || 'https://i.imgur.com/t27j21v.png'}" alt="Album Art">
                    <div class="track-info">
                        <p class="song-title">${title}</p>
                        <p class="artist-name">${artist}</p>
                    </div>
                `;
            } else {
                nowPlayingContent.innerHTML = `<p>Nothing playing right now.</p>`;
            }
        } catch (error)
        {
            console.error("Error fetching Last.fm data:", error);
            nowPlayingContent.innerHTML = `<p>Could not fetch music data.</p>`;
        }
    }
    
    getNowPlaying();
    setInterval(getNowPlaying, 30000); 

});