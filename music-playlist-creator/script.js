// =========== DYNAMICALLY ADDING THE MODAL SONG ELEMENTS ============


// takes in one song object and returns the html code for the song
const createSongElement = (song) => {
    // fetching elements of the song
    let id = song.songID;
    let name = song.song_name;
    let artist = song.song_artist;
    let album = song.song_album;
    let duration = song.song_duration;


    // turning into html
    let middle = `
                    <section class="song">
                        <img src="assets/img/song.png" class="modal-song-img" alt="snoopy and woodstock in sunglasses">
                        <section class="modal-song-subheader">
                            <h3 class="modal-song-name">${name}</h3>
                            <p class="song-info">${artist}</p>
                            <p class="song-info">${album}</p>
                            <p class="song-info">${duration}</p>
                        </section>
                    </section>`;

    return middle;
};

const loadSongs = (songs, playlist) => {

    // start of modal html code
    let html = ` <div class="modal-content">

    <span class="close" id="close${playlist.playlistID}">&times;</span>
    <button class ="shuffle" id="shuffle-button${playlist.playlistID}">Shuffle</button>


    <section class="modal-header">
        <img src="assets/img/playlist.png" class="modal-playlist-img" alt="snoopy and woodstock in sunglasses">
        <section class="modal-subheader">
            <h2 class="modal-playlist-name">${playlist.playlist_name}</h2>
            <h4 class="modal-playlist-creator">Created By ${playlist.playlist_author}</h4>
        </section>
    </section>

    <section class="modal-body" id='modal-body${playlist.playlistID}'>`;

    for(const song of songs){
        html += createSongElement(song); // append song code
    }

    html += `</section>
            </div>`; // end of modal html code

    // create the modal element using the html code and append it to the body
    const modalElement = document.createElement("section");
    modalElement.className = "modal-overlay";
    modalElement.id = "modal" + playlist.playlistID;
    modalElement.innerHTML = html;

    const body = document.querySelector("body");
    body.append(modalElement);
};


// ======= ADDING PLAYLIST ELEMENTS =======

const createPlaylistElement = (playlist) => {

    let playlistID = playlist.playlistID;
    let playlist_name = playlist.playlist_name;
    let playlist_author = playlist.playlist_author;
    let playlist_likes = playlist.likes;

    html = `
    <section class="card" id="card${playlistID}">
        <img class="playlist-img" src="assets/img/playlist.png" alt="playlist">
        <h3 id="playlist-title1">${playlist_name}</h3>
        <h4 id="playlist-author1">Created By ${playlist_author}</h4>


        <section class="likes">
            <p class="like-image" id="like-button${playlistID}" >♡</p>
            <p id="like-count${playlistID}">${playlist_likes}</p>
        </section>
        <p class=delete id="delete${playlistID}">❌</p>
    </section>
    `
    return html;
}











// =========== DISPLAYING/CLOSING THE MODAL ============

// only do this if we are on the index.html page
const modalClickResponse = () => {
    console.log("loading modals");
    if (!window.location.pathname.includes("featured.html")) {
        console.log("loading modals");
        // open appropriate modal when clicking the card
        for (let i = 1; i <= playlists.length; i++) {
            document.querySelector('#card' + i).addEventListener('click', () => {
                const modal = document.querySelector("#modal" + i).style.display = 'block';
            });
        }

        // close on clicking the close button
        for (let i = 1; i <= playlists.length; i++) {
            document.querySelector('#close' + i).addEventListener('click', () => {
                document.querySelector('#modal' + i).style.display = 'none';
            });}

        // close on clicking anywhere outside the modal
        for (let i = 1; i <= playlists.length; i++) {
            const modal = document.querySelector('#modal' + i);
            modal.addEventListener('click', (event) => {
                // only close if user clicks directly on the overlay (not modal content)
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }
    }
}




 // =========== LIKE BUTTON ============

// takes in playlistID as a string
 const likePlaylist = (playlistID) => {
    // get the like button element
    const likeButton = document.getElementById("like-button" + playlistID);
    likeButton.textContent = "♥️";

    // get the like count element
    const likeCount = document.getElementById("like-count" + playlistID);
    let likeCountInt = parseInt(likeCount.textContent);
    likeCountInt += 1; // increment
    likeCount.textContent = likeCountInt.toString(); // update graphically

    playlists[parseInt(playlistID) - 1].likes = likeCountInt; // update logically
 };

 const unlikePlaylist = (playlistID) => {
    // get the like button element
    const likeButton = document.getElementById("like-button" + playlistID);
    likeButton.textContent = "♡";

    // get the like count element
    const likeCount = document.getElementById("like-count" + playlistID);
    let likeCountInt = parseInt(likeCount.textContent);
    likeCountInt -= 1; // decrement
    likeCount.textContent = likeCountInt.toString(); // update graphically

    playlists[parseInt(playlistID) - 1].likes = likeCountInt; // update logically
 }

const likeClickResponse = () => {
    // only do this if we are on the index.html page
    if (!window.location.pathname.includes("featured.html")) {
        for (let i = 1; i <= playlists.length; i++) {
            document.querySelector('#like-button' + i).addEventListener('click', (event) => {
            event.stopPropagation(); // prevent click from bubbling to playlist
            if (event.target.textContent === "♡") {
                likePlaylist(i);
            } else {
                unlikePlaylist(i);
            }
            });
        }
    }
}



  // =========== SHUFFLE BUTTON ============

const shufflePlaylist = (playlistID) => {
    const playlistIndex = parseInt(playlistID) - 1;

    // Clone the array to preserve the original order for comparison
    let songs = [...playlists[playlistIndex].songs]; // shallow copy

    // Fisher-Yates shuffle
    let currentIndex = songs.length;
    while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [songs[currentIndex], songs[randomIndex]] = [songs[randomIndex], songs[currentIndex]];
    }

    // Update playlist
    playlists[playlistIndex].songs = songs;
};

const updateSongs = (songs, playlistID) =>{
    html = ``;
    for(const song of songs){
        html += createSongElement(song); // append song code
    }

    let newBody = document.createElement("section");
    newBody.className = "modal-body";
    newBody.id = "modal-body" + playlistID;
    newBody.innerHTML = html;

    const modalBody = document.getElementById('modal-body' + playlistID);

    modalBody.replaceWith(newBody);
}

const shuffleClickResponse = () => {
    // only do this if we are on the index.html page
    if (!window.location.pathname.includes("featured.html")) {
    for (let i = 1; i <= playlists.length; i++) {
        document.getElementById('shuffle-button' + i).addEventListener('click', () => {
            shufflePlaylist(''+i);
            updateSongs(playlists[i-1].songs, i);
        });
        }
    }
}

// =========== DELETE PLAYLISTS ============
const deletePlaylist = (playlistID) =>{
    console.log("before", playlists);

    playlists = playlists.filter(playlist => parseInt(playlist.playlistID) !== parseInt(playlistID));

    //re-number the playlist IDs
    for (let i = 1; i <= playlists.length; i++) {
        playlists[i-1].playlistID = i + '';
    }

    console.log("after", playlists);

    // WANT TO CALL LOAD PLAYLISTS HERE
    loadPlaylists();
}

const deleteClickResponse = () => {
    if(!window.location.pathname.includes("featured.html")){
        // close on clicking the close button
        for (let i = 1; i <= playlists.length; i++) {
            document.querySelector('#delete' + i).addEventListener('click', () => {
                event.stopPropagation();
                deletePlaylist(i + '');
        });}
    }
}


// =========== LOAD PLAYLISTS ============
// parse through the playlists hashmap to populate the playlist cards
const loadPlaylists = () => {

    console.log("load playlists called");
    console.log(playlists);

    if(!playlists){

        // Display error message on a popup modal
        const errorElement = document.createElement("div");
        errorElement.innerHTML  = `
        <section class="modal-overlay">
            <div class="modal-content">
                <h1>No Playlists to Display :( <h1>
            </div>
        </section>
        `

        const body = document.querySelector("body");
        body.append(errorElement);
    }
    else{
        // iterate through the playlists and add each one to the elements
        // for(const playlist of playlists){
        //     insertPlaylistElement(playlist);
        // }
        html = `<section class="playlist-row">`;
        for(let i = 0; i < playlists.length; i++){
            if (i % 4 === 0 && i !== 0) {
                console.log(i);
                //close the row and start a new one
                html += `</section>`;
                html += `<section class="playlist-row">`;
            }
            loadSongs(playlists[i].songs, playlists[i]);
            html += createPlaylistElement(playlists[i]); // append playlist code
        }
        html += `</section>`;

        playlistsElement = document.getElementById("playlist-container");
        playlistsElement.innerHTML = html; // update the html

        modalClickResponse(); // open modal on click
        likeClickResponse(); // like button
        shuffleClickResponse(); // shuffle button
        deleteClickResponse(); // delete button
    }
};


// =========== FEATURED PAGE ============

const loadFeaturedPlaylist = (playlist) => {

    // update the name and creator of the featured playlist
    document.getElementById("featured-playlist-name").textContent = playlist.playlist_name;
    document.getElementById("featured-playlist-creator").textContent = 'Created by ' + playlist.playlist_author;

    songs = playlist.songs;
    // update the songs
    html = ``;
    for(const song of songs){
        html += createSongElement(song); // append song code
    }

    let newBody = document.createElement("section");
    newBody.className = "modal-body";
    newBody.id = "modal-body" + playlist.playlistID;
    newBody.innerHTML = html;

    const featuredBody = document.getElementById('featured-body');

    featuredBody.replaceWith(newBody);
}

if (window.location.pathname.includes("featured.html")) {
    loadFeaturedPlaylist(playlists[Math.floor(Math.random() * playlists.length)]);
}


// =========== ADD PLAYLISTS ============

if (!window.location.pathname.includes("featured.html")) {

    const handleSubmit = (event) => {
        console.log("Form submitted");
        event.preventDefault(); // making sure there are things to submit

        const playlist_name = document.querySelector("#playlist-name").value;
        const playlist_author = document.querySelector("#playlist-author").value;

        const song_name = document.querySelector("#song-name").value;
        const artist = document.querySelector("#song-artist").value;
        const album = document.querySelector("#song-album").value;
        const duration = document.querySelector("#song-duration").value;

        // create a new review object
        let new_playlist = {
            "playlistID": (playlists.length + 1) + '',
            "playlist_name": playlist_name,
            "playlist_author": playlist_author,
            "playlist_art": undefined,
            "likes": 0,
            "songs": [
                {
                    "songID": "1",
                    "song_name": song_name,
                    "song_artist": artist,
                    "song_art": undefined,
                    "song_album": album,
                    "song_duration": duration

                }]
            }

        console.log(new_playlist);

        playlists.push(new_playlist);

        console.log(playlists);

        loadPlaylists(); // update the playlist cards

        event.target.reset(); // reset the form

    }

    const form = document.querySelector("#add-playlist-form");
    form.addEventListener("submit", handleSubmit);
}

if (!window.location.pathname.includes("featured.html")) {
    loadPlaylists();
}


// =========== SORT PLAYLISTS ============
// Get the select element by its ID
const sortBySelect = document.getElementById('sort-by');

// Add an event listener for when the selection changes
sortBySelect.addEventListener('change', function(event) {
    const selectedValue = event.target.value;

    switch (selectedValue) {
        case 'no-sort':
            // Handle no sorting
            console.log('No sorting applied');
            break;
        case 'sort-by-name':
            // Handle sorting by playlist name A-Z
            console.log('Sorting by playlist name A-Z');
            sortByName();
            break;
        case 'sort-by-likes':
            // Handle sorting by number of likes (descending)
            console.log('Sorting by number of likes (descending)');
            sortByLikes();
            break;
        case 'sort-by-date':
            // Handle sorting by date added
            console.log('Sorting by date added');
            // sortByDateFunction();
            break;
        default:
            console.log('Unknown sort option');
    }
});

const sortByName= () => {
    // Sort the playlists array by playlist_name
    playlists = playlists.sort((a, b) => a.playlist_name.localeCompare(b.playlist_name));
    loadPlaylists();
}

const sortByLikes = () => {
    // Sort the playlists array by playlist_name
    playlists = playlists.sort((a, b) => parseInt(b.likes) - parseInt(a.likes));
    loadPlaylists();
}
