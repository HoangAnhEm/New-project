var panel = document.getElementById("game_panel");
var ctx = panel.getContext("2d");
var panel_rect = panel.getBoundingClientRect();

var box_width = Math.floor(panel.width / 30);
var box_height = Math.floor(panel.height / 20);


var bg = new Image();
bg.src = './materials/bg.png';
var x_icon = new Image();
x_icon.src = './materials/x_icon.png';
var o_icon = new Image();
o_icon.src = './materials/o_icon.png';

var x = 0, y = 0;
var gap_x = 0, gap_y = 0;
var mo_x, mo_y;
var is_mou_up = true;

panel.addEventListener("mousedown", mouse => {
    if(runnin){
        if(mouse.which == 1){
            is_mou_up = false;
        }
        
        else if(mouse.which == 3){
            var box_x = Math.floor((mo_x - (x + gap_x) * scale) / ((panel.height) * scale / 18));
            var box_y = Math.floor((mo_y - (y + gap_y) * scale) / ((panel.height) * scale / 18));
            var tmp = new x_and_o(cur_type, box_x, box_y);
            
        }
        process();
    }
})

panel.addEventListener("contextmenu", rightclick =>{
    rightclick.preventDefault();
})

panel.addEventListener("mousemove", mouse => {
    if(runnin){
        panel_rect = panel.getBoundingClientRect();
        mo_x = mouse.clientX - panel_rect.left;
        mo_y = mouse.clientY - panel_rect.top;
        
        
        if(is_mou_up == false){
        gap_x = mouse.clientX - panel_rect.left - mo_x;
        gap_y = mouse.clientY - panel_rect.top - mo_y;
    }

    process();
    }
})



panel.addEventListener("mouseup", function(){
    is_mou_up = true;
    x += gap_x;
    y += gap_y;
    gap_x = gap_y = 0;
})

var scale = 2;


function mouse_scroll(event){
    event.preventDefault();
    if(scale >= 1 && scale <= 5){
        scale -= event.deltaY * 0.1 / 100;
        if(scale < 1 || scale > 5){
            scale += event.deltaY * 0.1 / 100;
        }
    }
    process();
}

panel.addEventListener("wheel", event => mouse_scroll(event));

class x_and_o{
    constructor(type, x, y){
        this.type = type;
        if(this.type == "x"){
            this.img = x_icon;
        }
        else{
            this.img = o_icon;
        }

        this.x = x; 
        this.y = y;

        if(arr_x_and_o[this.x][this.y] == undefined){
            arr_x_and_o[this.x][this.y] = this;
            if(cur_type == "x")
                cur_type = "o";
            else    
                cur_type = "x";
        }

        this.show();
        this.win_check();
        
    }

    show(){
        ctx.drawImage(this.img, (x + gap_x) * scale + (this.x) * (panel.height) * scale / 18,(y + gap_y) * scale + (this.y) * (panel.height) * scale / 18, (panel.height) * scale / 18, (panel.height) * scale / 18)
    }

    win_check(){
        function next(dir, start){
            switch (dir) {
                case "left":
                    var next_ = arr_x_and_o[start.x - 1][start.y];
                    break;
                case "right":
                    var next_ = arr_x_and_o[start.x + 1][start.y];
                    break;
                case "top":
                    var next_ = arr_x_and_o[start.x][start.y - 1];
                    break;                    
                case "bot":
                    var next_ = arr_x_and_o[start.x][start.y + 1];
                    break;   
                case "topleft":
                    var next_ = arr_x_and_o[start.x - 1][start.y - 1];
                    break;
                case "topright":
                    var next_ = arr_x_and_o[start.x + 1][start.y - 1];
                    break;
                case "botleft":
                    var next_ = arr_x_and_o[start.x - 1][start.y + 1];
                    break;                    
                case "botright":
                    var next_ = arr_x_and_o[start.x + 1][start.y + 1];
                    break;                               

            }
            if(next_ != undefined){
                if(next_.type == start.type){
                    return 1 + next(dir, next_);
                }
                else
                    return 0;
            }
            else
                return 0;
        }

        var dir1 = ["left", "top", "topleft", "topright"];
        var dir2 = ["right", "bot", "botright", "botleft"];

        for(let i = 0; i < 4; i++){
            if((next(dir1[i], this) + next(dir2[i], this)) == 4){
                if(cur_type == "x")
                    alert("O WIN");
                else
                    alert("X WIN");
                runnin = false;
                break;
            }
        }
    }
}

var arr_x_and_o = [];

for(let i = 0; i <= 18; i++){
    arr_x_and_o[i] = [];
}





var cur_type = "x";
var runnin = true;
function process(){
    if(runnin){
        ctx.fillStyle = "black";
        ctx.fillRect(0,0,panel.width,panel.height);
        ctx.drawImage(bg, (x + gap_x) * scale, (y + gap_y) * scale, (bg.width * panel.height / bg.width) * scale, (panel.height) * scale);
        for(let i = 0; i <= 18; i++){
            for(let tmp of arr_x_and_o[i]){
                if(tmp != undefined){
                    tmp.show();
                }
            }
        }
        
        var img;
        if(cur_type == "x")
        img = x_icon;
        else
        img = o_icon;

        ctx.drawImage(img, mo_x - (((panel.height) * scale / 18) / 2) , mo_y - (((panel.height) * scale / 18) / 2) , (panel.height) * scale / 18, (panel.height) * scale / 18)
    }

}


















































































