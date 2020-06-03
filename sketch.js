var trex,trex_running,trex_collided;
var ground,ground_image,invisible_ground
var cloud,cloud_image,cloud_group
var obstacle,ob1,ob2,ob3,ob4,ob5,ob6,ob_group
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var highScore = 0;
var x = 0;
var count=0
var restart,restart_image,gameOver,gameOver_image
var hit_sound,jump_sound,score_sound

function preload(){
  trex_running=loadAnimation("new0.png","new1.png","new2.png")
  trex_collided=loadAnimation("trex_collided.png")
  ground_image=loadImage("ground2.png")
  cloud_image=loadImage("cloud.png")
  ob1=loadImage("obstacle1.png")
  ob2=loadImage("obstacle2.png")
  ob3=loadImage("obstacle3.png")
  ob4=loadImage("obstacle4.png")
  ob5=loadImage("obstacle5.png")
  ob6=loadImage("obstacle6.png")
  restart_image=loadImage("restart.png")
  gameOver_image=loadImage("gameOver.png")
  hit_sound=loadSound("die.mp3")
  jump_sound=loadSound("jump.mp3")
  score_sound=loadSound("checkPoint.mp3")
  
}  
function setup() {  
  createCanvas(600, 200);
  trex=createSprite(50,160,20,50)
  trex.addAnimation("running",trex_running)
  trex.addAnimation("collided",trex_collided)
  trex.scale=0.5
  trex.setCollider("circle", 0, 0, 40);
  
  ground=createSprite(300,180,600,20)
  ground.addImage("moving",ground_image)
  ground.velocityX=-4
  invisible_ground=createSprite(300,190,600,20)
  invisible_ground.visible=false
  cloud_group=new Group()
  ob_group=new Group()
  
 gameOver = createSprite(300,50);
gameOver.scale = 0.5;
gameOver.addImage("gameOver",gameOver_image);
 restart = createSprite(300, 100);
restart.scale = 0.5;
restart.addImage("restart",restart_image);
}
function draw() {
  background(255);
  if(gameState === PLAY){
    gameOver.visible = false;
    restart.visible = false;
    if(keyDown("space")&&trex.y>150){
  trex.velocityY=-10
      jump_sound.play()
  }
  trex.velocityY=trex.velocityY+0.5
  if(ground.x<0){
  ground.x=600
  }
  spawnClouds()
  spawnObstacles()
 if (frameCount%5==0) {
      count=count+1;
      if (count%50===0 && count>0) {
        ground.velocityX=ground.velocityX-2
        score_sound.play()
      }
    }
    if (ob_group.isTouching(trex)) {
      gameState = END;
      hit_sound.play()
      
    }
  }
  else if((gameState === END)) {
    ground.velocityX = 0;
    trex.changeAnimation("collided",trex_collided)
    ob_group.setVelocityXEach(0);
    cloud_group.setVelocityXEach(0);
    ob_group.setLifetimeEach(-1);
    cloud_group.setLifetimeEach(-1);
    if (mousePressedOver(restart)) {
      reset();
    }
    gameOver.visible = true;
    restart.visible = true;
  
  }
  textSize(16)
   text("Score: "+ count, 470, 30);
  if (x==1) {
    text("High Score:"+highScore, 470, 50);
  }
   trex.collide(invisible_ground)
  drawSprites()
}
function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage("cloud",cloud_image);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 234;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloud_group.add(cloud);
  }
}
function spawnObstacles() {
  if(frameCount % 60 === 0) {
    obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = ground.velocityX;  
    //generate random obstacles  
    var rand = Math.round(random(1,6));
    
    switch(rand){
      case 1:obstacle.addImage(ob1)
      break;
      case 2:obstacle.addImage(ob2)
      break;
      case 3:obstacle.addImage(ob3)
      break;
      case 4:obstacle.addImage(ob4)
      break;
      case 5:obstacle.addImage(ob5)
      break;
      case 6:obstacle.addImage(ob6)
      break;
    }
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 200;
    
    //add each obstacle to the group
    ob_group.add(obstacle);
    ob_group.setVelocityXEach(ground.velocityX)
  }
}
function reset() {
  ground.velocityX = -6;
  ob_group.destroyEach();
  cloud_group.destroyEach();
  trex.changeAnimation("running",trex_running);
  x = 1;
  if (highScore<count) {
    highScore=count;
  }
  count = 0;
  gameState = PLAY;
}
