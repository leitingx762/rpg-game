Object.assign(window.main, {
    width: document.body.clientWidth,
    height: 0.96 * document.documentElement.clientHeight
})
let ctx = window.main.getContext("2d"),
    renderlist = [],
    start,
    key = {
        w: 0,
        a: 0,
        s: 0,
        d: 0,
        k: 0
    },
    Hero = {
        atk: 10,
        cd: 500,
        coords: [window.main.width / 2 - 32, window.main.height / 2 - 32],
        date: new Date,
        def: 2,
        flag: {
            move: new Date,
            attack: "",
            heal: true
        },
        hp: 100,
        heal: function () { //  hp+2/s,cd 5s
            this.flag.heal = false
            for (let n = 0; n < 5; n++) {
                setTimeout(() => {
                    this.hp < 99 ? this.hp += 2 : this.hp = 100
                    n == 4 && (this.flag.heal = true)
                }, n * 1000)
            }
        },
        img: [
            new Image,
            new Image,
            new Image,
            new Image
            ],
        speed: 9,
        status: 3, //0:being attacked，1：attacked，2：moveing，3：standby
        init: function () {
            this.img.forEach((iteam, key) => {
                iteam.src = `./img/Hero${key}.png`
            })
        },
        move: function (control) {
            if (this.status > 1) {
                let _x = (control.a + control.d),
                    _y = (control.w + control.s)
                if (_x || _y) {
                    let _dist = this.speed,
                        x, y
                    if (_x && _y) {
                        _dist /= 1.41 //根号2
                    }
                    x = _dist * _x
                    y = _dist * _y
                    this.status = 2
                    this.flag.move = new Date
                    this.coords[0] += (this.coords[0] + x > window.main.width - 64) || (this.coords[0] + x <
                        0) ? 0 : x
                    this.coords[1] += (this.coords[1] + y > window.main.height - 64) || (this.coords[1] + y <
                        0) ? 0  : y
                    console.log("Hero", _dist, x, y, this.coords[0], this.coords[1])
                } else {
                    this.status = 3
                }
            }
        },
        attack: function () {
            // this.onmove = false
            if (new Date() - this.flag.attack > this.cd) {
                this.flag.attack = new Date()
                this.status = 1
                clearTimeout(this.attacked) //防抖
                this.attacked = setTimeout(() => this.status = 3, 500) //攻击状态持续500
                renderlist.forEach(v => {
                    let x = (v.coords[0] - Hero.coords[0]) ** 2,
                        y = (v.coords[1] - Hero.coords[1]) ** 2,
                        result = Math.sqrt(x + y).toFixed(2),
                        _hp = v.hp - Hero.atk
                    if (result < 70 && result > 0) {
                        if (_hp > 0) {
                            v.hp = _hp
                            clearTimeout(v.been_attacked) //防抖
                            v.been_attacked = setTimeout(() => {
                                v.status = 3
                            }, 800) //挨打状态持续800
                        } else {
                            clearTimeout(v.been_attacked)
                            v.hp = 0
                        }
                        v.status = 0
                    }
                })
            } else {
                this.move(key)
            }
        },
        action: function (time) {
            if (this.status > 1) {
                if (key.k) {
                    this.attack(time)
                } else {
                    this.move(key, time)
                }
            } else {
                if (this.status == 0) {
                    return
                }
            }
        }
    }

function Monster(_) {
    this.hp = _.hp
    this.speed = _.speed
    this.atk = _.atk
    this.def = _.def
    this.cd = _.cd //2000
    this.date = new Date
    this.flag = {
        move: "",
        attack: "",
        stanby: new Date,
        status:[0,0,0,0]
    }
    this.status = 3, //0:died，1：attacked，2：moveing，3：standby,4: init
        this.coords = [Math.random().toFixed(2) * (window.main.width - 64), Math.random().toFixed(2) * (window.main
            .height - 64)],
        this.space = function () {
            let now = new Date(),
                _symbol = this.coords[0] < Hero.coords[0] ? 1 : -1,
                _temp = Math.sqrt(this.coords[0] ** 2 + this.coords[1] ** 2).toFixed(2),
                _dist = this.speed * (now - this.date)
            return _symbol * (Hero.coords[0] - this.coords[0])
        }

    this.attack = function () {
        let x = (Hero.coords[0] - this.coords[0]) ** 2,
            y = (Hero.coords[1] - this.coords[1]) ** 2
        if (this.status == 2) {
            if (Math.sqrt(x + y).toFixed(2) < 65) {
                this.status = 1
                this.flag.attack = new Date
                Hero.status = 0
                Hero.hp -= this.atk
                console.log("HP:", Hero.hp)
                if (Hero.hp <= 0) {
                    setTimeout(stop, 0)
                    return
                }
                setTimeout(() => {
                    this.status = 2
                    Hero.status = 3
                }, 500)
            }
        }

        // if ((now - this.date) / 2 % 2 < 1) {}
        //move or attack
    }

    this.action = function () {
        if (this.status > 1) {
            if (this.status == 3 && new Date() - this.flag.stanby > 2000) {
                this.flag.move = new Date
                this.status = 2
                setTimeout(() => {
                    if (this.status > 0) {
                        this.status = 3
                        this.flag.stanby = new Date
                    }
                }, 2000)
            }
            if (this.status == 2) {
                let _x = Hero.coords[0] - this.coords[0],
                    _y = Hero.coords[1] - this.coords[1],
                    _temp = Math.sqrt(_x ** 2 + _y ** 2).toFixed(2)
                if (_temp > 60 || new Date - this.flag.attack < 800) {
                    let x = ~~(this.speed / _temp * _x),
                        y = ~~(this.speed / _temp * _y)
                    console.log("monster", x, y)
                    this.coords[0] += x
                    this.coords[1] += y
                } else {
                    this.attack()
                }
            }
        }
    }

    this.init=function () {
        this.coords = [
            Math.random().toFixed(2) * (window.main.width - 64),
            Math.random().toFixed(2) * (window.main.height - 64)
        ]
        //duang!
        this.status = 4
    }
    this.statuscontrol=function(_status){   //  eidt
        switch(_status){
            case 0: 
                this.flag.status[_status]=new Date
                this.status=_status
                if(this.hp){
                    setTimeout(()=>this.statuscontrol(1),800)
                }
                return
            case 1:
            
        }
    }
    this._action = function () {
        let now = new Date()
        if (this.status == 2) {
            if ((now - this.date) / 2 % 2 < 1) {
                //move or attack
                dist()
            } else {
                //cd
                this.status = 0
                setTimeout(() => {
                    this.status = 0
                }, this.cd - this.now + this.date)
            }
        }
    }
    this.img = [
        new Image,
        new Image,
        new Image,
        new Image,
        new Image
    ]
    this.img.forEach((v, i) => v.src = `${_.src}${i}.png`)
    return this
}

document.addEventListener("keydown", function (e) {
    console.log(e.keyCode)
    switch (e.keyCode) {
        case 87:
            {
                key.w = -1
                break
            }
        case 65:
            {
                key.a = -1
                break
            }
        case 83:
            {
                key.s = 1
                break
            }
        case 68:
            {
                key.d = 1
                break
            }
        case 49: //1
            {
                Hero.flag.heal && Hero.heal()
                break
            }
        case 75: //k
            {
                key.k = 1
                break
            }
    }
})

document.addEventListener("keyup", function (e) {
    switch (e.keyCode) {
        case 87:
            {
                key.w = 0
                break
            }
        case 65:
            {
                key.a = 0
                break
            }
        case 83:
            {
                key.s = 0
                break
            }
        case 68:
            {
                key.d = 0
                break
            }
        case 75: //k
            {
                key.k = 0
                break
            }
    }
    //console.log(e.keyCode)
})

function main_refresh() {
    cancelAnimationFrame(start) //——_—— 防止多次requestAnimationFrame
    let _date = new Date
    ctx.clearRect(0, 0, window.main.width, window.main.height)
    //ctx.drawImage(Hero.img[Hero.status], Hero.coords[0], Hero.coords[1])
    // renderlist.sort((a, b) => a.coords[1] - b.coords[1]) //排序
    for (const a of renderlist) {
        a.action(_date)
        ctx.drawImage(a.img[a.status], ~~(a.coords[0]), ~~(a.coords[1]))
        ctx.fillText(a.hp, ~~(a.coords[0]) + 28, ~~(a.coords[1]) - 10)
    }
    ctx.beginPath()
    ctx.arc(Hero.coords[0] + 32, Hero.coords[1] + 32, 35, 0, 6.2832)
    ctx.stroke()
    start = requestAnimationFrame(main_refresh)
}

function stop() {
    cancelAnimationFrame(start)
    if (Hero.hp < 10) {
        let over = confirm("GameOver")
        if (over) {
            location.reload()
        }
    }
}

window.onload = function () {
    let slime = {
        hp: 30,
        speed: 2,
        atk: 10,
        def: 0,
        cd: 2000,
        src: "./img/slime"
    }
    Hero.init() //初始化英雄
    // monster.init() //初始化怪物
    renderlist = Array.apply(0, { //初始化渲染列表
        length: 10
    }).map(() => new Monster(slime))
    renderlist.push(Hero)
    start = requestAnimationFrame(main_refresh) //启动画布
}