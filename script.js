// Flappy Bird Game Script
// Controls all game logic, media, score, and animation

let move_speed = 3, grativy = 0.5;// Pipe movement speed and gravity factor

// DOM elements for the bird and game UI
let bird = document.querySelector('.bird');
let img = document.getElementById('bird-1');

// Sound effects for game actions
let sound_point = new Audio('sounds effect/point.wav');
let sound_die = new Audio('sounds effect/die.mp3');
let bg_music = new Audio('sounds effect/background music.mp3'); // Looping background music
bg_music.loop = true;
bg_music.volume = 0.22;
window.addEventListener('load', function() {
    bg_music.play().catch(() => {
        // For browsers that block autoplay, play on first click/keydown.
        const enableMusic = () => {
            bg_music.play();
            window.removeEventListener('click', enableMusic);
            window.removeEventListener('keydown', enableMusic);
        };
        window.addEventListener('click', enableMusic);
        window.addEventListener('keydown', enableMusic);
    });
});
// Get bird and background dimensions
let bird_props = bird.getBoundingClientRect();
let background = document.querySelector('.background').getBoundingClientRect();
// UI elements for scoring and messages
let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');

// The state: Start, Play, or End
let game_state = 'Start';
img.style.display = 'none'; // Hide bird at intro
message.classList.add('messageStyle'); // Show intro message
message.style.display = 'block'; // Show card at intro

document.addEventListener('keydown', (e) => {
    // Start game on Enter when in Start/End
    if(e.key == 'Enter' && game_state != 'Play'){
        document.querySelectorAll('.pipe_sprite').forEach((e) => {
            e.remove(); // Remove all pipes
        });
        img.style.display = 'block'; // Show bird image
        bird.style.top = '40vh';
        game_state = 'Play';
        message.style.display = 'none'; // HIDE message card during play
        score_title.innerHTML = 'Score : ';
        score_val.innerHTML = '0';
        message.classList.remove('messageStyle');
        play();
    }
});

// Main game loop and pipe logic
function play(){
    // Repeatedly move pipes and check for collisions
    function move(){
        if(game_state != 'Play') return;
        let pipe_sprite = document.querySelectorAll('.pipe_sprite');
        pipe_sprite.forEach((element) => {
            let pipe_sprite_props = element.getBoundingClientRect();
            bird_props = bird.getBoundingClientRect();
            // If pipe leaves screen, remove it
            if(pipe_sprite_props.right <= 0){
                element.remove();
            }else{
                // COLLISION DETECTION
                // If the bird hits a pipe
                if(bird_props.left < pipe_sprite_props.left + pipe_sprite_props.width && bird_props.left + bird_props.width > pipe_sprite_props.left && bird_props.top < pipe_sprite_props.top + pipe_sprite_props.height && bird_props.top + bird_props.height > pipe_sprite_props.top){
                    game_state = 'End';
                    message.innerHTML = 'Game Over'.fontcolor('red') + '<br>Press ENTER To Replay';
                    message.classList.add('messageStyle');
                    img.style.display = 'none';
                    sound_die.play();
                    message.style.display = 'block'; // SHOW message card on game over
                    return;
                }else{
                    // If pipe passes bird safely, increment score
                    if(pipe_sprite_props.right < bird_props.left && pipe_sprite_props.right + move_speed >= bird_props.left && element.increase_score == '1'){
                        score_val.innerHTML =+ score_val.innerHTML + 1;
                        sound_point.play();
                    }
                    // Move pipe left
                    element.style.left = pipe_sprite_props.left - move_speed + 'px';
                }
            }
        });
        requestAnimationFrame(move);
    }
    requestAnimationFrame(move);

    // Apply gravity and jump to the bird
    let bird_dy = 0;
    function apply_gravity(){
        if(game_state != 'Play') return;
        bird_dy = bird_dy + grativy;

        // User input: Up Arrow or Space makes bird jump
        document.addEventListener('keydown', (e) => {
            if(e.key == 'ArrowUp' || e.key == ' '){
                img.src = 'images/Bird-2.png'; // Bird flaps
                bird_dy = -7.6;
            }
        });
        document.addEventListener('keyup', (e) => {
            if(e.key == 'ArrowUp' || e.key == ' '){
                img.src = 'images/Bird.png'; // Bird falls
            }
        });
        // If bird leaves bounds (top or bottom), trigger game over
        if(bird_props.top <= 0 || bird_props.bottom >= background.bottom){
            game_state = 'End';
            message.style.left = '28vw';
            window.location.reload();
            message.classList.remove('messageStyle');
            message.style.display = 'block'; // Show message card again if needed
            return;
        }
        // Move bird by physics
        bird.style.top = bird_props.top + bird_dy + 'px';
        bird_props = bird.getBoundingClientRect();
        requestAnimationFrame(apply_gravity);
    }
    requestAnimationFrame(apply_gravity);

    // Pipe generation logic (top, bottom)
    let pipe_seperation = 0;
    let pipe_gap = 35;
    function create_pipe(){
        if(game_state != 'Play') return;
        // Only create new pipes every X frames
        if(pipe_seperation > 115){
            pipe_seperation = 0;
            let pipe_posi = Math.floor(Math.random() * 43) + 8;
            let pipe_sprite_inv = document.createElement('div');
            pipe_sprite_inv.className = 'pipe_sprite';
            pipe_sprite_inv.style.top = pipe_posi - 70 + 'vh'; // Top pipe
            pipe_sprite_inv.style.left = '100vw';
            document.body.appendChild(pipe_sprite_inv);

            let pipe_sprite = document.createElement('div');
            pipe_sprite.className = 'pipe_sprite';
            pipe_sprite.style.top = pipe_posi + pipe_gap + 'vh'; // Bottom pipe
            pipe_sprite.style.left = '100vw';
            pipe_sprite.increase_score = '1';
            document.body.appendChild(pipe_sprite);
        }
        pipe_seperation++;
        requestAnimationFrame(create_pipe);
    }
    requestAnimationFrame(create_pipe);
}
