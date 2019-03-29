const offsetX = 138,
    offsetY = 128,
    main = document.querySelector("#maincanvas"),
    mainctx = main.getContext("2d"),
    back = document.querySelector("#backcanvas"),
    backctx = back.getContext("2d"),
    state = {
        hurt: 0,
        attack: 1,
        move: 2,
        standby: 3,
        init: 4
    },
    portal = {
        x: document.documentElement.clientWidth - 166,
        y: document.documentElement.clientHeight - 138
    },
    sel = (Selector) => {
        const list = document.querySelectorAll(Selector)
        return list.length === 1 ? list[0] : list
    },
    Massage = (msg) => {

        if (msg) {
            let ele = sel(".massage"),
                date = new Date
            ele.classList.remove("msg")
            sel(".massage p").innerHTML += `<br>${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} - ${msg}`
            setTimeout(() => ele.classList.add("msg"), 0)
        }
    },
    changeStatus = (target, _state, time) => {
        //状态控制器
        clearTimeout(target.flag.change)
        const change = () => {
            target.state = _state
            target.flag[_state] = new Date
        }
        if (time) {
            target.flag.change = setTimeout(change, time)
        } else {
            change()
        }
    },
    modal = {
        menu(close) {
            if (!close) {
                return sel(".menu").classList.add("hide")
            }
            sel(".menu").classList.remove("hide")
        },

        confirm(close, title, content, fn1, fn2) {
            if (!fn2) {
                fn2 = () => {
                    modal.confirm(false)
                    modal.menu(true)
                }
            }
            if (!close) {
                return sel(".confirm").classList.add("hide")
            }
            sel(".confirm>.title").innerText = title
            sel(".confirm pre").innerText = content
            sel(".confirm .btn")[0].onclick = fn1
            sel(".confirm .btn")[1].onclick = fn2
            sel(".confirm").classList.remove("hide")
        },

        msg(close, content) {
            if (!close) {
                return sel(".modal .msg").classList.add("hide")
            }
            sel(".modal .msg p").innerText = content
            sel(".modal .msg").classList.remove("hide")
        },

        open() {
            sel(".modal").classList.remove("hide")
        },

        close() {
            sel(".modal").classList.add("hide")
        }
    },
    uploading = val => {
        progress += val
        sel(".mask span")[0].innerText = progress
        if (progress >= 100) {
            // runing = 1
            progress = 40
        }
    },
    loadImg = name => {
        return new Promise((ok, err) => {
            const img = new Image,
                canvas = document.createElement("canvas"),
                ctx = canvas.getContext("2d")
            img.onload = () => {
                canvas.width = img.width * 2
                canvas.height = img.height * 2
                ctx.drawImage(img, img.width, 0)
                ctx.scale(-1, 1)
                ctx.drawImage(img, -img.width, 0)
                ctx.scale(-1, 1)
                uploading(10)
                ok(canvas)
            }
            img.onerror = msg => err(msg)
            img.src = `./img/${name}.png`
        }).catch(msg => window.console.error("LoadImage", msg))
    },
    loadBack = (name) => {
        return new Promise((ok, err) => {
            const img = new Image()
            img.onload = () => {
                uploading(10)
                ok(img)
            }
            img.onerror = e => err(e)
            img.src = `./img/${name}.png`
        }).catch(msg => window.console.error("LoadBackground", msg))
    }

let runing = 0,
    progress = 10,
    renderQueue = []