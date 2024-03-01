var panel = document.getElementById("game_panel");
var ctx = panel.getContext("2d");
var panel_rect = new DOMRect(0, 0, panel.width, panel.height);
var ctx_rect = panel.getBoundingClientRect();


class Pile{
    constructor(x, y, bg){
        this.bg = bg;
        this.img_up = new Image();
        this.img_up.src = './materials/pile_up.png';
        this.img_down = new Image();
        this.img_down.src = './materials/pile_down.png';
        this.width = this.img_down.width * panel.height / this.img_down.height;
        this.gap = panel.height / 3;
        this.x = x;
        this.y = y;
    }

    show(){
        ctx.drawImage(this.img_up, this.x + this.bg.x, panel.height - this.y, this.width, panel.height);
        ctx.drawImage(this.img_down, this.x + this.bg.x, panel.height - this.y - this.gap - panel.height, this.width, panel.height);
    }

    up_rect(){
        return new DOMRect(this.x + this.bg.x, panel.height - this.y, this.width, panel.height);
    }

    down_rect(){
        return new DOMRect(this.x + this.bg.x, panel.height - this.y - this.gap - panel.height, this.width, panel.height);
    }
}

class Bg{
    constructor(x, main_loop){
        this.main_loop = main_loop;
        this.img = new Image;
        this.img.src = './materials/bg.png';
        this.x = x;
        this.out = false;
        this.pile = [];
        this.gap = panel.height / 3;
        var start_x = panel.width / 8;
        for(let i = 0; i < 4; i++){
            this.pile.push(new Pile(start_x + i * 2 * start_x, Math.random() * (panel.height - this.gap), this));
        }
    }

    move(){
        if(this.main_loop.run == true){
            this.x -= panel.width / 500;
        }
    }

    show(){
        ctx.drawImage(this.img, this.x, 0, panel.width, panel.height);
        for(var pile of this.pile){
            pile.show();
        }
    }

    check(){
        if(this.x < - panel.width)
            this.main_loop.is_pop = true;
        if(this.x < 0 && this.out == false){
            this.out = true;
            this.main_loop.background.push(new Bg(panel.width, this.main_loop));
        }
            
    }

    operation(){
        this.move();
        this.check();
        this.show();
    }
}


function coll_check(box1, box2){
    if (((box1.left <= box2.left) && (box2.left <= box1.right)) || ((box1.left <= box2.right) && (box2.right <= box1.right))){
        if (((box1.top <= box2.top) && (box2.top <= box1.bottom)) || ((box1.top <= box2.bottom) && (box2.bottom <= box1.bottom)))
            return true
        else{
            var tmp1 = box1, tmp2 = box2;
            box1 = tmp2;
            box2 = tmp1;
            if (((box1.top <= box2.top) && (box2.top <= box1.bottom)) || ((box1.top <= box2.bottom) && (box2.bottom <= box1.bottom)))
                return true
        }
    }
        
    var tmp1 = box1, tmp2 = box2;
    box1 = tmp2;
    box2 = tmp1;
    if (((box1.left <= box2.left) && (box2.left <= box1.right)) || ((box1.left <= box2.right) && (box2.right <= box1.right))){
        if (((box1.top <= box2.top) && (box2.top <= box1.bottom)) || ((box1.top <= box2.bottom) && (box2.bottom <= box1.bottom)))
            return true   
        else{
            var tmp1 = box1, tmp2 = box2;
            box1 = tmp2;
            box2 = tmp1;
            if (((box1.top <= box2.top) && (box2.top <= box1.bottom)) || ((box1.top <= box2.bottom) && (box2.bottom <= box1.bottom)))
                return true
        }
    }
}


class Character{
    constructor(main_loop){
        this.main_loop = main_loop;
        this.img = new Image();
        this.img.src = './materials/char.png';
        this.img_jump = new Image();
        this.img_jump.src = './materials/char_jump.png';
        this.x = panel.width / 6;
        this.y = panel.height / 2;
        this.state = "falling";
        this.cur_img = this.img;
        this.cur_pile = "none";
        this.score = 0;
        this.jumping_start;
 
    }
    show(){
        // var width = panel.width / 10;
        // var height = this.img.height * panel.width / (10 * this.img.width);
        // ctx.fillRect(this.x + 25 * width/ this.img.width, panel.height - this.y + 13 * height/ this.img.height, 13 * height/ this.img.height , 48 * width/ this.img.width);
        ctx.drawImage(this.cur_img, this.x, panel.height - this.y, panel.width / 10 ,this.img.height * panel.width / (10 * this.img.width));
    }

    move(){
        if(this.main_loop.run == true){
            if(this.state == "falling"){
                this.cur_img = this.img;
                this.y -= panel.height / 300;
            }
            else if(this.state == "jumping"){
                this.cur_img = this.img_jump;
                this.y += panel.height / 250;
                var curr_time = new Date();
                if(curr_time - this.jumping_start >= 100)
                    this.state = "falling";
            }
        }
    }

    check(){
        
        if(coll_check(this.rect(), panel_rect) != true)
            this.game_over();

        if(this.cur_pile == "none"){
            for(let bg of this.main_loop.background){
                if(bg.x + panel.width >= this.rect().left)
                    for(let pile of bg.pile){
                        if (pile.up_rect().right >= this.rect().left){
                            this.cur_pile = pile;
                            break;
                        }
                    }
                if(this.cur_pile != "none")
                    break;
            }
        }

        if(this.cur_pile != "none"){
            if (this.cur_pile.up_rect().right >= this.rect().left){
                if(coll_check(this.rect(), this.cur_pile.up_rect()) == true || coll_check(this.rect(), this.cur_pile.down_rect()) == true)
                    this.game_over();                
            }
    
            else{
                this.cur_pile = "none";
                this.score += 1;
            }
        }
        
    }


    game_over(){
        this.main_loop.stop();
    }
    
    rect(){
        // 25 13 13 48
        var width = panel.width / 10;
        var height = this.img.height * panel.width / (10 * this.img.width);
        return new DOMRect(this.x + 25 * width/ this.img.width, panel.height - this.y + 13 * height/ this.img.height, 13 * height/ this.img.height , 48 * width/ this.img.width);
    }

    operation(){
        this.move();
        this.check();
        this.show();
    }
}

function main_loop_event_handler(key){
    if(key.keyCode == 32){
        key.preventDefault();
        process.main_loop.character.state = "jumping";
        process.main_loop.character.jumping_start = new Date();
    }
}

function main_loop_process(){
    for(var bg of process.main_loop.background){
        bg.operation();
    }

    if(process.main_loop.is_pop){
        process.main_loop.is_pop = false;
        process.main_loop.background.shift();
    }
    process.main_loop.character.operation();
}


class Main_loop{
    constructor(){
        var start_bg = new Bg(0, this);
        start_bg.pile = [];
        this.background = [start_bg];
        this.is_pop = false;
        this.character = new Character(this);
        this.run = true;
        document.addEventListener("keydown", key => main_loop_event_handler(key));


        this.process = setInterval(main_loop_process, 10);
    }

    stop(){
        this.run = false;
        document.removeEventListener("keydown", key => main_loop_event_handler(key));
        process.post_game();
    }

    clear(){
        console.log("clear");
        clearInterval(process.main_loop.process);
    }


}

function preloop_process(){
    for(var bg of process.preloop.background){
        bg.pile = [];
        bg.operation();
    }

    if(process.preloop.is_pop){
        process.preloop.is_pop = false;
        process.preloop.background.shift();
    }
    ctx.drawImage(process.preloop.title, panel.width / 2 - (panel.width / 2) / 2, (panel.height / 2) - (process.preloop.title.height * (panel.width / 2) / process.preloop.title.width) / 2, (panel.width / 2), process.preloop.title.height * (panel.width / 2) / process.preloop.title.width);
    ctx.fillStyle = "black";
    ctx.font = "bold 50px Verdana";
    ctx.textAlign = 'center';
    ctx.fillText("Tap To Play", (panel.width / 2), (panel.height / 2) + panel.height / 6);

}

function preloop_clear(){
    document.removeEventListener("mousedown", preloop_clear);
    clearInterval(process.preloop.process);
    process.main_game();
}
class Preloop{
    constructor(){
        var start_bg = new Bg(0, this);
        start_bg.pile = [];
        this.background = [start_bg];
        this.title = new Image();
        this.title.src = './materials/title.png';
        this.is_pop = false;
        this.run = true;

        document.addEventListener("mousedown", preloop_clear);

        this.process = setInterval(preloop_process, 10);
    }

}

function postloop_event_handler(mouse){
    if(process.postloop.mouse_track){
        process.postloop.mouse_track = false;   
        console.log("vpa");
        var mouse_rect = new DOMRect(mouse.clientX - ctx_rect.left, mouse.clientY - ctx_rect.top, 1, 1);
        if(coll_check(mouse_rect, process.postloop.home_btn_rect()) == true){
            process.main_loop.clear();
            process.postloop.clear();
            process.pre_game();

        }
        
        if(coll_check(mouse_rect, process.postloop.replay_btn_rect()) == true){
            process.postloop.clear();
            process.main_loop.clear();
            process.main_game();
        }
    }

}

class Postloop{
    constructor(){
        this.panel = new Image();
        this.panel.src = './materials/post_game_panel.png';
        this.home_btn = new Image();
        this.home_btn.src = './materials/home_icon.png';
        this.replay_btn = new Image();
        this.replay_btn.src = './materials/replay_icon.png';
        this.mouse_track = true;
        document.addEventListener("mousedown", mouse => postloop_event_handler(mouse));
        this.run();
    }

    panel_show(){
        ctx.drawImage(this.panel, panel.width / 2 - (panel.width / 2) / 2, panel.height / 2 - (this.panel.height * (panel.width / 2) / this.panel.width) / 2, panel.width / 2, this.panel.height * (panel.width / 2) / this.panel.width);
    
        ctx.fillStyle = "black";
        ctx.font = "bold 50px Verdana";
        ctx.textAlign = 'center';
        // ctx.textBaseline = 'middle';
        ctx.fillText("Game Over", (panel.width / 2), (panel.height / 2) - (this.panel.height * (panel.width / 2) / this.panel.width) / 4);
        ctx.font = "bold 30px Verdana";
        var text = "Score : " + process.main_loop.character.score;
        ctx.fillText(text, (panel.width / 2), (panel.height / 2) - (this.panel.height * (panel.width / 2) / this.panel.width) / 10);
        ctx.drawImage(this.home_btn, panel.width / 2 - (panel.width / 2) / 2 + ((panel.width / 2) / 8), (panel.height / 2) - (this.panel.height * (panel.width / 2) / this.panel.width) / 14, (panel.width / 2) / 4, this.home_btn.height * ((panel.width / 2) / 4) / this.home_btn.width)
        ctx.drawImage(this.replay_btn, panel.width / 2 + ((panel.width / 2) / 8), (panel.height / 2) - (this.panel.height * (panel.width / 2) / this.panel.width) / 14, (panel.width / 2) / 4, this.replay_btn.height * ((panel.width / 2) / 4) / this.replay_btn.width)
        // ctx.fillRect(panel.width / 2 + ((panel.width / 2) / 8), (panel.height / 2) - (this.panel.height * (panel.width / 2) / this.panel.width) / 14, (panel.width / 2) / 4, this.replay_btn.height * ((panel.width / 2) / 4) / this.replay_btn.width);
    }

    home_btn_rect(){
        return new DOMRect(panel.width / 2 - (panel.width / 2) / 2 + ((panel.width / 2) / 8), (panel.height / 2) - (this.panel.height * (panel.width / 2) / this.panel.width) / 14, (panel.width / 2) / 4, this.home_btn.height * ((panel.width / 2) / 4) / this.home_btn.width);
    }


    replay_btn_rect(){
        return new DOMRect(panel.width / 2 + ((panel.width / 2) / 8), (panel.height / 2) - (this.panel.height * (panel.width / 2) / this.panel.width) / 14, (panel.width / 2) / 4, this.replay_btn.height * ((panel.width / 2) / 4) / this.replay_btn.width);
    }

    run(){
        this.panel_show();
    }   

    clear(){
        document.removeEventListener("mousedown", mouse => postloop_event_handler(mouse));
    }
    
}


class Process{
    constructor(){
        this.preloop = new Preloop();
    }

    pre_game(){
        this.preloop = new Preloop();
    }

    main_game(){
        this.main_loop = new Main_loop();
    }

    post_game(){
        this.postloop = new Postloop();
    }

}

var process = new Process();




















