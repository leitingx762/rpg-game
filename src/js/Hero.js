var localStorage = window.localStorage || null
const key = {
        w: 0,
        a: 0,
        s: 0,
        d: 0,
        k: 0
    },
    Hero = {
        atk: 10,
        cd: 500,
        x: document.documentElement.clientWidth / 2 - 32,
        y: document.documentElement.clientHeight / 2 - 32,
        date: new Date,
        direction: 1,
        def: 2,
        $hp: 100,
        hp: 100,
        weapon: null,
        armor: null,
        medication: 10,
        money: 0,
        flag: {
            move: "",
            attack: "",
            heal: true,
            status: [0, 0, 0, 0, 0]
        },
        img: [new Image, new Image, new Image, new Image],
        _img: {
            flag: ""
        },
        rng: 100,
        speed: 9,
        state: "standby", //-1:init, 0:hurt，1：attacked，2：moving，3：standby
        time: {
            attack: 600,
            hurt: 500
        },
        heal() { //  hp+2/s,cd 5s
            //  hp+2/s,cd 5s
            if (!this.medication) {
                return Massage("没药了!")
            }
            if (this.hp >= 100) {
                return Massage("HP是满的!")
            }
            this.flag.heal = false
            this.medication -= 1
            sel(".top-bar div:nth-child(2)").innerText = `血瓶:${Hero.medication}`
            for (let n = 0; n < 5; n++) {
                setTimeout(she => {
                    she.hp < 99 ? (she.hp += 2) : (she.hp = 100)
                    n === 4 && (she.flag.heal = true)
                }, n * 1000, this)
            }
        },
        init() {
            changeStatus(this, "standby")
            this.x = document.documentElement.clientWidth / 2 - 32
            this.y = document.documentElement.clientHeight / 2 - 32
            this.load()
            //   this.img.forEach((item, key) => {
            //     item.src = `./img/Hero${key}.png`
            //   })
            this._img.src = loadImg("hero")
        },
        move(control) {
            if (this.state === "move" || this.state === "standby") {
                let _x = control.d - control.a,
                    _y = control.s - control.w
                if (!_x && !_y) {
                    return changeStatus(this, "standby")
                }
                let _speed = this.speed
                if (_x) {
                    this.direction = _x
                    this._img.flag = this._img.flag || this.date
                    if (_y) {
                        _speed /= 1.41
                    }
                } else {
                    this._img.flag = ""
                }
                const x = _speed * _x,
                    y = _speed * _y
                changeStatus(this, "move")
                this.x += this.x + x > main.width - 90 || this.x + x < 0 ? 0 : x
                this.y += this.y + y > main.height - 128 || this.y + y < 128 ? 0 : y
                //console.log("Hero", _speed, x, y, this.x, this.y)
                if (Math.sqrt((this.x - portal.x - 100) ** 2 + (this.y - portal.y - 46) ** 2) < 60) { //传送
                    this.save("自动保存~")
                    if (renderQueue.length > 2) { //回城
                        return window.onload("city")
                    }
                    window.onload("dungeon") //副本
                }
            }
            console.log(this._img.flag)
        },
        attack() {
            const _this = this
            // this.onmove = false
            if (this.date - this.flag.attack > this.cd) {
                changeStatus(this, "attack")
                // clearTimeout(this.attacked) //防抖
                changeStatus(this, "standby", this.cd)
                // this.attacked = setTimeout(
                //     () => (this.state = "standby"),
                //     this.cd
                // ) //攻击状态持续500
                renderQueue.forEach((v, i) => {
                    if (i == 0) { //跳过自己
                        return
                    }
                    if (v.state !== "init" && v.hp > 0) { //跳过init和died的怪
                        const _x = this.direction * (v.x - this.x - 15 * (1 + this.direction))
                        if (_x < 0 || _x > this.rng) {
                            return
                        }
                        const _y = v.y - this.y - 10
                        if (_y < 0 || _y > this.rng - 35) {
                            return
                        }
                        changeStatus(v, "hurt")
                        const _hp = v.hp - this.atk + v.def
                        if (_hp > 0) {
                            v.hp = _hp
                            changeStatus(v, "move", v.time.move)
                            // clearTimeout(v.been_attacked) //防抖
                            // v.been_attacked = setTimeout(() => {
                            //     v.state = "move"
                            //     v.flag.move = new Date()
                            // }, 800) //挨打状态持续800
                        } else {
                            // clearTimeout(v.been_attacked)
                            v.hp = 0
                            this.money += 10
                            setTimeout(she => {
                                she.init()
                            }, v.time.init, v)
                        }
                        v.state = "hurt"
                    }
                })
            } else {
                this.move(key)
            }
        },
        action() {
            this.date = new Date()
            if (this.state === "standby" || this.state === "move") {
                if (key.k) {
                    this.attack()
                } else {
                    this.move(key)
                }
            }
            if (this.state === "move") {
                const x = ~~(((this.date - this._img.flag) / 50) % 10)
                this._img.sx = 1311 + this.direction * 69 * (1 + 2 * x)
                // console.log(this.direction,this._img.sx,x)
            } else {
                this._img.sx = 1311 + this.direction * 69
            }
            this._img.sy = state[this.state] * 128
        },
        load(msg) {
            if (window.localStorage && localStorage.hero) {
                let hero = JSON.parse(localStorage.hero)
                for (let i in hero) {
                    this[i] = hero[i]
                }
                Massage(msg)
            } else {
                Massage("暂未存档或此浏览器不支持存档功能。")
            }
        },
        save(msg) {
            if (window.localStorage) {
                let hero = {
                    atk: this.atk,
                    cd: this.cd,
                    def: this.def,
                    hp: this.hp,
                    weapon: this.weapon,
                    armor: this.armor,
                    medication: this.medication,
                    money: this.money
                }
                Massage(msg)
                return localStorage.hero = JSON.stringify(hero)
            }
            return Massage("此浏览器不支持存档功能。")
        }
    }
document.addEventListener("keydown", function (e) {
    console.log(e.key)
    if (e.key == "1") {
        runing && Hero.flag.heal && Hero.heal()
        return
    }
    key[e.key] = 1
})

document.addEventListener("keyup", function (e) {
    key[e.key] = 0
})