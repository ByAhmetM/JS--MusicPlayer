const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const repeatButton = document.getElementById("repeat");
const shuffleButton = document.getElementById("shuffle");
const pauseButton = document.getElementById("pause");
const playButton = document.getElementById("play");

const audio = document.getElementById("audio");
const songImage = document.getElementById("song-image");
const songName = document.getElementById("song-name");
const songArtist = document.getElementById("song-artist");
const playListButton = document.getElementById("playlist");

const maxDuration = document.getElementById("max-duration");
const currentTimeRef = document.getElementById("current-time");

const progressBar = document.getElementById("progress-bar");
const playListContainer = document.getElementById("playlist-container");
const closeButton = document.getElementById("close-button");
const playListSongs = document.getElementById("playlist-songs");

const currentProgress = document.getElementById("current-progress");

//* Sıra olmalı

let index;

//* döngü

let loop = true;

//*json şarkı liste yapısı
const songsList = [
  {
    name: "Lafı Mı Olur",
    link: "assets/kibariye.mp3",
    artist: "Kibariye",
    image: "assets/kibariye.jpg",
  },
  {
    name: "Deniz Üstü Köpürür",
    link: "assets/haluk.mp3",
    artist: "Haluk Levent",
    image: "assets/haluk.jpg",
  },
  {
    name: "Pir",
    link: "assets/soner.mp3",
    artist: "Soner Sarıkabadayı",
    image: "assets/soner.jpg",
  },
  {
    name: "Ben Sende Tutuklu Kaldım",
    link: "assets/sezen.mp3",
    artist: "Sezen Aksu",
    image: "assets/sezen.jpg",
  },
  {
    name: "Gül Ki Sevgilim",
    link: "assets/oguz.mp3",
    artist: "Oğuzhan Koç",
    image: "assets/oguz.jpg",
  },
  {
    name: "Hasretinle Yandı Gönlüm",
    link: "assets/edip.mp3",
    artist: "Edip Akbayram",
    image: "assets/edip.jpg",
  },
];

//time formatter
const timeFormatter = (timeInput) => {
  let minute = Math.floor(timeInput / 60);
  minute = minute < 10 ? "0" + minute : minute;
  let second = Math.floor(timeInput % 60);
  second = second < 10 ? "0" + second : second;
  return `${minute}:${second} `;
};

//*şarkı atama
const setSong = (arrayIndex) => {
  let { name, link, artist, image } = songsList[arrayIndex];

  //* audio atanacak
  songName.innerHTML = name;
  songImage.src = image;
  songArtist.innerHTML = artist;
  audio.src = link;

  audio.onloadeddata = () => {
    //en fazla vakti ver max duration
    maxDuration.innerText = timeFormatter(audio.duration);
  };
  //container eğer görünüyorsa yok et
  playListContainer.classList.add("hide");
  playAudio();
};

const playAudio = () => {
  audio.play();
  pauseButton.classList.remove("hide");
  playButton.classList.add("hide");
};

const pauseAudio = () => {
  audio.pause();
  pauseButton.classList.add("hide");
  playButton.classList.remove("hide");
};

const nextSong = () => {
  if (!loop) {
    if (index == songsList.length - 1) {
      index = 0;
    } else {
      index += 1;
    }
    setSong(index);
    playAudio();
  } else {
    let randIndex = Math.floor(Math.random() * songsList.length);
    // console.log(randIndex);
    setSong(randIndex);
    playAudio();
  }
};

const prevSong = () => {
  if (index > 0) {
    pauseAudio();
    index -= 1;
  } else {
    index = songsList.length - 1;
  }
  setSong(index);
  playAudio();
};

audio.onended = () => {
  nextSong();
};

progressBar.addEventListener("click", (event) => {
  let coordStart = progressBar.getBoundingClientRect().left;
  let coordEnd = event.clientX;
  let progress = (coordEnd - coordStart) / progressBar.offsetWidth;
  currentProgress.style.width = progress * 100 + "%";
  audio.currentTime = progress * audio.duration;
  audio.play();
  pauseButton.classList.remove("hide");
  playButton.classList.add("hide");
});

const initializePlayList = () => {
  for (const i in songsList) {
    playListSongs.innerHTML += `<li class="playlistSong"
    onclick="setSong(${i})">
    <div class="playlist-image-container">
     <img src="${songsList[i].image}"/>
     </div>
     <div class="playlist-song-details">
      <span id="playlist-song-name">
       ${songsList[i].name}
       </span>
       <span id="playlist-song-artist-album">
       ${songsList[i].artist}
       </span>
      </div>
     </li>`;
  }
};

playListButton.addEventListener("click", () => {
  playListContainer.classList.remove("hide");
});

closeButton.addEventListener("click", () => {
  playListContainer.classList.add("hide");
});

//play button
playButton.addEventListener("click", playAudio);
//durdur button
pauseButton.addEventListener("click", pauseAudio);
//sonraki şarkı
nextButton.addEventListener("click", nextSong);
//önceki şarkı
prevButton.addEventListener("click", prevSong);
// karıştır tıklandığında
shuffleButton.addEventListener("click", () => {
  if (shuffleButton.classList.contains("active")) {
    shuffleButton.classList.remove("active");
    loop = true;
    console.log("karıştırma kapalı");
  } else {
    shuffleButton.classList.add("active");
    loop = false;
    console.log("karıştırma açık");
  }
});
//Tekrar et butonu tıklanıldığında
repeatButton.addEventListener("click", () => {
  if (repeatButton.classList.contains("active")) {
    repeatButton.classList.remove("active");
    loop = false;
    console.log("tekrar kapalı");
  } else {
    repeatButton.classList.add("active");
    loop = true;
    console.log("tekrar açık");
  }
});

// her 1 saniyede progress barın widthini artır ve süreyi ilerlet
setInterval(() => {
  currentTimeRef.innerHTML = timeFormatter(audio.currentTime);
  currentProgress.style.width =
    (audio.currentTime / audio.duration.toFixed(3)) * 100 + "%";
}, 1000);

//zaman güncellemesini yakala
audio.addEventListener("timeupdate", () => {
  currentTimeRef.innerText = timeFormatter(audio.currentTime);
});

//ekran yüklendiğinde
window.onload = () => {
  index = 0;
  setSong(index);
  pauseAudio();
  initializePlayList();

  //oynatma listesini ayarla
};
