$(document).ready(() => {
    let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    let longPressTimer;
    let subjectsLoaded = false;

    const $homeSection = $('#home-section');
    const $booksSection = $('#books-section');
    const $bottomNav = $('#bottom-nav');
    const $navBook = $('#nav-book');
    const $subjectsList = $('#subjects-list');
    const $content = $('#content');

    const showSection = (sectionId) => {
        $homeSection.addClass('d-none');
        $booksSection.addClass('d-none');
        $content.addClass('d-none');
        $(sectionId).removeClass('d-none');
    };

    const updateNavigation = () => {
        if (loggedInUser && loggedInUser.role !== 'guest') {
            $navBook.addClass('d-none');
        } else {
            $navBook.removeClass('d-none');
        }
    };

    const loadSubjects = () => {
        if (!subjectsLoaded) {
            const subjects = [
                { name: 'ગણિત'},
                { name: 'વિજ્ઞાન '},
                { name: 'સામાજિક વિજ્ઞાન'},
                { name: 'ગુજરાતી'},
                { name: 'અંગ્રેજી'}
            ];

            $subjectsList.empty();
            subjects.forEach(subject => {
                $subjectsList.append(`<li class="list-group-item"><a href="#" class="subject-link" data-file="${subject.file}" data-subject="${subject.name}">${subject.name}</a></li>`);
            });

            subjectsLoaded = true;
        }
    };

    const checkLoggedInUser = () => {
        if (loggedInUser) {
            $bottomNav.removeClass('d-none');
            showSection('#home-section');
            updateNavigation();
        } else {
            window.location.href = 'Login/login.html';
        }
    };

    $('#logout').on('click', () => {
        loggedInUser = null;
        sessionStorage.removeItem('loggedInUser');
        localStorage.removeItem('loggedInUser');
        window.location.href = 'Login/login.html';
    });

    $('#nav-home').on('click', () => {
        showSection('#home-section');
    });

    $navBook.on('click', () => {
        if (loggedInUser && loggedInUser.role !== 'guest') {
            showSection('#books-section');
            loadSubjects();
        } else {
            alert('Only logged-in users can access the books section.');
        }
    });

    // Long press event for logout
    $('#nav-home').on('mousedown touchstart', () => {
        longPressTimer = setTimeout(() => {
            $('#logoutModal').modal('show');
        }, 1000); // 1 second long press
    }).on('mouseup mouseleave touchend', () => {
        clearTimeout(longPressTimer);
    });

    $('#confirm-logout').on('click', () => {
        $('#logout').click();
        $('#logoutModal').modal('hide');
    });

    // Load subject content using AJAX
    $(document).on('click', '.subject-link', function() {
        const subject = $(this).data('subject');
        const subItems = [
            { name: 'Notes', file: `Notes html/${subject.toLowerCase()}Notes.html` },
            { name: 'Videos', file: `Notes html/${subject.toLowerCase()}Videos.html` },
            { name: 'IMP', file: `Notes html/${subject.toLowerCase()}IMP.html` }
        ];
        $content.empty();
        $content.append(`<h2>${subject}</h2><ul id="sub-items-list" class="list-group"></ul>`);
        const $subItemsList = $('#sub-items-list');
        subItems.forEach(item => {
            $subItemsList.append(`<li class="list-group-item"><a href="#" class="sub-item-link" data-file="${item.file}">${item.name}</a></li>`);
        });
        showSection('#content');
    });

    // Load sub-item content using AJAX
    $(document).on('click', '.sub-item-link', function() {
        const file = $(this).data('file');
        $.ajax({
            url: file,
            method: 'GET',
            success: (data) => {
                $('#content').html(data);
            },
            error: () => {
                $('#content').html('<p>Error loading content.</p>');
            }
        });
    });
});