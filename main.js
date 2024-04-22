const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'F8_PLAYER'
const player = $('.player')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')
const button = $('.switch')
const circle = $('.circle')
const bodyDarkMode = $('body')
const app = {

    currentIndex: 0,
    isPLaying: false,
    isRandom: false,
    isRepeat: false,
    isDark: false,
   config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
            {
                name: 'Có anh ở đây rồi',
                singer: 'Anh Quân Idol',
                path: "./assets/music/coanhodayroi.mp3",
                image: './assets/img/coanhodayroi.jpg'
            },
           
            {
                name: '3107-2',
                singer: 'Dương X Nâu',
                path: './assets/music/3107-2.mp3',
                image: './assets/img/anhdeep.jpg'
            },
            {
                name: 'Bông hoa đẹp nhất',
                singer: 'Quân AP',
                path: './assets/music/bonghoadepnhat.mp3',
                image: './assets/img/anhdeep.jpg'
            },
            {
                name: 'Chạm khẽ tim anh một chút thôi',
                singer: 'Noo Phước Thịng',
                path: './assets/music/chamkhetimanh.mp3',
                image: './assets/img/anhdeep.jpg'
            },
            {
                name: 'Em đau rồi đấy',
                singer: 'Dương Yến Phi',
                path: './assets/music/emdauroiday.mp3',
                image: './assets/img/anhdeep.jpg'
            },
            {
                name: 'Lối Nhỏ',
                singer: 'Đen vâu',
                path: './assets/music/loinho.mp3',
                image: './assets/img/loinho.jpg'
            },
            {
                name: 'Tháng 4 là lời nói dối của em',
                singer: 'Hà Anh Tuấn',
                path: './assets/music/thang4.mp3',
                image: './assets/img/anhdeep.jpg'
            },
            {
                name: 'Yêu đơn phương là gì',
                singer: 'Lofi chill',
                path: './assets/music/yeudonphuonglagi.mp3',
                image: './assets/img/anhdeep.jpg'
            },
        ],
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
        },
    render: function () {
        const htmls = this.songs.map((song, index) => {
        return `<div class="song ${index === this.currentIndex? 'active': ''}" data-index =${index}>
      <div class="thumb" style="background-image: url('${song.image}')">
      </div>
      <div class="body">
        <h3 class="title">${song.name}</h3>
        <p class="author">${song.singer}</p>
      </div>
      <div class="option">
        <i class="fas fa-ellipsis-h"></i>
      </div>
    </div>`
        })
        $('.playlist').innerHTML = htmls.join('')
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function () {
        const _this = this
        const cdWidth = cd.offsetWidth
        //xu li CD quay va dung
     const cdThumbAnimate =  cdThumb.animate([
            {
                transform: 'rotate(360deg)'
            }
        ], {
            duration: 10000,
            interations: Infinity
        })
        cdThumbAnimate.pause()
        //xu li phong to/ thu nho cd
        document.onscroll = function () {
            const scrollTop = window.screenY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }
        //xu li khi click play
        playBtn.onclick = function () {
            if (_this.isPLaying) {
                audio.pause()
               
            } else {

                
                audio.play()
                
            }
        }
        // Khi bai hat duoc play
        audio.onplay = function () {
                _this.isPLaying = true
                player.classList.add('playing')
                cdThumbAnimate.play()
        }
        // Khi bai hat bi pause
        audio.onpause = function () {
                 _this.isPLaying = false
                player.classList.remove('playing')
                cdThumbAnimate.pause()

        }
        // Thoi gian bai hat chay
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }
        // Xu li khi tua bai hat
        progress.onchange = function (e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }
        // khi next bai hat
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {

                _this.nextSong()
            }
            audio.play()
            _this.render()
        }
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {

                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()

        }
        // Random bai hat
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }
        //xu li phat lai 1 bai hat
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            

            repeatBtn.classList.toggle('active', _this.isRepeat)
            
        }
       // xu li next bai hat khi audio ended
        audio.onended = function () {
            if (_this.isRepeat) {
                    audio.play()
            } else {
                nextBtn.click()
                }
        }
        // Lang nghe hanh vi click vao playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
            // xu ly khi click vao bai hat
            if (songNode || e.target.closest('.option')) {
                if (songNode) {
                    console.log(songNode.dataset.index)
                    _this.currentIndex =  Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
                if (e.target.closest('.option')) {
                    
                }
                }
        }

        // xu li dark mode
        button.addEventListener('click', () => {
            bodyDarkMode.classList.toggle('modeDark')
        })
        
        
        
    },
    
    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song-activr').scrollIntoView(
                {
                    behavior: 'smooth',
                    block: 'nearest'
                })
        }, 300)
    },
    loadCurrentSong: function () {
        

        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path

        console.log(heading, cdThumb, audio);
    },

    loadConfig: function () {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },

    nextSong: function () {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function () {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function () {
        let newIndex 
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start: function () {
        // gan cau hinh tu config vao ung dung
        this.loadConfig()
        // Dinh nghia cac thuoc tinh cho Object
        this.defineProperties()

        // Lang nghe/xu li cac su kien (DOM events)
        this.handleEvents()


        // Tai thong tin bai hat dau tien vao UI khi chay ung dung
        this.loadCurrentSong()

        // Render playlist
        this.render()

        // hien thi trang thai ban dau cua button repeat & random
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
    }
}

app.start()