/* 
* 1. Render playlist
* 2. Scroll top 
* 3. Play / Pause / Seek
* 4. CD rotate
* 5. Next / Prev
* 6. Random
* 7. Next / Repeat when end
* 8. Acitive Song
* 9. Scroll song when in to view
* 10. Play song when click
*/
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "MUSIC_PLAYER";

const player = $('.player')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio') 
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const preBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')
const volumeChange = $('.volume')
const btnMute = $('.btn-mute')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    isMute: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function(key, value) {
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    songs: [
        {
            name: 'Orange',
            single: '7!!',
            path:'./asset/music-list/1.mp3',
            img: './asset/img/1.jpg'
        },
        {
            name: 'Lemon',
            single: 'Kenshi Yoneru',
            path:'./asset/music-list/2.mp3',
            img: './asset/img/2.jpg'
        },
        {
            name: 'Irony',
            single: 'Majiko',
            path:'./asset/music-list/3.mp3',
            img: './asset/img/3.jpg'
        },
        {
            name: 'Yume to Hazuka',
            single: 'Wotami',
            path:'./asset/music-list/4.mp3',
            img: './asset/img/4.jpg'
        },
        {
            name: 'Sakura',
            single: 'Ikimonogakari',
            path:'./asset/music-list/5.mp3',
            img: './asset/img/5.jpg'
        },
        {
            name: 'Promise the World',
            single: 'Kimura Yumi',
            path:'./asset/music-list/6.mp3',
            img: './asset/img/6.jpg'
        },
        {
            name: 'Itsumo Nando Demo',
            single: 'Ha Mei',
            path:'./asset/music-list/7.mp3',
            img: './asset/img/7.jpg'
        },
        {
            name: 'Ngu Nghếch',
            single: 'Hoàng Dũng',
            path:'./asset/music-list/8.mp3',
            img: './asset/img/8.jpg'
        },
        {
            name: 'Có hẹn với thanh xuân',
            single: 'Monstar',
            path:'./asset/music-list/9.mp3',
            img: './asset/img/9.jpg'
        },
        {
            name: 'Cưới thôi',
            single: 'Masew ft. B-ray',
            path:'./asset/music-list/10.mp3',
            img: './asset/img/10.jpg'
        },
        {
            name: 'Sài gòn đau lòng quá',
            single: 'Hứa Kim Tuyền, Hoàng Dương',
            path:'./asset/music-list/11.mp3',
            img: './asset/img/11.jpg'
        },
        {
            name: 'Dù cho mai về sau',
            single: 'buitruonglinh',
            path:'./asset/music-list/12.mp3',
            img: './asset/img/12.jpg'
        },
        {
            name: 'Đường tôi trở em về',
            single: 'buitruonglinh',
            path:'./asset/music-list/13.mp3',
            img: './asset/img/13.jpg'
        },
    ],
    render: function() {
        const htmls = this.songs.map( (song, index) => {
            return `
            <div data-index=${index} class="song ${index === this.currentIndex ? 'active' : ''}">
            <div class="thumb" style="background-image: url(${song.img})">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.single}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function() {
        const _this = this
        const cdWidth = cd.offsetWidth

        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()


        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0
            cd.style.opacity = newCdWidth / cdWidth
        }
        playBtn.onclick = function() {
            if (_this.isPlaying){
                audio.pause()     
            }else{
                audio.play()   
            } 
        }
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }
        audio.ontimeupdate = function(){
            const totalTime = audio.duration
            const timeNow = audio.currentTime
            if(totalTime) {
                
                const progressPercent = Math.floor(timeNow/totalTime * 100)
                progress.value = progressPercent
                
                $('.start').innerHTML = `${Math.floor(timeNow/60)}:${timeNow % 60 < 10 ? '0' : ''}${Math.floor(timeNow%60)}`
                $('.end').innerHTML = `${Math.floor(totalTime/60)}:${totalTime % 60 < 10 ? '0' : ''}${Math.floor(totalTime%60)}`
            }
        }

        progress.oninput = function(e) {
            setTimeout(() => {
                audio.play()
            }, 200)
            const seekTime = (audio.duration * e.target.value / 100)
            audio.currentTime = seekTime
        }

        nextBtn.onclick = function() {
            if(_this.isRandom){
                _this.randomSong()
            }else{
                _this.nextSong()
            }
            audio.play()
            _this.render()
        }

        preBtn.onclick = function() {
            if(_this.isRandom){
                _this.randomSong()
            }else{
                _this.preSong()
            }
            audio.play()
            _this.render()
        }

        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom
            _this.setConfig("isRandom", _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        repeatBtn.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig("isRepeat", _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')) {
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
                if (e.target.closest('.option')){

                }
            }
        }

        btnMute.onclick = function() {
            if(_this.isMute){
                audio.volume = volumeChange.value/100
                _this.isMute = false
                $('#volume').setAttribute('class', 'fa fa-volume-up')
            }else{
                _this.isMute = true
                audio.volume = 0
                $('#volume').setAttribute('class', 'fa fa-volume-mute')   
            }
            
        }

        volumeChange.oninput = function(){
            audio.volume = volumeChange.value/100
            if(audio.volume === 0){
                $('#volume').setAttribute('class', 'fa fa-volume-mute') 
            }else{
                $('#volume').setAttribute('class', 'fa fa-volume-up')
            }
        }

        audio.onended = function(){
            if(_this.isRepeat){
                audio.play()
            }else{
                nextBtn.click()  
            }        
        }
        
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`
        audio.src = this.currentSong.path
    },
    loadConfig: function(){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
    },
    nextSong: function() {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    preSong: function() {
        this.currentIndex--
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length-1
        }
        this.loadCurrentSong()
    },
    randomSong: function(){
        let newIndex = 0
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (this.currentIndex === newIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    start: function() {
        this.loadConfig()

        this.defineProperties()

        this.handleEvents()

        this.loadCurrentSong()

        this.render()
    }
}

app.start()