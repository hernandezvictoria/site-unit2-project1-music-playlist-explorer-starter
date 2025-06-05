// =========== DYNAMICALLY ADDING THE MODAL SONG ELEMENTS ============

let num_playlists = 8;

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

//given a playlist JSON, put edit the default playlists to be this playlist
const insertPlaylistElement = (playlist) => {
    let playlistID = playlist.playlistID;
    let playlist_name = playlist.playlist_name;
    let playlist_author = playlist.playlist_author;
    let playlist_likes = playlist.likes;


    // set title/name
    const title_element = document.getElementById("playlist-title" + playlistID); // would end up being playlist-title1 hopefully
    title_element.textContent = playlist_name;

    //set author
    const author_element = document.getElementById("playlist-author" + playlistID); // would end up being playlist-author1 hopefully
    author_element.textContent = playlist_author;

    //set likes
    const likes_element = document.getElementById("like-count" + playlistID); // would end up being like-count1 hopefully
    likes_element.textContent = playlist_likes;

    loadSongs(playlist.songs, playlist); // next load the songs
};


 // parse through the playlists hashmap to populate the playlist cards
 const loadPlaylists = () => {
    console.log("loadPlaylists called");

    if(!playlists){
        console.log("No playlists to display");

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
        for(const playlist of playlists){
            insertPlaylistElement(playlist);
        }
    }

};

// call loadPlaylists
loadPlaylists();



// =========== DISPLAYING/CLOSING THE MODAL ============

// open appropriate modal when clicking the card
 for (let i = 1; i <= num_playlists; i++) {
    document.querySelector('#card' + i).addEventListener('click', () => {
        const modal = document.querySelector("#modal" + i).style.display = 'block';
    });
 }

// close on clicking the close button
 for (let i = 1; i <= num_playlists; i++) {
    document.querySelector('#close' + i).addEventListener('click', () => {
        document.querySelector('#modal' + i).style.display = 'none';
    });}

// close on clicking anywhere outside the modal
for (let i = 1; i <= num_playlists; i++) {
    const modal = document.querySelector('#modal' + i);
    modal.addEventListener('click', (event) => {
        // only close if user clicks directly on the overlay (not modal content)
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
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



for (let i = 1; i <= num_playlists; i++) {
    document.querySelector('#like-button' + i).addEventListener('click', (event) => {
      event.stopPropagation(); // prevent click from bubbling to playlist
      if (event.target.textContent === "♡") {
        likePlaylist(i);
      } else {
        unlikePlaylist(i);
    }
    });
}



  // =========== SHUFFLE BUTTON ============

const shufflePlaylist = (playlistID) => {
    const playlistIndex = parseInt(playlistID) - 1;

    // Clone the array to preserve the original order for comparison
    let songs = [...playlists[playlistIndex].songs]; // shallow copy

    console.log("Before shuffle:", songs);

    // Fisher-Yates shuffle
    let currentIndex = songs.length;
    while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [songs[currentIndex], songs[randomIndex]] = [songs[randomIndex], songs[currentIndex]];
    }

    console.log("After shuffle:", songs);

    // Update playlist
    playlists[playlistIndex].songs = songs;
};

const updateSongs = (songs, playlistID) =>{
    console.log("updateSongs called");
    console.log(songs);
    html = ``;
    for(const song of songs){
        html += createSongElement(song); // append song code
    }

    let newBody = document.createElement("section");
    newBody.className = "modal-body";
    newBody.id = "modal-body" + playlistID;
    newBody.innerHTML = html;

    const modalBody = document.getElementById('modal-body' + playlistID);
    console.log(modalBody);
    console.log(newBody);

    modalBody.replaceWith(newBody);
}


  for (let i = 1; i <= num_playlists; i++) {
    document.getElementById('shuffle-button' + i).addEventListener('click', () => {
        shufflePlaylist(''+i);
        updateSongs(playlists[i-1].songs, i);
    });
    }
