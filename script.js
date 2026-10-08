'use strict';

// ================================================================
// SECTION 1: QUESTION DATA (18 soal per kategori, bahasa Indonesia)
// ================================================================
const QUESTIONS = {
  child: [
    {q:"Hewan apa yang bisa terbang dan bertelur?",a:["Kupu-kupu","Singa","Ikan"],correct:0,exp:"Kupu-kupu adalah serangga yang bisa terbang dan berkembang biak dengan bertelur."},
    {q:"Berapa hasil dari 3 + 5?",a:["7","8","9"],correct:1,exp:"3 ditambah 5 sama dengan 8."},
    {q:"Apa warna langit pada siang hari cerah?",a:["Merah","Biru","Hijau"],correct:1,exp:"Langit tampak biru karena cahaya matahari dihamburkan oleh atmosfer bumi."},
    {q:"Hewan apa yang suka makan bambu?",a:["Panda","Buaya","Harimau"],correct:0,exp:"Panda raksasa makanan utamanya adalah bambu."},
    {q:"Berapa jumlah kaki pada laba-laba?",a:["4","6","8"],correct:2,exp:"Laba-laba adalah arakhnida yang memiliki 8 kaki."},
    {q:"Apa bentuk benda seperti bola?",a:["Kotak","Bulat (Bola)","Segitiga"],correct:1,exp:"Bola memiliki bentuk bulat tiga dimensi yang disebut bola atau sphere."},
    {q:"Hewan apa yang tidur selama musim dingin?",a:["Beruang","Gajah","Kuda Nil"],correct:0,exp:"Beruang melakukan hibernasi (tidur panjang) selama musim dingin."},
    {q:"Berapa hasil dari 10 - 4?",a:["5","6","7"],correct:1,exp:"10 dikurangi 4 sama dengan 6."},
    {q:"Organ tubuh apa yang memompa darah?",a:["Otak","Jantung","Paru-paru"],correct:1,exp:"Jantung berfungsi memompa darah ke seluruh tubuh."},
    {q:"Apa warna pelangi paling atas?",a:["Kuning","Hijau","Merah"],correct:2,exp:"Warna paling atas pelangi adalah merah, diikuti oranye, kuning, hijau, biru, nila, ungu."},
    {q:"Hewan apa yang menghasilkan madu?",a:["Capung","Lebah","Kupu-kupu"],correct:1,exp:"Lebah madu mengumpulkan nektar dari bunga dan mengubahnya menjadi madu."},
    {q:"Ada berapa sisi pada segitiga?",a:["2","3","4"],correct:1,exp:"Segitiga adalah bangun datar yang memiliki 3 sisi dan 3 sudut."},
    {q:"Organ apa yang digunakan untuk bernafas?",a:["Hati","Paru-paru","Ginjal"],correct:1,exp:"Paru-paru adalah organ pernapasan yang menyerap oksigen dari udara."},
    {q:"Berapa hasil dari 2 x 4?",a:["6","8","10"],correct:1,exp:"2 dikalikan 4 sama dengan 8."},
    {q:"Hewan apa yang bisa hidup di air dan di darat?",a:["Ikan","Katak","Buaya"],correct:1,exp:"Katak adalah amfibi yang bisa hidup di air dan di darat."},
    {q:"Apa warna daun pada umumnya?",a:["Merah","Hijau","Biru"],correct:1,exp:"Daun berwarna hijau karena mengandung klorofil yang membantu fotosintesis."},
    {q:"Berapa hasil dari 5 x 3?",a:["12","15","18"],correct:1,exp:"5 dikalikan 3 sama dengan 15."},
    {q:"Planet apa yang kita tinggali?",a:["Mars","Bumi","Bulan"],correct:1,exp:"Kita tinggal di planet Bumi, satu-satunya planet yang diketahui memiliki kehidupan."},
  ],
  preteen: [
    {q:"Ibu kota negara Indonesia adalah?",a:["Surabaya","Jakarta","Bandung","Medan"],correct:1,exp:"Jakarta adalah ibu kota Republik Indonesia sejak kemerdekaan tahun 1945."},
    {q:"Gunung tertinggi di Indonesia adalah?",a:["Rinjani","Semeru","Puncak Jaya","Kerinci"],correct:2,exp:"Puncak Jaya (4.884 m) di Papua adalah gunung tertinggi di Indonesia."},
    {q:"Siapa Presiden pertama Indonesia?",a:["Soeharto","Soekarno","Hatta","Sjahrir"],correct:1,exp:"Ir. Soekarno adalah proklamator sekaligus Presiden pertama Republik Indonesia."},
    {q:"Planet terdekat dengan matahari adalah?",a:["Bumi","Venus","Merkurius","Mars"],correct:2,exp:"Merkurius adalah planet terdekat dengan Matahari dalam tata surya kita."},
    {q:"Berapa jumlah provinsi di Indonesia saat ini?",a:["33","34","37","38"],correct:3,exp:"Indonesia saat ini memiliki 38 provinsi setelah pemekaran beberapa daerah baru."},
    {q:"Gas apa yang paling banyak di atmosfer bumi?",a:["Oksigen","Karbon dioksida","Nitrogen","Argon"],correct:2,exp:"Nitrogen (N2) menyusun sekitar 78% atmosfer bumi."},
    {q:"Sungai terpanjang di Indonesia adalah?",a:["Sungai Musi","Sungai Mahakam","Sungai Kapuas","Sungai Barito"],correct:2,exp:"Sungai Kapuas di Kalimantan Barat sepanjang 1.143 km adalah sungai terpanjang di Indonesia."},
    {q:"Siapa penemu bola lampu?",a:["Albert Einstein","Thomas Edison","Nikola Tesla","Isaac Newton"],correct:1,exp:"Thomas Alva Edison adalah penemu bola lampu pijar yang dipatenkan pada tahun 1879."},
    {q:"Proses fotosintesis menghasilkan?",a:["Karbon dioksida","Nitrogen","Oksigen","Hidrogen"],correct:2,exp:"Fotosintesis mengubah CO2 dan air menjadi glukosa dan menghasilkan oksigen sebagai produk sampingan."},
    {q:"Danau terbesar di Indonesia adalah?",a:["Danau Toba","Danau Ranau","Danau Poso","Danau Sentani"],correct:0,exp:"Danau Toba di Sumatera Utara adalah danau terbesar di Indonesia."},
    {q:"Lambang negara Indonesia adalah?",a:["Harimau","Burung Garuda","Gajah","Kerbau"],correct:1,exp:"Burung Garuda Pancasila adalah lambang negara Republik Indonesia."},
    {q:"Berapa jumlah planet dalam tata surya?",a:["7","8","9","10"],correct:1,exp:"Tata surya memiliki 8 planet: Merkurius, Venus, Bumi, Mars, Jupiter, Saturnus, Uranus, Neptunus."},
    {q:"Proklamasi kemerdekaan Indonesia terjadi pada?",a:["17 Agustus 1945","17 Agustus 1944","17 Juli 1945","1 Juni 1945"],correct:0,exp:"Proklamasi Kemerdekaan Indonesia dikumandangkan pada 17 Agustus 1945."},
    {q:"Rumah adat Minangkabau disebut?",a:["Tongkonan","Rumah Gadang","Joglo","Uma Lengge"],correct:1,exp:"Rumah Gadang adalah rumah adat tradisional suku Minangkabau dari Sumatera Barat."},
    {q:"Unsur kimia dengan simbol O adalah?",a:["Osmium","Oksigen","Ozon","Oganesson"],correct:1,exp:"Simbol O dalam tabel periodik mewakili unsur Oksigen (nomor atom 8)."},
    {q:"Candi Borobudur terletak di provinsi?",a:["Yogyakarta","Jawa Timur","Jawa Tengah","Jawa Barat"],correct:2,exp:"Candi Borobudur berada di Magelang, Jawa Tengah, dan merupakan candi Buddha terbesar di dunia."},
    {q:"Hukum aksi-reaksi adalah hukum Newton ke?",a:["Pertama","Kedua","Ketiga","Keempat"],correct:2,exp:"Hukum Newton ke-3: setiap aksi menghasilkan reaksi yang sama besar tapi berlawanan arah."},
    {q:"Berapa pulau yang dimiliki Indonesia (perkiraan)?",a:["5.000","17.000","25.000","10.000"],correct:1,exp:"Indonesia diperkirakan memiliki sekitar 17.000 pulau dan merupakan negara kepulauan terbesar."},
  ],
  teen: [
    {q:"Siapa yang mengembangkan teori relativitas umum?",a:["Isaac Newton","Niels Bohr","Albert Einstein","Max Planck"],correct:2,exp:"Albert Einstein mengembangkan teori relativitas umum yang dipublikasikan pada tahun 1915."},
    {q:"DNA tersusun dari monomer yang disebut?",a:["Asam amino","Nukleotida","Glukosa","Lipid"],correct:1,exp:"DNA tersusun dari monomer nukleotida, masing-masing terdiri dari gula, fosfat, dan basa nitrogen."},
    {q:"Perang Dunia II berakhir pada tahun?",a:["1943","1944","1945","1946"],correct:2,exp:"Perang Dunia II berakhir pada 1945 dengan menyerahnya Jerman (Mei) dan Jepang (September)."},
    {q:"Siapa penemu penicillin?",a:["Louis Pasteur","Alexander Fleming","Robert Koch","Joseph Lister"],correct:1,exp:"Alexander Fleming menemukan penicillin secara tidak sengaja pada tahun 1928."},
    {q:"Nilai desimal dari bilangan biner 1010 adalah?",a:["8","9","10","12"],correct:2,exp:"1010 biner = 1x8 + 0x4 + 1x2 + 0x1 = 8+2 = 10 desimal."},
    {q:"Hukum kekekalan energi menyatakan bahwa energi?",a:["Bisa diciptakan","Tidak bisa diubah","Tidak bisa diciptakan atau dimusnahkan","Selalu bertambah"],correct:2,exp:"Energi tidak dapat diciptakan atau dimusnahkan, hanya dapat diubah bentuknya."},
    {q:"Negara mana yang pertama kali mendarat di bulan?",a:["Rusia","China","Amerika Serikat","Prancis"],correct:2,exp:"Amerika Serikat pertama kali mendarat di Bulan pada 20 Juli 1969 dalam misi Apollo 11."},
    {q:"Revolusi Industri pertama dimulai di negara?",a:["Prancis","Jerman","Amerika Serikat","Inggris"],correct:3,exp:"Revolusi Industri pertama dimulai di Inggris sekitar tahun 1760-an dengan mesin uap."},
    {q:"Partikel subatomik bermuatan negatif disebut?",a:["Proton","Neutron","Elektron","Foton"],correct:2,exp:"Elektron adalah partikel subatomik bermuatan negatif yang bergerak mengelilingi inti atom."},
    {q:"Algoritma paling efisien untuk mencari data terurut adalah?",a:["Linear Search","Binary Search","Bubble Sort","Sequential"],correct:1,exp:"Binary Search dengan kompleksitas O(log n) jauh lebih efisien dari Linear Search O(n) untuk data terurut."},
    {q:"Siapa yang menulis 'On the Origin of Species'?",a:["Gregor Mendel","Louis Pasteur","Charles Darwin","Alfred Wallace"],correct:2,exp:"Charles Darwin menerbitkan buku ini pada 1859, memperkenalkan teori evolusi melalui seleksi alam."},
    {q:"Manakah yang bukan kategori jaringan berdasarkan jangkauan geografis?",a:["LAN","MAN","WAN","SAN"],correct:3,exp:"SAN (Storage Area Network) bukan kategori berdasarkan jangkauan geografis, berbeda dengan LAN, MAN, WAN."},
    {q:"Pada suhu berapa air mendidih pada tekanan normal?",a:["90 C","95 C","100 C","105 C"],correct:2,exp:"Air mendidih pada 100 derajat Celsius pada tekanan atmosfer normal (1 atm)."},
    {q:"Filsuf Yunani kuno yang dihukum minum racun adalah?",a:["Plato","Aristoteles","Socrates","Pythagoras"],correct:2,exp:"Socrates dihukum mati dengan minum racun hemlock karena dianggap merusak moral pemuda Athena."},
    {q:"Pembelahan sel yang menghasilkan 2 sel anak identik disebut?",a:["Meiosis","Mitosis","Fertilisasi","Metamorfosis"],correct:1,exp:"Mitosis menghasilkan 2 sel anak dengan jumlah kromosom sama dengan sel induk."},
    {q:"Kecepatan cahaya dalam ruang hampa sekitar?",a:["300.000 km/s","150.000 km/s","450.000 km/s","600.000 km/s"],correct:0,exp:"Kecepatan cahaya dalam ruang hampa adalah sekitar 299.792 km/s, dibulatkan menjadi 300.000 km/s."},
    {q:"Jika a=5 dan b=3, nilai (a kuadrat - b kuadrat) adalah?",a:["14","16","18","22"],correct:1,exp:"a^2 - b^2 = 25 - 9 = 16. Atau gunakan rumus (a+b)(a-b) = 8 x 2 = 16."},
    {q:"WWW (World Wide Web) ditemukan oleh?",a:["Bill Gates","Steve Jobs","Tim Berners-Lee","Vint Cerf"],correct:2,exp:"Tim Berners-Lee menemukan World Wide Web pada 1989 sebagai sistem informasi global berbasis hypertext."},
  ]
};

// ================================================================
// SECTION 2: CONFIGURATION
// ================================================================
const CONFIG = {
  child:   {answerCount:3, timeLimit:35, zombieSpeed:0.12, label:"Anak (6-9 th)"},
  preteen: {answerCount:4, timeLimit:25, zombieSpeed:0.18, label:"Pra-remaja (10-13 th)"},
  teen:    {answerCount:4, timeLimit:20, zombieSpeed:0.25, label:"Remaja (14-18 th)"},
};

const WORLDS = [
  {name:"Hutan Pengetahuan", emoji:"🌲"},
  {name:"Kota Ilmu",         emoji:"🏙️"},
  {name:"Samudra Misteri",   emoji:"🌊"},
  {name:"Angkasa Raya",      emoji:"🚀"},
  {name:"Puncak Kejayaan",   emoji:"🏔️"},
];
const LEVELS_PER_WORLD = 6;
const TOTAL_LEVELS = WORLDS.length * LEVELS_PER_WORLD;

const ZOMBIE_TYPES = {
  normal: {hp:1, speed:1.0, size:34, color:'#a78bfa', points:10},
  runner: {hp:1, speed:2.0, size:28, color:'#f59e0b', points:15},
  armor:  {hp:3, speed:0.65,size:40, color:'#6b7280', points:25},
  boss:   {hp:8, speed:0.5, size:52, color:'#ef4444', points:80},
};

// ================================================================
// SECTION 3: GAME STATE
// ================================================================
let G = {
  screen:'home', age:'child',
  world:0, level:0,
  lives:3, maxLives:3,
  score:0, combo:0, maxCombo:0,
  correctCount:0, wrongCount:0,
  bonusSpeed:0, livesBonus:0,
  shieldActive:false,
  wave:0, totalWaves:3,
  zombies:[], projectiles:[], particles:[], floatTexts:[],
  isPaused:false, isGameOver:false, isLevelComplete:false,
  questionActive:false, currentQuestion:null, questionStart:0,
  questionPool:[], usedQuestions:new Set(),
  powerups:{freeze:2, fifty:1, skip:1, shield:0},
  waveClearing:false,
  spawnQueue:[], spawnTimer:0,
  lastTime:0, animFrame:null,
  screenShake:0, bgOffset:0,
};

function loadProg(age){
  try{const r=localStorage.getItem('mr_'+age);return r?JSON.parse(r):{stars:{},scores:{},unlocked:1};}
  catch(e){return{stars:{},scores:{},unlocked:1};}
}
function saveProg(age,data){try{localStorage.setItem('mr_'+age,JSON.stringify(data));}catch(e){}}
let prog = {};

// ================================================================
// SECTION 4: AUDIO (Web Audio API)
// ================================================================
let audioCtx=null, soundEnabled=true;
function initAudio(){
  try{audioCtx=new(window.AudioContext||window.webkitAudioContext)();}catch(e){audioCtx=null;}
}
function resumeAudio(){if(audioCtx&&audioCtx.state==='suspended')audioCtx.resume();}

function playSound(type){
  if(!soundEnabled||!audioCtx)return;
  resumeAudio();
  const t=audioCtx.currentTime;
  function makeOsc(freq,type2='sine',startT=t,dur=0.3,vol=0.25){
    const o=audioCtx.createOscillator();
    const g=audioCtx.createGain();
    o.type=type2;
    if(Array.isArray(freq)){
      freq.forEach(([f,ft])=>o.frequency.setValueAtTime(f,startT+ft));
    } else {
      o.frequency.setValueAtTime(freq,startT);
    }
    g.gain.setValueAtTime(vol,startT);
    g.gain.exponentialRampToValueAtTime(0.001,startT+dur);
    o.connect(g);g.connect(audioCtx.destination);
    o.start(startT);o.stop(startT+dur);
  }
  switch(type){
    case 'correct': makeOsc([[523,0],[659,.1],[784,.2]],'sine',t,.4,.3); break;
    case 'wrong': makeOsc([[220,0],[180,.15]],'sawtooth',t,.3,.25); break;
    case 'shoot': makeOsc([[800,0],[200,.15]],'triangle',t,.15,.2); break;
    case 'turbo': makeOsc([[600,0],[900,.07],[1200,.14]],'square',t,.3,.25); break;
    case 'explosion': makeOsc([[150,0],[30,.3]],'sawtooth',t,.3,.4); break;
    case 'combo':
      [523,659,784,1047].forEach((f,i)=>makeOsc(f,'sine',t+i*.08,.2,.2));
      break;
    case 'brainblast': makeOsc([[100,0],[2000,.3],[100,.6]],'sine',t,.8,.5); break;
    case 'win': [523,659,784,1047,1319].forEach((f,i)=>makeOsc(f,'sine',t+i*.12,.4,.25)); break;
    case 'lose': makeOsc([[400,0],[100,.8]],'sawtooth',t,.8,.35); break;
    case 'freeze': makeOsc([[800,0],[400,.4]],'sine',t,.4,.2); break;
    case 'loselife': makeOsc([[300,0],[200,.15]],'sawtooth',t,.35,.4); break;
  }
}

// ================================================================
// SECTION 5: BACKGROUND CANVAS
// ================================================================
const bgCanvas=document.getElementById('bg-canvas');
const bgCtx=bgCanvas.getContext('2d');
let stars=[], bgBuildings=[];

function initBgCanvas(){
  bgCanvas.width=window.innerWidth;bgCanvas.height=window.innerHeight;
  stars=[];
  for(let i=0;i<130;i++){
    stars.push({
      x:Math.random()*bgCanvas.width,y:Math.random()*bgCanvas.height*.7,
      r:Math.random()*1.5+.3,alpha:Math.random()*.6+.2,
      twinkle:Math.random()*Math.PI*2,ts:Math.random()*.02+.005,
    });
  }
  bgBuildings=[];let bx=0;
  while(bx<bgCanvas.width+80){
    const w=30+Math.random()*60,h=40+Math.random()*80;
    bgBuildings.push({x:bx,w,h});bx+=w+4;
  }
}

function drawBg(time){
  const W=bgCanvas.width,H=bgCanvas.height;
  const gr=bgCtx.createLinearGradient(0,0,0,H);
  gr.addColorStop(0,'#06020f');gr.addColorStop(.5,'#0a0614');gr.addColorStop(1,'#110a22');
  bgCtx.fillStyle=gr;bgCtx.fillRect(0,0,W,H);
  stars.forEach(s=>{
    s.twinkle+=s.ts;
    const a=s.alpha*(.6+.4*Math.sin(s.twinkle));
    bgCtx.beginPath();bgCtx.arc(s.x,s.y,s.r,0,Math.PI*2);
    bgCtx.fillStyle=`rgba(200,200,255,${a})`;bgCtx.fill();
  });
  // Nebula
  const nx=W*.5+Math.sin(time*.0003)*30,ny=H*.3;
  const ng=bgCtx.createRadialGradient(nx,ny,0,nx,ny,W*.4);
  ng.addColorStop(0,'rgba(124,58,237,.06)');ng.addColorStop(1,'rgba(0,0,0,0)');
  bgCtx.fillStyle=ng;bgCtx.fillRect(0,0,W,H);
  // Buildings
  bgCtx.fillStyle='rgba(15,8,30,.7)';
  bgBuildings.forEach(b=>{
    const bxPos=(b.x-(G.bgOffset*.15))%(W+80);
    bgCtx.fillRect(bxPos,H-b.h,b.w,b.h);
  });
}

let bgRaf;
function bgLoop(time){drawBg(time);bgRaf=requestAnimationFrame(bgLoop);}

// ================================================================
// SECTION 6: SCREEN MANAGEMENT
// ================================================================
function showScreen(id){
  const cur=document.querySelector('.screen.active');
  if(cur){
    cur.classList.add('exit');cur.classList.remove('active');
    setTimeout(()=>{cur.classList.remove('exit');cur.style.display='';},400);
  }
  setTimeout(()=>{
    const nxt=document.getElementById('screen-'+id);
    if(!nxt)return;
    nxt.style.display='flex';
    requestAnimationFrame(()=>{nxt.classList.add('active');});
    G.screen=id;
  },150);
}

// ================================================================
// SECTION 7: CANVAS SETUP
// ================================================================
const gameCanvas=document.getElementById('game-canvas');
const gCtx=gameCanvas.getContext('2d');
let canvasW=0,canvasH=0,laneY=[];
const BRAINY_X=60;
const LANE_COUNT=3;

function getLaneY(lane){
  const margin=canvasH*.15;
  const step=(canvasH-margin*2)/LANE_COUNT;
  return margin+step*lane+step/2;
}

function resizeGameCanvas(){
  const arena=document.getElementById('game-arena');
  if(!arena)return;
  const r=arena.getBoundingClientRect();
  canvasW=r.width;canvasH=r.height;
  gameCanvas.width=canvasW;gameCanvas.height=canvasH;
  laneY=[];
  for(let i=0;i<LANE_COUNT;i++)laneY.push(getLaneY(i));
  G.zombies.forEach(z=>{if(!z.dead)z.y=laneY[z.lane]||canvasH/2;});
}

// ================================================================
// SECTION 8: DRAWING FUNCTIONS
// ================================================================
function drawLanes(){
  laneY.forEach((y,i)=>{
    gCtx.beginPath();gCtx.setLineDash([8,8]);
    gCtx.strokeStyle='rgba(255,255,255,.04)';gCtx.lineWidth=1;
    gCtx.moveTo(BRAINY_X+30,y);gCtx.lineTo(canvasW,y);gCtx.stroke();
    gCtx.setLineDash([]);
    const lg=gCtx.createLinearGradient(0,y-30,0,y+30);
    lg.addColorStop(0,'rgba(0,0,0,0)');
    lg.addColorStop(.5,i===0?'rgba(60,0,120,.06)':i===1?'rgba(0,60,120,.06)':'rgba(0,0,60,.06)');
    lg.addColorStop(1,'rgba(0,0,0,0)');
    gCtx.fillStyle=lg;gCtx.fillRect(0,y-30,canvasW,60);
  });
}

function drawBrainy(x,y,size,emotion){
  const r=size/2;
  gCtx.save();
  // Glow
  const gg=gCtx.createRadialGradient(x,y,0,x,y,r*2);
  gg.addColorStop(0,'rgba(124,58,237,.3)');gg.addColorStop(1,'rgba(0,0,0,0)');
  gCtx.fillStyle=gg;gCtx.beginPath();gCtx.arc(x,y,r*2,0,Math.PI*2);gCtx.fill();
  // Body
  gCtx.beginPath();gCtx.ellipse(x,y,r,r*.88,0,0,Math.PI*2);
  gCtx.fillStyle='#c084fc';gCtx.fill();
  gCtx.strokeStyle='#9333ea';gCtx.lineWidth=1.5;gCtx.stroke();
  // Ridges
  gCtx.strokeStyle='#9333ea';gCtx.lineWidth=1.5;
  gCtx.beginPath();
  gCtx.moveTo(x-r*.6,y-r*.2);
  gCtx.quadraticCurveTo(x-r*.2,y-r*.6,x+r*.2,y-r*.2);
  gCtx.quadraticCurveTo(x+r*.5,y-r*.5,x+r*.7,y-r*.1);
  gCtx.stroke();
  gCtx.beginPath();
  gCtx.moveTo(x-r*.5,y+r*.2);gCtx.quadraticCurveTo(x,y+r*.5,x+r*.5,y+r*.2);
  gCtx.stroke();
  // Eyes
  const ey=y-r*.05,eo=r*.3;
  gCtx.fillStyle='white';
  gCtx.beginPath();gCtx.arc(x-eo,ey,r*.2,0,Math.PI*2);gCtx.fill();
  gCtx.beginPath();gCtx.arc(x+eo,ey,r*.2,0,Math.PI*2);gCtx.fill();
  const po=emotion==='panic'?r*.04:0;
  const poy=emotion==='sad'?r*.05:0;
  gCtx.fillStyle='#1e1b4b';
  gCtx.beginPath();gCtx.arc(x-eo+po,ey+poy,r*.12,0,Math.PI*2);gCtx.fill();
  gCtx.beginPath();gCtx.arc(x+eo+po,ey+poy,r*.12,0,Math.PI*2);gCtx.fill();
  // Mouth
  gCtx.beginPath();gCtx.strokeStyle='#9333ea';gCtx.lineWidth=2;
  if(emotion==='happy'){
    gCtx.arc(x,ey+r*.4,r*.22,0.1,Math.PI-.1);
  } else {
    gCtx.arc(x,ey+r*.52,r*.2,Math.PI+.2,-0.2);
  }
  gCtx.stroke();
  // Eyebrows
  if(emotion!=='happy'){
    gCtx.strokeStyle='#9333ea';gCtx.lineWidth=1.5;
    const bx2=emotion==='panic'?-r*.08:0;
    gCtx.beginPath();gCtx.moveTo(x-eo-r*.15,ey-r*.28-bx2);gCtx.lineTo(x-eo+r*.15,ey-r*.22+bx2);gCtx.stroke();
    gCtx.beginPath();gCtx.moveTo(x+eo-r*.15,ey-r*.22+bx2);gCtx.lineTo(x+eo+r*.15,ey-r*.28-bx2);gCtx.stroke();
  }
  // Cap
  gCtx.fillStyle='#4c1d95';gCtx.fillRect(x-r*.7,y-r*.85,r*1.4,r*.22);
  gCtx.beginPath();gCtx.moveTo(x,y-r*1.2);gCtx.lineTo(x+r*.7,y-r*.85);gCtx.lineTo(x-r*.7,y-r*.85);
  gCtx.closePath();gCtx.fillStyle='#7c3aed';gCtx.fill();
  gCtx.restore();
}

function drawZombie(z,time){
  if(z.dead)return;
  gCtx.save();
  const wb=Math.sin(time*.003+z.wobble)*3;
  const wk=Math.sin(time*.006*z.speed*3+z.wobble)*2;
  const col=z.frozen?'#93c5fd':z.color;
  const s=z.size,x=z.x,y=z.y+wk;

  // Freeze glow
  if(z.frozen){
    gCtx.fillStyle='rgba(147,210,250,.2)';gCtx.beginPath();gCtx.arc(x,y,s/2+6,0,Math.PI*2);gCtx.fill();
  }
  // Hit flash
  if(z.hitFlash>0){
    gCtx.fillStyle='rgba(255,255,255,.5)';gCtx.beginPath();gCtx.arc(x,y,s/2+2,0,Math.PI*2);gCtx.fill();
  }
  // Glow
  const zg=gCtx.createRadialGradient(x,y,0,x,y,s/2+8);
  zg.addColorStop(0,col+'44');zg.addColorStop(1,'rgba(0,0,0,0)');
  gCtx.fillStyle=zg;gCtx.beginPath();gCtx.arc(x,y,s/2+8,0,Math.PI*2);gCtx.fill();

  if(z.type==='boss'){
    // Boss body
    gCtx.fillStyle=col;
    gCtx.beginPath();
    if(gCtx.roundRect)gCtx.roundRect(x-s*.35,y-s*.4,s*.7,s*.8,8);
    else gCtx.rect(x-s*.35,y-s*.4,s*.7,s*.8);
    gCtx.fill();
    // Head
    gCtx.beginPath();gCtx.arc(x+wb*.3,y-s*.45,s*.32,0,Math.PI*2);gCtx.fillStyle=col;gCtx.fill();
    // Crown
    gCtx.fillStyle='#fbbf24';
    for(let i=0;i<3;i++){
      gCtx.beginPath();
      gCtx.moveTo(x-s*.22+i*s*.22,y-s*.6);
      gCtx.lineTo(x-s*.11+i*s*.22,y-s*.75);
      gCtx.lineTo(x+i*s*.22,y-s*.6);
      gCtx.fill();
    }
    // Eyes
    gCtx.fillStyle='#fef9c3';
    gCtx.beginPath();gCtx.arc(x-7,y-s*.45,7,0,Math.PI*2);gCtx.fill();
    gCtx.beginPath();gCtx.arc(x+7,y-s*.45,7,0,Math.PI*2);gCtx.fill();
    gCtx.fillStyle='#dc2626';
    gCtx.beginPath();gCtx.arc(x-7,y-s*.45,4,0,Math.PI*2);gCtx.fill();
    gCtx.beginPath();gCtx.arc(x+7,y-s*.45,4,0,Math.PI*2);gCtx.fill();
    // Angry brows
    gCtx.strokeStyle='#1f2937';gCtx.lineWidth=2;
    gCtx.beginPath();gCtx.moveTo(x-14,y-s*.6);gCtx.lineTo(x-4,y-s*.52);gCtx.stroke();
    gCtx.beginPath();gCtx.moveTo(x+4,y-s*.52);gCtx.lineTo(x+14,y-s*.6);gCtx.stroke();
    // Arms
    const lp=time*.004*z.speed;
    gCtx.fillStyle=col;
    gCtx.fillRect(x-s*.35-10,y-s*.1+Math.sin(lp)*5,10,6);
    gCtx.fillRect(x+s*.35,y-s*.1+Math.cos(lp)*5,10,6);
    // HP bar
    const bw=s*.9,bh=5,bxb=x-bw/2,byb=y+s*.45;
    gCtx.fillStyle='rgba(0,0,0,.5)';gCtx.fillRect(bxb,byb,bw,bh);
    gCtx.fillStyle='#ef4444';gCtx.fillRect(bxb,byb,bw*(z.hp/z.maxHp),bh);
  } else {
    // Normal zombie body
    gCtx.fillStyle=col;
    gCtx.beginPath();gCtx.ellipse(x,y+s*.1,s*.28,s*.22,0,0,Math.PI*2);gCtx.fill();
    // Head
    gCtx.fillStyle=col;
    gCtx.beginPath();gCtx.arc(x+wb*.3,y-s*.22,s*.28,0,Math.PI*2);gCtx.fill();
    // Armor helmet
    if(z.type==='armor'){
      gCtx.fillStyle='#4b5563';
      gCtx.beginPath();gCtx.arc(x+wb*.3,y-s*.22-2,s*.28,Math.PI,Math.PI*2);gCtx.fill();
      gCtx.fillRect(x+wb*.3-s*.28,y-s*.22-2,s*.1,s*.12);
    }
    // Eyes
    const ex=x+wb*.3,eyy=y-s*.22;
    gCtx.fillStyle='white';
    gCtx.beginPath();gCtx.arc(ex-5,eyy-1,4.5,0,Math.PI*2);gCtx.fill();
    gCtx.beginPath();gCtx.arc(ex+5,eyy-1,4.5,0,Math.PI*2);gCtx.fill();
    gCtx.fillStyle='#1e1b4b';
    gCtx.beginPath();gCtx.arc(ex-4.5,eyy,2.5,0,Math.PI*2);gCtx.fill();
    gCtx.beginPath();gCtx.arc(ex+5.5,eyy,2.5,0,Math.PI*2);gCtx.fill();
    // Runner: speed lines
    if(z.type==='runner'){
      gCtx.strokeStyle='rgba(251,191,36,.5)';gCtx.lineWidth=1.5;
      for(let i=0;i<3;i++){
        gCtx.beginPath();gCtx.moveTo(x+s*.28+4,eyy+(i-1)*6);gCtx.lineTo(x+s*.28+14+i*4,eyy+(i-1)*6);gCtx.stroke();
      }
    }
    // Mouth
    gCtx.strokeStyle='#4c1d95';gCtx.lineWidth=1.5;
    gCtx.beginPath();gCtx.arc(ex,eyy+5,4,.2,Math.PI-.2);gCtx.stroke();
    // Legs
    const lph=time*.005*z.speed*2;
    gCtx.fillStyle=col;
    gCtx.beginPath();gCtx.ellipse(x-5,y+s*.25+Math.sin(lph)*4,4,7,.2,0,Math.PI*2);gCtx.fill();
    gCtx.beginPath();gCtx.ellipse(x+5,y+s*.25+Math.cos(lph)*4,4,7,-.2,0,Math.PI*2);gCtx.fill();
    // Armor HP dots
    if(z.type==='armor'){
      for(let i=0;i<z.maxHp;i++){
        gCtx.fillStyle=i<z.hp?'#34d399':'rgba(255,255,255,.2)';
        gCtx.beginPath();gCtx.arc(x-5+i*6,y+s*.38,3,0,Math.PI*2);gCtx.fill();
      }
    }
  }
  // Freeze overlay
  if(z.frozen){
    gCtx.fillStyle='rgba(147,210,250,.3)';gCtx.beginPath();gCtx.arc(x,y,s*.45,0,Math.PI*2);gCtx.fill();
  }
  gCtx.restore();
}

function drawProjectile(p){
  gCtx.save();
  // Trail
  for(let i=0;i<8;i++){
    const ti=i/8,tr=p.turbo?5-ti*3:4-ti*2,ta=(1-ti)*.4;
    gCtx.beginPath();gCtx.arc(p.x-(p.vx||0)*(8-i),p.y-(p.vy||0)*(8-i),Math.max(tr,.5),0,Math.PI*2);
    gCtx.fillStyle=p.turbo?`rgba(251,191,36,${ta})`:`rgba(167,139,250,${ta})`;
    gCtx.fill();
  }
  // Core glow
  const r=p.turbo?8:6;
  const pg=gCtx.createRadialGradient(p.x,p.y,0,p.x,p.y,r*2);
  pg.addColorStop(0,p.turbo?'#fbbf24':'#a78bfa');
  pg.addColorStop(.5,p.turbo?'#f59e0b88':'#7c3aed88');
  pg.addColorStop(1,'rgba(0,0,0,0)');
  gCtx.fillStyle=pg;gCtx.beginPath();gCtx.arc(p.x,p.y,r*2,0,Math.PI*2);gCtx.fill();
  gCtx.fillStyle=p.turbo?'#fef9c3':'#ede9fe';
  gCtx.beginPath();gCtx.arc(p.x,p.y,r*.6,0,Math.PI*2);gCtx.fill();
  gCtx.restore();
}

function renderGame(time){
  gCtx.clearRect(0,0,canvasW,canvasH);
  // Screen shake
  let didShake=false;
  if(G.screenShake>0){
    gCtx.save();
    gCtx.translate((Math.random()-.5)*G.screenShake*2,(Math.random()-.5)*G.screenShake*2);
    G.screenShake=Math.max(0,G.screenShake-.5);
    didShake=true;
  }
  drawLanes();
  // Brainy
  const closestDist=G.zombies.reduce((mn,z)=>z.dead?mn:Math.min(mn,z.x-BRAINY_X),Infinity);
  const emotion=G.lives<2||closestDist<canvasW*.3?'panic':G.lives<G.maxLives?'sad':'happy';
  drawBrainy(BRAINY_X,canvasH/2,44,emotion);
  // Draw entities
  G.projectiles.forEach(p=>drawProjectile(p));
  G.zombies.forEach(z=>drawZombie(z,time));
  // Particles
  G.particles.forEach(p=>{
    gCtx.save();gCtx.globalAlpha=p.alpha;gCtx.fillStyle=p.color;
    gCtx.beginPath();gCtx.arc(p.x,p.y,p.r,0,Math.PI*2);gCtx.fill();gCtx.restore();
  });
  // Float texts
  G.floatTexts.forEach(ft=>{
    gCtx.save();gCtx.globalAlpha=ft.alpha;
    gCtx.font=`bold ${ft.size}px "Segoe UI",system-ui,sans-serif`;
    gCtx.fillStyle=ft.color;gCtx.textAlign='center';
    gCtx.shadowColor=ft.color;gCtx.shadowBlur=8;
    gCtx.fillText(ft.text,ft.x,ft.y);gCtx.restore();
  });
  if(didShake)gCtx.restore();
}

// ================================================================
// SECTION 9: ZOMBIE CREATION
// ================================================================
function createZombie(type,lane){
  const cfg=ZOMBIE_TYPES[type];
  const baseSpd=CONFIG[G.age].zombieSpeed;
  const lvlMult=1+(G.world*LEVELS_PER_WORLD+G.level)*.04;
  const hpBonus=G.world>1?G.world-1:0;
  return {
    id:Math.random().toString(36).substr(2,9),
    type,lane,
    x:canvasW+cfg.size,y:laneY[lane]||canvasH/2,
    hp:cfg.hp+hpBonus, maxHp:cfg.hp+hpBonus,
    speed:baseSpd*cfg.speed*lvlMult,
    size:cfg.size, color:cfg.color, points:cfg.points,
    frozen:false, frozenEnd:0,
    wobble:Math.random()*Math.PI*2,
    hitFlash:0, dead:false,
  };
}

function buildWaveQueue(wi){
  const queue=[];
  const li=G.world*LEVELS_PER_WORLD+G.level;
  const isBoss=G.level===5;
  if(isBoss&&wi===G.totalWaves-1){
    queue.push({delay:0,type:'boss',lane:1});
    for(let i=0;i<2;i++) queue.push({delay:4000+i*3500,type:'armor',lane:Math.floor(Math.random()*3)});
    for(let i=0;i<2;i++) queue.push({delay:4500+i*3000,type:'runner',lane:Math.floor(Math.random()*3)});
  } else {
    const cnt=Math.min(2+wi+Math.floor(G.world/2),6);
    const types=['normal','normal','runner'];
    if(li>3)types.push('runner');
    if(li>6)types.push('armor');
    for(let i=0;i<cnt;i++){
      const type=li<2?'normal':types[Math.floor(Math.random()*types.length)];
      const lane=Math.floor(Math.random()*LANE_COUNT);
      const delay=i*3500;
      queue.push({delay,type,lane});
    }
  }
  return queue;
}

// ================================================================
// SECTION 10: ENTITY UPDATES
// ================================================================
function addParticles(x,y,col='#a78bfa',count=14){
  const colors=['#a78bfa','#7c3aed','#c084fc','#fbbf24','#34d399'];
  for(let i=0;i<count;i++){
    const angle=Math.random()*Math.PI*2,spd=1.5+Math.random()*3;
    G.particles.push({
      x,y,vx:Math.cos(angle)*spd,vy:Math.sin(angle)*spd,
      r:2+Math.random()*4,alpha:1,decay:.03+Math.random()*.02,
      color:col||colors[Math.floor(Math.random()*colors.length)],
    });
  }
}

function addFloatText(text,x,y,color='#34d399',size=16){
  G.floatTexts.push({text,x,y,vy:-.8,alpha:1,color,size,life:80});
}

function killZombie(z){
  z.dead=true;
  const bonus=G.combo>3?1.5:1;
  G.score+=z.points*bonus;
  updateHUDScore();
  playSound('explosion');
  addParticles(z.x,z.y,z.color);
  addFloatText(`+${z.points}`,z.x,z.y-z.size/2,'#fbbf24',18);
}

function dealDamage(z,dmg){
  z.hp-=dmg;z.hitFlash=6;
  if(z.hp<=0)killZombie(z);
}

let brainyInvulnEnd=0;
function zombieReachBrainy(z){
  z.dead=true;
  addParticles(z.x,z.y,z.color,10);
  if(G.shieldActive){
    G.shieldActive=false;
    addFloatText('🛡️ TERLINDUNGI!',canvasW/2,canvasH/2,'#60a5fa',22);
    updatePUUI();return;
  }
  const now=performance.now();
  if(now<brainyInvulnEnd)return;
  brainyInvulnEnd=now+1500;

  G.lives--;playSound('loselife');G.screenShake=10;
  updateHUDLives();
  addParticles(BRAINY_X,canvasH/2,'#f87171',12);
  addFloatText('-1 ❤️',BRAINY_X+30,canvasH/2,'#f87171',22);
  if(G.lives<=0)endGameOver();
}

// Spawn with sequential timing
let spawnIndex=0, spawnTimeouts=[];

function clearSpawnTimeouts(){
  spawnTimeouts.forEach(t=>clearTimeout(t));
  spawnTimeouts=[];
}

function startWaveSpawning(queue){
  clearSpawnTimeouts();
  let elapsed=0;
  queue.forEach(item=>{
    elapsed+=item.delay;
    const t=setTimeout(()=>{
      if(!G.isGameOver&&!G.isLevelComplete){
        const z=createZombie(item.type,item.lane);
        G.zombies.push(z);
      }
    },elapsed);
    spawnTimeouts.push(t);
  });
  // After all spawned, mark as done
  const totalTime=elapsed+2000;
  const checkT=setTimeout(()=>{
    // Wave completion is handled in gameLoop by checking zombie count
  },totalTime);
  spawnTimeouts.push(checkT);
  return elapsed;
}

let waveSpawnDone=false, waveSpawnEnd=0;

function updateEntities(dt,now){
  // Move zombies
  G.zombies.forEach(z=>{
    if(z.dead)return;
    if(z.frozen&&now>z.frozenEnd)z.frozen=false;
    if(!z.frozen)z.x-=z.speed*(dt/16);
    z.wobble+=.05;
    if(z.hitFlash>0)z.hitFlash--;
    if(z.x<=BRAINY_X+20)zombieReachBrainy(z);
  });

  // Move projectiles (homing)
  G.projectiles.forEach(p=>{
    const target=G.zombies.find(z=>z.id===p.targetId&&!z.dead);
    if(target){p.tx=target.x;p.ty=target.y;}
    const dx=p.tx-p.x,dy=p.ty-p.y,dist=Math.sqrt(dx*dx+dy*dy);
    if(dist<12||!target){
      p.life=0;if(target)dealDamage(target,p.damage);
    } else {
      const spd=Math.min(12+dist*.1,22);
      p.vx=dx/dist*spd;p.vy=dy/dist*spd;
      p.x+=p.vx;p.y+=p.vy;
    }
  });

  // Particles
  G.particles.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.05;p.alpha-=p.decay;p.r*=.97;});
  G.floatTexts.forEach(ft=>{ft.y+=ft.vy;ft.life--;ft.alpha=ft.life/80;});

  // Cleanup
  G.zombies=G.zombies.filter(z=>!z.dead);
  G.projectiles=G.projectiles.filter(p=>p.life>0);
  G.particles=G.particles.filter(p=>p.alpha>0);
  G.floatTexts=G.floatTexts.filter(ft=>ft.life>0);
}

// ================================================================
// SECTION 11: GAME LOOP
// ================================================================
function gameLoop(time){
  if(G.isGameOver||G.isLevelComplete){return;}
  if(G.isPaused){G.animFrame=requestAnimationFrame(gameLoop);return;}

  const dt=Math.min(time-G.lastTime,50);
  G.lastTime=time;
  G.bgOffset+=.3;

  updateEntities(dt,performance.now());
  renderGame(time);

  // Check wave clear: all spawns issued AND no zombies left
  if(waveSpawnDone&&G.zombies.length===0&&!G.waveClearing){
    G.waveClearing=true;
    setTimeout(onWaveClear,800);
  }

  G.animFrame=requestAnimationFrame(gameLoop);
}

function startGameLoop(){
  if(G.animFrame)cancelAnimationFrame(G.animFrame);
  G.lastTime=performance.now();
  G.animFrame=requestAnimationFrame(gameLoop);
}
function stopGameLoop(){if(G.animFrame){cancelAnimationFrame(G.animFrame);G.animFrame=null;}}

// ================================================================
// SECTION 12: WAVE MANAGEMENT
// ================================================================
function startWave(wi){
  G.waveClearing=false;
  waveSpawnDone=false;
  const queue=buildWaveQueue(wi);
  const spawnDur=startWaveSpawning(queue);

  // Mark spawn as done after all spawn timeouts
  const doneT=setTimeout(()=>{waveSpawnDone=true;},spawnDur+1500);
  spawnTimeouts.push(doneT);

  showWaveAnnounce(wi+1,G.totalWaves);
  document.getElementById('wave-display').textContent=`Gelombang ${wi+1}/${G.totalWaves}`;
}

function showWaveAnnounce(wave,total){
  const el=document.getElementById('wave-announce');
  const isBoss=G.level===5&&wave===total;
  document.getElementById('wave-announce-title').textContent=isBoss?'⚠️ BOSS!':'Gelombang '+wave;
  document.getElementById('wave-announce-sub').textContent=isBoss?'Boss muncul! Gunakan pengetahuanmu!':'Bersiap!';
  el.classList.remove('show');void el.offsetWidth;el.classList.add('show');
  setTimeout(()=>el.classList.remove('show'),2200);
}

function onWaveClear(){
  G.waveClearing=false;G.wave++;
  if(G.wave>=G.totalWaves){endLevelComplete();}
  else{startWave(G.wave);}
}

// ================================================================
// SECTION 13: QUESTION SYSTEM
// ================================================================
function shuffle(arr){
  const a=[...arr];
  for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
  return a;
}

function prepareQuestions(){
  G.questionPool=shuffle(QUESTIONS[G.age]);
  G.usedQuestions=new Set();
}

function getNextQuestion(){
  let q=G.questionPool.find((_,i)=>!G.usedQuestions.has(i));
  if(!q){G.questionPool=shuffle(QUESTIONS[G.age]);G.usedQuestions.clear();q=G.questionPool[0];}
  G.usedQuestions.add(G.questionPool.indexOf(q));
  return q;
}

let timerRAF=null;

function startQuestion(){
  if(G.isPaused||G.isGameOver||G.isLevelComplete)return;
  clearQuestion();
  const q=getNextQuestion();
  G.currentQuestion=q;G.questionStart=performance.now();G.questionActive=true;

  document.getElementById('question-text').textContent=q.q;
  const grid=document.getElementById('answers-grid');grid.innerHTML='';
  document.getElementById('explanation-bar').style.display='none';

  const cfg=CONFIG[G.age];
  let answers=[...q.a];
  let displayCorrect=q.correct;
  if(cfg.answerCount<answers.length){
    const correctAns=answers[q.correct];
    const wrong=shuffle(answers.filter((_,i)=>i!==q.correct)).slice(0,cfg.answerCount-1);
    answers=shuffle([correctAns,...wrong]);
    displayCorrect=answers.indexOf(correctAns);
  }
  q._da=answers;q._dc=displayCorrect;

  const keys=['1','2','3','4'];
  answers.forEach((ans,i)=>{
    const btn=document.createElement('button');
    btn.className='answer-btn';btn.id='ans-btn-'+i;
    btn.innerHTML=`<span class="key-badge">${keys[i]}</span> ${ans}`;
    btn.addEventListener('click',()=>handleAnswer(i,q));
    grid.appendChild(btn);
  });

  // Timer
  const timeLimit=cfg.timeLimit*1000;
  const circ=document.getElementById('timer-fill-circle');
  const C=2*Math.PI*18;circ.style.strokeDasharray=C;
  const tStart=performance.now();

  function timerTick(now){
    if(G.isPaused||!G.questionActive)return;
    const rem=Math.max(0,timeLimit-(now-tStart));
    const prog=rem/timeLimit;
    circ.style.strokeDashoffset=C*(1-prog);
    document.getElementById('timer-text').textContent=Math.ceil(rem/1000);
    circ.style.stroke=prog>.5?'#34d399':prog>.25?'#fbbf24':'#f87171';
    circ.style.filter=rem<=3000&&rem>0?'drop-shadow(0 0 4px #f87171)':'';
    if(rem<=0){onTimeout(q);return;}
    timerRAF=requestAnimationFrame(timerTick);
  }
  timerRAF=requestAnimationFrame(timerTick);
}

function clearQuestion(){
  G.questionActive=false;
  if(timerRAF){cancelAnimationFrame(timerRAF);timerRAF=null;}
}

function handleAnswer(idx,q){
  if(!G.questionActive)return;
  clearQuestion();
  const elapsed=performance.now()-G.questionStart;
  const isCorrect=idx===q._dc;
  const isTurbo=isCorrect&&elapsed<5000;

  const btns=document.querySelectorAll('.answer-btn');
  if(btns[idx])btns[idx].classList.add(isCorrect?'correct':'wrong');
  if(btns[q._dc])btns[q._dc].classList.add('correct');

  if(isCorrect){
    playSound(isTurbo?'turbo':'correct');
    G.combo++;G.correctCount++;
    if(G.combo>G.maxCombo)G.maxCombo=G.combo;
    const speedBonus=isTurbo?20:Math.max(0,Math.floor((1-elapsed/(CONFIG[G.age].timeLimit*1000))*15));
    const comboBonus=G.combo>1?G.combo*3:0;
    G.score+=10+speedBonus+comboBonus;G.bonusSpeed+=speedBonus;
    updateHUDScore();updateHUDCombo();
    // Shoot
    const closest=G.zombies.filter(z=>!z.dead).sort((a,b)=>a.x-b.x)[0];
    if(closest){
      G.projectiles.push({
        x:BRAINY_X+28,y:laneY[closest.lane]||canvasH/2,
        startX:BRAINY_X+28,startY:laneY[closest.lane]||canvasH/2,
        targetId:closest.id,tx:closest.x,ty:closest.y,
        vx:0,vy:0,turbo:isTurbo,life:1,maxLife:1,damage:isTurbo?2:1,
      });
      playSound(isTurbo?'turbo':'shoot');
    }
    if(isTurbo)addFloatText('⚡ TURBO!',canvasW/2,40,'#fbbf24',22);
    // Combo effects
    if(G.combo===3)handleAreaAttack();
    else if(G.combo>=5&&G.combo%5===0)handleBrainBlast();
    updateHUDStars();
    setTimeout(()=>startQuestion(),600);
  } else {
    playSound('wrong');G.combo=0;G.wrongCount++;updateHUDCombo();
    // Nyawa berkurang saat salah menjawab
    if(G.shieldActive){
      G.shieldActive=false;
      addFloatText('🛡️ SHIELD MENYELAMATKAN!',canvasW/2,canvasH/2,'#60a5fa',20);
      updatePUUI();
    } else {
      G.lives--;
      playSound('loselife');
      G.screenShake=8;
      updateHUDLives();
      addParticles(BRAINY_X,canvasH/2,'#f87171',10);
      addFloatText('-1 ❤️ SALAH',BRAINY_X+30,canvasH/2,'#f87171',22);
    }
    const exp=document.getElementById('explanation-bar');
    exp.textContent='💡 '+q.exp;exp.style.display='block';
    updateHUDStars();
    if(G.lives<=0){
      setTimeout(()=>endGameOver(),900);
      return;
    }
    setTimeout(()=>startQuestion(),2000);
  }
}

function onTimeout(q){
  clearQuestion();G.combo=0;G.wrongCount++;updateHUDCombo();playSound('wrong');
  // Nyawa berkurang saat waktu habis
  if(G.shieldActive){
    G.shieldActive=false;
    addFloatText('🛡️ SHIELD MENYELAMATKAN!',canvasW/2,canvasH/2,'#60a5fa',20);
    updatePUUI();
  } else {
    G.lives--;
    playSound('loselife');
    G.screenShake=8;
    updateHUDLives();
    addParticles(BRAINY_X,canvasH/2,'#f87171',10);
    addFloatText('-1 ❤️ WAKTU HABIS',BRAINY_X+30,canvasH/2,'#f87171',20);
  }
  const btns=document.querySelectorAll('.answer-btn');
  if(btns[q._dc])btns[q._dc].classList.add('correct');
  const exp=document.getElementById('explanation-bar');
  exp.textContent='⏰ Waktu habis! 💡 '+q.exp;exp.style.display='block';
  updateHUDStars();
  if(G.lives<=0){
    setTimeout(()=>endGameOver(),900);
    return;
  }
  setTimeout(()=>startQuestion(),2000);
}

function handleAreaAttack(){
  const laneCounts=[0,1,2].map(l=>({l,c:G.zombies.filter(z=>!z.dead&&z.lane===l).length}));
  const targetLane=laneCounts.sort((a,b)=>b.c-a.c)[0].l;
  G.zombies.filter(z=>!z.dead&&z.lane===targetLane).forEach(z=>{
    G.projectiles.push({
      x:BRAINY_X+28,y:laneY[z.lane]||canvasH/2,
      startX:BRAINY_X+28,startY:laneY[z.lane]||canvasH/2,
      targetId:z.id,tx:z.x,ty:z.y,vx:0,vy:0,turbo:false,life:1,maxLife:1,damage:1,
    });
  });
  playSound('combo');
  addFloatText('🔥 COMBO x3!',canvasW/2,50,'#f59e0b',24);
}

function handleBrainBlast(){
  G.screenShake=12;
  [0,1,2].forEach(lane=>{
    const z=G.zombies.filter(q=>!q.dead&&q.lane===lane).sort((a,b)=>a.x-b.x)[0];
    if(z){killZombie(z);}
  });
  playSound('brainblast');
  addFloatText('🌟 BRAIN BLAST!',canvasW/2,canvasH/2,'#a78bfa',28);
  const arena=document.getElementById('game-arena');
  const ring=document.createElement('div');ring.className='brain-blast-ring';
  ring.style.cssText=`left:${BRAINY_X}px;top:${canvasH/2}px;width:40px;height:40px;`;
  arena.appendChild(ring);setTimeout(()=>ring.remove(),900);
}

// ================================================================
// SECTION 14: POWER-UPS
// ================================================================
function usePowerup(type){
  if(G.powerups[type]<=0||G.isPaused)return;
  G.powerups[type]--;updatePUUI();
  switch(type){
    case 'freeze':
      playSound('freeze');
      const now=performance.now();
      G.zombies.forEach(z=>{if(!z.dead){z.frozen=true;z.frozenEnd=now+5000;}});
      addFloatText('❄️ FREEZE!',canvasW/2,40,'#93c5fd',22);break;
    case 'fifty':
      if(G.questionActive&&G.currentQuestion){
        const btns=document.querySelectorAll('.answer-btn');
        let rm=0;btns.forEach((b,i)=>{if(rm>=2)return;if(i!==G.currentQuestion._dc){b.style.visibility='hidden';rm++;}});
        addFloatText('🎯 50:50!',canvasW/2,40,'#60a5fa',22);
      }break;
    case 'skip':
      clearQuestion();addFloatText('⏭️ SKIP!',canvasW/2,40,'#34d399',22);
      setTimeout(()=>startQuestion(),300);break;
    case 'shield':
      G.shieldActive=true;addFloatText('🛡️ SHIELD AKTIF!',canvasW/2,canvasH/2,'#60a5fa',22);break;
  }
}

function updatePUUI(){
  [['freeze','pu-freeze-c'],['fifty','pu-fifty-c'],['skip','pu-skip-c'],['shield','pu-shield-c']].forEach(([type,cid])=>{
    const cnt=G.powerups[type];
    const el=document.getElementById(cid);if(el)el.textContent=cnt;
    const btn=document.getElementById('pu-'+type);if(btn)btn.disabled=cnt===0;
  });
}

// ================================================================
// SECTION 15: HUD UPDATES
// ================================================================
function updateHUDLives(){
  const el=document.getElementById('hud-lives');el.innerHTML='';
  for(let i=0;i<G.maxLives;i++){
    const s=document.createElement('span');
    s.className='life-icon'+(i>=G.lives?' lost':'');s.textContent='❤️';el.appendChild(s);
  }
}
function updateHUDScore(){document.getElementById('hud-score').textContent=Math.floor(G.score);}
function updateHUDCombo(){
  const el=document.getElementById('hud-combo');
  el.textContent='🔥 x'+G.combo;
  if(G.combo>0){el.classList.remove('pop');void el.offsetWidth;el.classList.add('pop');}
}
function updateHUDStars(){
  const s=Math.floor(G.score);
  let st='⭐';if(s>150)st='⭐⭐';if(s>350)st='⭐⭐⭐';
  document.getElementById('hud-stars').textContent=st;
}

// ================================================================
// SECTION 16: LEVEL MANAGEMENT
// ================================================================
function startLevel(world,level){
  G.world=world;G.level=level;
  G.lives=3;G.maxLives=3;G.score=0;G.combo=0;G.maxCombo=0;
  G.correctCount=0;G.wrongCount=0;G.bonusSpeed=0;
  G.shieldActive=false;G.wave=0;G.totalWaves=level===5?4:3;
  G.zombies=[];G.projectiles=[];G.particles=[];G.floatTexts=[];
  G.isPaused=false;G.isGameOver=false;G.isLevelComplete=false;G.waveClearing=false;
  waveSpawnDone=false;
  clearSpawnTimeouts();

  // Power-up unlocks by level
  const li=world*LEVELS_PER_WORLD+level;
  if(li<3)      G.powerups={freeze:2,fifty:0,skip:0,shield:0};
  else if(li<8)  G.powerups={freeze:2,fifty:2,skip:0,shield:0};
  else if(li<15) G.powerups={freeze:2,fifty:2,skip:1,shield:0};
  else           G.powerups={freeze:2,fifty:2,skip:2,shield:1};

  prepareQuestions();
  updateHUDLives();updateHUDScore();updateHUDCombo();updatePUUI();
  document.getElementById('hud-level').textContent=`W${world+1}-L${level+1}`;
  document.getElementById('hud-stars').textContent='⭐⭐⭐';
  document.getElementById('pause-overlay').classList.remove('active');

  resizeGameCanvas();
  showScreen('game');
  setTimeout(()=>{
    startWave(0);startGameLoop();
    setTimeout(()=>startQuestion(),1200);
  },600);
}

function endLevelComplete(){
  G.isLevelComplete=true;clearQuestion();clearSpawnTimeouts();stopGameLoop();playSound('win');
  const livesBonus=G.lives*30;G.score+=livesBonus;G.livesBonus=livesBonus;
  const fs=Math.floor(G.score);
  let stars=1;if(fs>200)stars=2;if(fs>420)stars=3;

  const lk=`${G.world}-${G.level}`;
  if(!prog[G.age])prog[G.age]=loadProg(G.age);
  const p=prog[G.age];
  if(!p.stars[lk]||p.stars[lk]<stars)p.stars[lk]=stars;
  if(!p.scores[lk]||p.scores[lk]<fs)p.scores[lk]=fs;
  const nextLi=G.world*LEVELS_PER_WORLD+G.level+1+1;
  if(p.unlocked<nextLi)p.unlocked=nextLi;
  saveProg(G.age,p);

  setTimeout(()=>showResultScreen(stars,fs,livesBonus),800);
}

function endGameOver(){
  G.isGameOver=true;clearQuestion();clearSpawnTimeouts();stopGameLoop();playSound('lose');
  setTimeout(()=>{
    document.getElementById('gameover-score').textContent=Math.floor(G.score);
    showScreen('gameover');
  },600);
}

function showResultScreen(stars,total,livesBonus){
  document.getElementById('result-title').textContent=G.level===5?'🎉 Boss Dikalahkan!':'🎉 Level Selesai!';
  document.getElementById('result-breakdown').innerHTML=
    `<span>Benar: ${G.correctCount}</span><span>+Nyawa: ${livesBonus}</span><span>Combo: ${G.maxCombo}</span>`;
  showScreen('result');
  // Animate score
  let disp=0;const step=Math.ceil(total/40);
  const si=setInterval(()=>{
    disp=Math.min(disp+step,total);
    document.getElementById('result-score').textContent=disp;
    if(disp>=total)clearInterval(si);
  },30);
  // Animate stars
  ['rs1','rs2','rs3'].forEach((id,i)=>{
    const el=document.getElementById(id);
    el.classList.remove('earned');el.style.opacity='0';
    if(i<stars)setTimeout(()=>{el.style.opacity='1';el.classList.add('earned');if(i===stars-1)playSound('win');},500+i*500);
  });
  // Next button
  const hasNext=(G.world*LEVELS_PER_WORLD+G.level+1)<TOTAL_LEVELS;
  const nb=document.getElementById('btn-result-next');
  nb.style.display=hasNext?'':'none';
  nb.onclick=()=>{
    const nl=G.level+1;
    if(nl<LEVELS_PER_WORLD)startLevel(G.world,nl);
    else if(G.world+1<WORLDS.length)startLevel(G.world+1,0);
  };
}

// ================================================================
// SECTION 17: LEVEL MAP
// ================================================================
function renderLevelMap(){
  if(!prog[G.age])prog[G.age]=loadProg(G.age);
  const p=prog[G.age];
  const cont=document.getElementById('map-worlds');cont.innerHTML='';
  document.getElementById('map-title').textContent=CONFIG[G.age].label;
  WORLDS.forEach((world,wi)=>{
    const sec=document.createElement('div');sec.className='world-section';
    sec.innerHTML=`<div class="world-title">${world.emoji} Dunia ${wi+1}: ${world.name}</div>`;
    const grid=document.createElement('div');grid.className='levels-grid';
    for(let li=0;li<LEVELS_PER_WORLD;li++){
      const gi=wi*LEVELS_PER_WORLD+li;
      const lk=`${wi}-${li}`;
      const unlocked=gi<p.unlocked;
      const stars=p.stars[lk]||0;
      const boss=li===5;
      const btn=document.createElement('div');
      btn.className=`level-btn glass-panel${unlocked?'':' locked'}${boss?' boss':''}`;
      if(unlocked){
        if(boss)btn.innerHTML='<span class="level-type-badge">BOSS</span>';
        btn.innerHTML+=`<span class="level-num">${li+1}</span>`;
        btn.innerHTML+=`<div class="level-stars">${stars>0?'⭐'.repeat(stars)+'☆'.repeat(3-stars):'<span style="color:var(--text-secondary)">☆☆☆</span>'}</div>`;
        btn.addEventListener('click',()=>startLevel(wi,li));
      } else {
        btn.innerHTML=`<span class="level-lock-icon">🔒</span><span style="font-size:.7rem;color:var(--text-secondary)">${li+1}</span>`;
      }
      grid.appendChild(btn);
    }
    sec.appendChild(grid);cont.appendChild(sec);
  });
}

function updateHomeScores(){
  let html='<div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;">';
  ['child','preteen','teen'].forEach((age,i)=>{
    const p=loadProg(age);
    const ts=Object.values(p.stars||{}).reduce((s,v)=>s+v,0);
    const labels=['Anak','Pra-remaja','Remaja'];
    if(ts>0||p.unlocked>1)html+=`<span>🌟${labels[i]}: ${ts}⭐</span>`;
  });
  html+='</div>';
  document.getElementById('home-scores').innerHTML=html;
}

// ================================================================
// SECTION 18: PAUSE
// ================================================================
function togglePause(){
  if(G.isGameOver||G.isLevelComplete)return;
  G.isPaused=!G.isPaused;
  const ov=document.getElementById('pause-overlay');
  if(G.isPaused){
    ov.classList.add('active');clearQuestion();
  } else {
    ov.classList.remove('active');G.lastTime=performance.now();
    if(!G.animFrame)startGameLoop();
    setTimeout(()=>startQuestion(),300);
  }
}

// ================================================================
// SECTION 19: SOUND TOGGLE
// ================================================================
function setupSoundToggles(){
  const ids=['snd-home','snd-howto','snd-age'];
  function doToggle(){
    soundEnabled=!soundEnabled;
    const ic=soundEnabled?'🔊':'🔇';
    ids.forEach(id=>{const e=document.getElementById(id);if(e)e.textContent=ic;});
    try{localStorage.setItem('mr_sound',soundEnabled?'1':'0');}catch(e){}
  }
  ids.forEach(id=>{const e=document.getElementById(id);if(e)e.addEventListener('click',doToggle);});
  try{if(localStorage.getItem('mr_sound')==='0'){soundEnabled=false;ids.forEach(id=>{const e=document.getElementById(id);if(e)e.textContent='🔇';});}}catch(e){}
}

// ================================================================
// SECTION 20: EVENT LISTENERS
// ================================================================
function setupEvents(){
  // Home
  document.getElementById('btn-play').addEventListener('click',()=>{resumeAudio();showScreen('age');});
  document.getElementById('btn-howto').addEventListener('click',()=>showScreen('howto'));
  document.getElementById('btn-howto-back').addEventListener('click',()=>showScreen('home'));
  // Age
  ['child','preteen','teen'].forEach(age=>{
    document.getElementById('age-'+age).addEventListener('click',()=>{
      G.age=age;prog[age]=loadProg(age);renderLevelMap();showScreen('map');
    });
  });
  document.getElementById('btn-age-back').addEventListener('click',()=>showScreen('home'));
  // Map
  document.getElementById('btn-map-back').addEventListener('click',()=>showScreen('age'));
  document.getElementById('btn-change-age').addEventListener('click',()=>showScreen('age'));
  // Pause
  document.getElementById('btn-pause').addEventListener('click',togglePause);
  document.getElementById('btn-resume').addEventListener('click',togglePause);
  document.getElementById('btn-restart').addEventListener('click',()=>{stopGameLoop();clearQuestion();clearSpawnTimeouts();startLevel(G.world,G.level);});
  document.getElementById('btn-quit').addEventListener('click',()=>{stopGameLoop();clearQuestion();clearSpawnTimeouts();renderLevelMap();showScreen('map');});
  // Power-ups
  document.getElementById('pu-freeze').addEventListener('click',()=>usePowerup('freeze'));
  document.getElementById('pu-fifty').addEventListener('click',()=>usePowerup('fifty'));
  document.getElementById('pu-skip').addEventListener('click',()=>usePowerup('skip'));
  document.getElementById('pu-shield').addEventListener('click',()=>usePowerup('shield'));
  // Result
  document.getElementById('btn-result-retry').addEventListener('click',()=>startLevel(G.world,G.level));
  document.getElementById('btn-result-map').addEventListener('click',()=>{renderLevelMap();showScreen('map');});
  // Game Over
  document.getElementById('btn-go-retry').addEventListener('click',()=>startLevel(G.world,G.level));
  document.getElementById('btn-go-map').addEventListener('click',()=>{renderLevelMap();showScreen('map');});
  document.getElementById('btn-go-home').addEventListener('click',()=>{updateHomeScores();showScreen('home');});
  // Keyboard
  document.addEventListener('keydown',e=>{
    if(G.screen==='game'){
      if(e.key==='p'||e.key==='P'||e.key==='Escape'){togglePause();return;}
      if(!G.isPaused&&G.questionActive){
        const km={'1':0,'2':1,'3':2,'4':3};
        if(km[e.key]!==undefined){
          const b=document.getElementById('ans-btn-'+km[e.key]);
          if(b&&b.style.visibility!=='hidden')b.click();
        }
        if(e.key==='f'||e.key==='F')usePowerup('freeze');
        if(e.key==='h'||e.key==='H')usePowerup('fifty');
        if(e.key==='s'||e.key==='S')usePowerup('skip');
      }
    }
  });
  // Resize
  window.addEventListener('resize',()=>{
    initBgCanvas();
    if(G.screen==='game')resizeGameCanvas();
  });
  window.addEventListener('orientationchange',()=>{
    setTimeout(()=>{initBgCanvas();if(G.screen==='game')resizeGameCanvas();},300);
  });
}

// ================================================================
// SECTION 21: INIT
// ================================================================
function init(){
  initAudio();initBgCanvas();bgLoop(0);
  setupSoundToggles();setupEvents();
  updateHomeScores();
  // Show home screen
  const home=document.getElementById('screen-home');
  home.style.display='flex';
  requestAnimationFrame(()=>{home.classList.add('active');});
}

window.addEventListener('DOMContentLoaded',init);
