// Constants
const ROUTES = {
    LOGIN: 'Login/login.html',
    CONTENT_PATHS: {
        NOTES: 'Notes html',
        VIDEOS: 'Video html',
        IMP: 'IMP html'
    }
};

const SUBJECTS = [
    { name: 'ગણિત' },
    { name: 'વિજ્ઞાન' },
    { name: 'સામાજિક વિજ્ઞાન' },
    { name: 'ગુજરાતી' },
    { name: 'અંગ્રેજી' }
];

const ONE_SHOT_SUBJECTS = [
    { 
        name: 'ગણિત OneShot', 
        playlist: 'https://www.youtube.com/embed/videoseries?list=PLlv51909B3RZh78JdiHJV2TqRq7t6h5R5'
    },
    { 
        name: 'વિજ્ઞાન OneShot', 
        playlist: 'https://www.youtube.com/embed/videoseries?si=-U9J3zxhIcjG-vHq&amp;list=PLlv51909B3RYVlIHYlyzku-2lFHvEamu9'
    },
    { 
        name: 'સામાજિક વિજ્ઞાન OneShot', 
        playlist: 'https://www.youtube.com/playlist?list=EXAMPLE3'
    },
    { 
        name: 'ગુજરાતી OneShot', 
        playlist: 'https://www.youtube.com/playlist?list=EXAMPLE4'
    },
    {
        name: 'અંગ્રેજી OneShot',
        playlist: 'https://www.youtube.com/embed/videoseries?list=PLlv51909B3RYFxsBwWjJ4nrnFeBw_WTBV'
    }
      
];

class TKY {
    constructor() {
        this.loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        this.longPressTimer = null;
        this.subjectsLoaded = false;
        this.oneShotSubjectsLoaded = false;
        this.initializeElements();
        this.attachEventListeners();
        this.checkLoggedInUser();
    }

    initializeElements() {
        this.elements = {
            homeSection: $('#home-section'),
            booksSection: $('#books-section'),
            newsSection: $('#news-section'),
            homeworkSection: $('#homework-section'),
            bottomNav: $('#bottom-nav'),
            navBook: $('#nav-book'),
            navNews: $('#nav-news'),
            navHomework: $('#nav-homework'),
            subjectsList: $('#subjects-list'),
            content: $('#content'),
            logoutButton: $('#logout'),
            navHome: $('#nav-home'),
            confirmLogout: $('#confirm-logout')
        };
    }

    attachEventListeners() {
        this.elements.logoutButton.on('click', () => this.logout());
        this.elements.navHome.on('click', () => this.showSection('#home-section'));
        this.elements.navBook.on('click', () => this.handleNavBookClick());
        this.elements.navNews.on('click', () => this.showSection('#news-section'));
        this.elements.navHomework.on('click', () => this.showSection('#homework-section'));
        // Long press for logout
        this.elements.navHome
            .on('mousedown touchstart', () => this.startLongPress())
            .on('mouseup mouseleave touchend', () => this.clearLongPress());

        this.elements.confirmLogout.on('click', () => {
            this.logout();
            $('#logoutModal').modal('hide');
        });

        // Delegate event handlers
        $(document).on('click', '.subject-link', (e) => this.handleSubjectClick(e));
        $(document).on('click', '.oneshot-link', (e) => this.handleOneShotClick(e));
        $(document).on('click', '.sub-item-link', (e) => this.handleSubItemClick(e));
    }

    showSection(sectionId) {
    $('.app-section').addClass('d-none');
    $(sectionId).removeClass('d-none');

    // Optional: Update active nav button styles
    $('#bottom-nav button').removeClass('btn-primary').addClass('btn-light');
    $(`[data-target="${sectionId}"]`).removeClass('btn-light').addClass('btn-primary');
}

    updateNavigation() {
        if (this.loggedInUser) {
            this.elements.navBook.removeClass('d-none');
            this.elements.navHomework.removeClass('d-none');
            this.elements.navNews.removeClass('d-none');
            this.elements.bottomNav.removeClass('d-none');
        } else {
            this.elements.navBook.addClass('d-none');
            this.elements.navHomework.addClass('d-none');
            this.elements.navNews.addClass('d-none');
        }
    }

    logout() {
        localStorage.removeItem('loggedInUser');
        window.location.href = ROUTES.LOGIN;
    }

    startLongPress() {
        // Only start the timer if it is not already set
        if (!this.longPressTimer) {
            this.longPressTimer = setTimeout(() => {
                $('#logoutModal').modal('show');
                this.longPressTimer = null;  // Reset the timer to prevent further triggers
            }, 1000);
        }
    }

    clearLongPress() {
        clearTimeout(this.longPressTimer);
        this.longPressTimer = null; // Ensure the timer is reset
    }

    loadSubjects() {
        this.elements.subjectsList.empty();
        
        // Add regular subjects
        SUBJECTS.forEach(subject => {
            this.elements.subjectsList.append(
                `<li class="list-group-item">
                    <a href="#" class="subject-link" data-subject="${subject.name}">${subject.name}</a>
                </li>`
            );
        });

        // Add One Shots option
        this.elements.subjectsList.append(
            `<li class="list-group-item">
                <a href="#" class="subject-link oneshotsubject" data-subject="One Shots">One Shots</a>
            </li>`
        );

        this.subjectsLoaded = true;
    }

    loadOneShotSubjects() {
        if (this.oneShotSubjectsLoaded) return;

        this.elements.subjectsList.empty();
        this.subjectsLoaded = false;
        
        ONE_SHOT_SUBJECTS.forEach(subject => {
            this.elements.subjectsList.append(
                `<li class="list-group-item">
                    <a href="#" class="oneshot-link" data-playlist="${subject.playlist}">${subject.name}</a>
                </li>`
            );
        });

        this.oneShotSubjectsLoaded = true;
    }

    async loadContent(file) {
        // Show the loading indicator
        $('#loading-indicator').removeClass('d-none');
    
        try {
            const response = await $.ajax({
                url: file,
                method: 'GET'
            });
            
            // Hide the loading indicator
            $('#loading-indicator').addClass('d-none');
            
            // Update content with the loaded response
            this.elements.content.html(response);
        } catch (error) {
            // Hide the loading indicator in case of error
            $('#loading-indicator').addClass('d-none');
            
            // Show error message in content area
            this.elements.content.html('<p>coming soon</p>');
        }
    }
    

    handleSubjectClick(e) {
        const subject = $(e.currentTarget).data('subject');

        if (subject === 'One Shots') {
            this.loadOneShotSubjects();
            return;
        }

        const subItems = [
            { name: 'Notes', file: `${ROUTES.CONTENT_PATHS.NOTES}/${subject.toLowerCase()}Notes.html` },
            { name: 'Videos', file: `${ROUTES.CONTENT_PATHS.VIDEOS}/${subject.toLowerCase()}Videos.html` },
            { name: 'IMP', file: `${ROUTES.CONTENT_PATHS.IMP}/${subject.toLowerCase()}IMP.html` }
        ];

        this.elements.content.empty()
            .append(`<h2>${subject}</h2><ul id="sub-items-list" class="list-group"></ul>`);

        const $subItemsList = $('#sub-items-list');
        subItems.forEach(item => {
            $subItemsList.append(
                `<li class="list-group-item">
                    <a href="#" class="sub-item-link" data-file="${item.file}">${item.name}</a>
                </li>`
            );
        });

        this.showSection('#content');
    }
    handleOneShotClick(e) {
        let playlist = $(e.currentTarget).data('playlist');  // Correctly access the data
        
        // Clear the content only if necessary (when switching playlists or new content)
        this.elements.content.html('');
    
        // If the playlist is an array (multiple playlists)
        if (Array.isArray(playlist)) {
            playlist.forEach((url) => {
                // Ensure the URL starts with 'https://' for correct embedding
                url = url.includes('m.youtube.com') ? url.replace('m.youtube.com', 'www.youtube.com') : url;
                url = url.startsWith('https://') ? url : `https://${url}`;
    
                // Handle playlist links specifically
                if (url.includes('list=')) {
                    const playlistId = url.split('list=')[1]; // Extract playlist ID
                    url = `https://www.youtube.com/embed/videoseries?list=${playlistId}`;
                }
    
                // Construct iframe URL with parameters
                const iframeSrc = `${url}&modestbranding=0&showinfo=0&controls=1&rel=0`;
    
                // Embed the iframe for each playlist separately (appending only once)
                this.elements.content.append(
                    `<iframe 
                    width="100%" 
                    height="200px" 
                    src="${iframeSrc}" 
                    frameborder="2" 
                    allow="encrypted-media" 
                    allowfullscreen
                    style="border-radius: 10px; border: 2px solid #ccc;">
                </iframe>`
                );
            });
        } else {
            // If it's a single playlist
            if (playlist.includes('m.youtube.com')) {
                playlist = playlist.replace('m.youtube.com', 'www.youtube.com');
            }
    
            if (playlist.includes('list=')) {
                const playlistId = playlist.split('list=')[1]; // Extract playlist ID
                playlist = `https://www.youtube.com/embed/videoseries?list=${playlistId}`;
            }
    
            const iframeSrc = `${playlist}&modestbranding=0&showinfo=0&controls=1&rel=0`;
    
            // Embed the iframe for a single playlist
            this.elements.content.html(
                `<iframe 
                    width="100%" 
                    height="200px" 
                    src="${iframeSrc}" 
                    frameborder="2" 
                    allow="encrypted-media" 
                    allowfullscreen
                    style="border-radius: 10px; border: 2px solid #ccc;">
                </iframe>`
            );
        }
    
        this.showSection('#content'); // Show the content section
    }
    
    
    
    
    handleSubItemClick(e) {
        const file = $(e.currentTarget).data('file');
        
        // Show the loading indicator before loading content
        $('#loading-indicator').removeClass('d-none');
        
        this.loadContent(file);
    }
    

    handleNavBookClick() {
        if (!this.loggedInUser || this.loggedInUser.role === 'guest') {
            return;
        }

        // Reset both flags when clicking book navigation
        this.oneShotSubjectsLoaded = false;
        this.subjectsLoaded = false;
        
        // Load regular subjects
        this.loadSubjects();
        this.showSection('#books-section');
    }

    checkLoggedInUser() {
        if (!this.loggedInUser) {
            window.location.href = ROUTES.LOGIN;
            return;
        }

        if (this.loggedInUser.role === 'guest') {
            this.handleGuestUser();
            return;
        }

        this.showSection('#home-section');
        this.updateNavigation();
    }

    handleGuestUser() {
        this.elements.navBook.addClass('d-none');
        this.elements.homeSection.html(`
            <div id="home-section" class="app-section">
                <button id="logout" class="btn btn-danger btn-block d-none">Logout</button>
                <div class="home text-center my-4">
                    <h1>BlackTurm</h1>
                    <hr>
                    <p>This app is specifically designed for 10th-grade students, providing useful resources for all exams, including board exams.</p>
                    <br>
                    <h3><a href="#" class="homelogout">login first</a></h3>
                </div>
            </div>
        `);
        this.elements.booksSection.addClass('d-none');
        this.showSection('#home-section');
        $('.homelogout').on('click', () => this.logout());
    }
}

// Initialize the app when the document is ready
$(document).ready(() => new TKY());
document.addEventListener("DOMContentLoaded", function () {
    const tkyApp = new TKY();
    tkyApp.showSection('#home-section');
});