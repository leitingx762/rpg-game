function Monster(_) {
    Object.assign(this, _)
    this.date = new Date
    this.flag = {
        init: 0,
        hurt: 0,
        standby: 0,
        move: 0,
        attack: 0,
    }
    this.state = "init" //-1:init, 0:hurt，1：attacked，2：moveing，3：standby,
    this.x = Math.random().toFixed(2) * (main.width - 64)
    this.y = Math.random().toFixed(2) * (main.height - 64)
    return this
}
Monster.prototype = {
    space() {
        let now = new Date(),
            _symbol = this.x < renderQueue[0].x ? 1 : -1,
            _temp = Math.sqrt(this.x ** 2 + this.y ** 2).toFixed(2),
            _dist = this.speed * (now - this.date)
        return _symbol * (renderQueue[0].x - this.x)
    },
    attack() {
        const hero = renderQueue[0]
        if (this.state === "move") {
            let _x = (hero.x - this.x) ** 2,
                _y = (hero.y - this.y) ** 2
            if (Math.sqrt(_x + _y).toFixed(2) < 65) {
                changeStatus(this, "attack")
                changeStatus(hero, "hurt")
                hero.hp -= this.atk - hero.def
                if (hero.hp <= 0) {
                    hero.hp = 0
                    return window.stop()
                }
                changeStatus(this, "move", 500)
                changeStatus(hero, "move", 500)

            }
        }

        // if ((now - this.date) / 2 % 2 < 1) {}
        //move or attack
    },
    action() {
        if (
            this.state === "standby" &&
            new Date - this.flag["standby"] > 2000
        ) {
            changeStatus(this, "move")
            setTimeout(() => {
                if (this.state !== "hurt" || "init") {
                    changeStatus(this, "standby")
                }
            }, 2000)
        }
        if (this.state === "move") {
            if (new Date - this.flag["move"] > 2000) {
                changeStatus(this, "standby")
            }
            let _x = renderQueue[0].x - this.x,
                _y = renderQueue[0].y - this.y,
                _temp = Math.sqrt(_x ** 2 + _y ** 2).toFixed(2)
            if (_temp > 60 || new Date() - this.flag["attack"] < 800) {
                let x = ~~((this.speed / _temp) * _x),
                    y = ~~((this.speed / _temp) * _y)
                // log("monster", x, y)
                this.x += x
                this.y += y
            } else {
                this.attack()
            }
        }
    },

    init() {
        this.x = +Math.random().toFixed(2) * (document.querySelector("#maincanvas").width - 64)
        this.y = +Math.random().toFixed(2) * (document.querySelector("#maincanvas").height - 64)
        this.hp = this.$hp
        //duang!
        changeStatus(this, "init")
        changeStatus(this, "move", 3000)
        return this
    }
}