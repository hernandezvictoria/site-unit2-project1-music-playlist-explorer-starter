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


    <section class="modal-header">
        <img src="assets/img/playlist.png" class="modal-playlist-img" alt="snoopy and woodstock in sunglasses">
        <section class="modal-subheader">
            <h2 class="modal-playlist-name">${playlist.playlist_name}</h2>
            <h4 class="modal-playlist-creator">Created By ${playlist.playlist_author}</h4>
        </section>
    </section>

    <section class="modal-body">`;

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

    console.log(playlist);
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
            console.log(playlist);
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
    document.querySelector('#modal' + i).addEventListener('click', () => {
        document.querySelector('#modal' + i).style.display = 'none';
    });

 }
