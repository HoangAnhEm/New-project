var panel = document.getElementById("game_panel");
var ctx = panel.getContext("2d");

var box_width = Math.floor(panel.width / 30);
var box_height = Math.floor(panel.height / 20);

// class kb_event{
//     constructor(){
//         this.move = "none";
//         this.is_up = true;
//     }
// }

// let Event_inf = new kb_event();

var is_up = true;


class piece {
    constructor(){
        this.x, this.y;
    }
}

class snake {
    constructor(x , y){
        this.head = new piece();
        this.head.x = x;
        this.head.y = y;
        this.tail = new piece();
        this.tail.x = x;
        this.tail.y = y;
        this.dir = "right";
        this.pieces = [];
        this.alive = true;
    }

    show(){
        ctx.fillStyle = "red";
        for(let _peice of this.pieces){
            ctx.fillRect(_peice.x, _peice.y, box_width, box_height);
        }
        ctx.fillStyle = "blue";
        ctx.fillRect(this.head.x, this.head.y, box_width, box_height);
    }

    move(){
        if(this.pieces.length >= 1){
            let tmp = new piece();
            tmp.x = this.head.x;
            tmp.y = this.head.y;
            this.tail = this.pieces.pop()
            switch (Snake.dir) {
                case "right":
                    this.head.x += box_width;
                    break;
                case "left":
                    this.head.x -= box_width;
                    break;
                case "up":
                    this.head.y -= box_height;
                    break;
                case "down":
                    this.head.y += box_height;
                    break;
            }
            this.pieces.unshift(tmp);
        }

        else{
            this.tail.x = this.head.x;
            this.tail.y = this.head.y;

            switch (Snake.dir) {
                case "right":
                    this.head.x += box_width;
                    break;
                case "left":
                    this.head.x -= box_width;
                    break;
                case "up":
                    this.head.y -= box_height;
                    break;
                case "down":
                    this.head.y += box_height;
                    break;
                }

        }
    }


    collide_check(){
        if(this.head.x == Food.x){
            if(this.head.y == Food.y){
                this.eat();
            }
        }

        else if(this.head.x >= panel.width){
            this.head.x = 0;
        }
        else if(this.head.x < 0){
            this.head.x = panel.width - box_width;
        }
        else if(this.head.y >= panel.height){
            this.head.y = 0;
        }
        else if(this.head.y < 0){
            this.head.y = panel.height - box_height;
        }

        for(let _peice of this.pieces){
            if(this.head.x == _peice.x){
                if(this.head.y == _peice.y){
                    this.die();
                    break;
                }
            }
        }



    }

    die(){
        this.alive = false;
        clearInterval(game_loop);
        alert("You Lost!");
    }

    eat(){
        let tmp = new piece();
        tmp.x = this.tail.x;
        tmp.y = this.tail.y;

        this.pieces.push(tmp);

        Food.spawn();
    }

}

let Snake = new snake(0, 0);

class food{
    constructor(){
        this.x, this.y;
        this.spawn();
    }

    show(){
        ctx.fillStyle = "white";
        ctx.fillRect(this.x, this.y, box_width, box_height)
    }

    spawn(){
        this.x = Math.floor( Math.random() * 30 ) * box_width;
        this.y = Math.floor( Math.random() * 20) * box_height;

        for(let _peice of Snake.pieces){
            if(this.x == _peice.x && this.y == _peice.y){
                this.spawn();
            }
        }

    }

}

let Food = new food();

function key_down(keyCode){
    if(Snake.alive == true){
        switch (keyCode) {
            case 65:
                dir = "left";
                break;
            case 87:
                dir = "up";
                break;
            case 68:
                dir = "right";
                break;
            case 83:
                dir = "down";
            break;     

            default:
                dir = "none";
                break;

        }
        if(dir != Snake.dir && dir != "none"){
            clearInterval(game_loop);
            Snake.dir = dir;
            process();
            
            if(Snake.alive == true)
                game_loop = setInterval(process, 500);
        }
    }
}

document.addEventListener("keydown" , key =>{
    if (is_up == true){
        key_down(key.keyCode);
        is_up = false;
    }
            
})




function key_up(){
    is_up = true;
}

document.addEventListener("keyup" , key_up)

function process(){
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,panel.width, panel.height);
    
    Snake.move(Snake.dir);
    Snake.collide_check();
    Snake.show();

    Food.show();

    
}
var game_loop = setInterval(process, 500);


