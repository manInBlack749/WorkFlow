const d = document

d.addEventListener("DOMContentLoaded",()=>{

const container = d.getElementById('container')

const en_t= document.getElementById("en-t");
const nav_b= document.getElementById("nav-b");

const matter=d.getElementById("matter")
const loader=d.getElementById('loader')
const exit=d.getElementById('exit')
/*button du menu*/
const main=d.querySelectorAll('.nav')
const icon=d.querySelectorAll('.main-icon')
let current_mat=null
/**** sous container****/

const f_container = d.getElementById("f-container")
const e_container = d.getElementById("e-container")
let current_container = e_container

/****element des tests***/

let currentLoadId=0
let index 
let score 
container.style.paddingBottom="12vh"
container.style.paddingTop="8vh"

/*****decoupe automatique****/
const cut=(t)=>{
      if(t.length <= 24) return t
      else{
        let r=""
        t.split("").map((c,i)=> r+=(i <= 18)? c :"")
        r +="..."
        return r
      }
}
const getLittle=(e)=>{
       e.style.fontSize="1rem"
}
const short=(l)=>{
      if(l.textContent.length > 10)
        l.style.fontSize="1rem"
}
const selectColor = (div) => {
  const text = div.textContent.trim().toLowerCase()
  
  let rgb
  
  if (text === "difficile") {
    rgb = "248, 113, 113" // red
  } else if (text === "moyen") {
    rgb = "251, 191, 36" // yellow
  } else if (text === "normale") {
    rgb = "74, 222, 128" // green
  } else {
    rgb = "59, 130, 246" // blue
  }
  
  // background semi-transparent
  div.style.backgroundColor = `rgba(${rgb},0.25)`
  
  // texte 100 % opaque
  div.style.webkitTextStroke = "0.4px rgba(0,0,0,0.35)"
  div.style.color = `rgb(${rgb})`
}
/****netoyage****/
const clearSubContainers = (type) => {
      if(type==="exo")
        e_container.innerHTML=""
      else 
        f_container.innerHTML=""
}
/******click sur bouton***/
const click = new Audio("sound/click.mp3")
/**"""dashboard****/
const fillInfo= ()=>{
      let loadId=++currentLoadId
      let block=d.createElement("div")
      let img= new Image("explose.png")
      let message=d.createElement("div")
      
      
      img.src="emoji/explose.png"
      message.innerText="cette section n'est pas dispo pour l'instant"
      
      img.className="result-img"
      message.className="dash-text"
      img.onload=()=>{
        if(loadId===currentLoadId){
        loader.style.display="none"
        container.append(img,message)
        }
      }
}
 /***generation des fiches*****/
const fillFiche= async () => {
      clearSubContainers("fiche")
      loadId=currentLoadId
      loader.style.display='block'
      let fiche_block = d.createElement('div')
      let lil_container=d.createElement('div')
      let block_1 = d.createElement('div')
      let block_2 = d.createElement('div')
      let state = d.createElement('div')
      let date = d.createElement('div')
      let plus_b = d.createElement('button')
      let plus = d.createElement('img')
      /*initialisation*/
      const data = await getData("data/fiche.json")
      
      if(loadId===currentLoadId){
      block_1.innerText =cut(data["title"])+" / "+data["matter"]
      
      fiche_block.id="fiche"
      
      state.innerText =data["apply"].length.toString()+ " questions"
      date.innerText =data["date"]
      plus.src = 'icon/menu-dots-vertical.svg'
      /*style*/
      fiche_block.classList.add('exo')
      block_1.classList.add('title')
      block_2.classList.add('info')
      state.classList.add('contry')
      date.classList.add('level')
      plus_b.classList.add('but')
      plus.classList.add('icon', 'option')
      /*imbrication*/
      plus_b.appendChild(plus)
      block_2.append(state, date, plus_b)
      fiche_block.append(block_1, block_2)
      f_container.appendChild(fiche_block)
      
      fiche_block.addEventListener("click",()=>{ click.currentTime=0;
               click.play()
               reset()
               openFiche(data)
               MathJax.typesetPromise([container])
      })
      }
      loader.style.display='none'
    }
/******generation des exos*****/
const fillExo= async () => {
      clearSubContainers("exo")
      loadId=currentLoadId
      loader.style.display='block'
      let exo_block = d.createElement('div')
      let block_1 = d.createElement('div')
      let block_2 = d.createElement('div')
      let contry = d.createElement('div')
      let level = d.createElement('div')
      let plus_b = d.createElement('button')
      let plus = d.createElement('img')
      /*initialisation*/
      const data= await getData("data/exo.json")
      console.log(data)
      if(loadId === currentLoadId){
      block_1.innerText =cut(data["title"])+" / "+data["matter"]
      
      exo_block.id="exo"
      
      contry.innerText =data["contry"]
      level.innerText = data["level"]
      plus.src = 'icon/menu-dots-vertical.svg'
      /*style*/
      exo_block.classList.add('exo')
      block_1.classList.add('title')
      block_2.classList.add('info')
      contry.classList.add('contry')
      level.classList.add('level')
      selectColor(level)
      plus_b.classList.add('but')
      plus.classList.add('icon', 'option')
     /*imbrication*/
      plus_b.appendChild(plus)
      block_2.append(contry, level, plus_b)
      exo_block.append(block_1, block_2)
      e_container.appendChild(exo_block)
      
     /*fonction*/
      exo_block.addEventListener("click",()=>{ click.currentTime = 0;
               click.play()
               reset()
               context_reset(2)
               openExo(data)
               MathJax.typesetPromise([container])
      })
      }
      loader.style.display='none'
  
}
/****ouverture des exos***/
const openExo=(data)=>{
      container.scrollTop=0
      const loadId=++currentLoadId
      //creation 
      exit.style.display="flex"
      let title= d.createElement('div') 
      let corrige=d.createElement('button')
      let corriges= []
      
      title.innerHTML=data["title"]+" "+data["matter"]+" "+data["contry"]
      corrige.innerText="corrigé"
      
      title.classList.add('exo-title')
      corrige.classList.add('corrige')
      
      container.append(title)
      
      for(let i = 0; i < data["problem"].length ;i++){
          let prob=data["problem"][i]
          let exos= d.createElement('div')
          let head=d.createElement('div')
          let body=d.createElement('div')
          let sep=d.createElement('div')
          head.innerHTML=prob["head"]
          body.innerHTML="<br>"+prob["body"]
          sep.innerHTML="<br><hr>"
          exos.classList.add("single-exo")
          head.classList.add("exo-head")
          
          exos.append(head,body,sep)
          container.append(exos)
      }
      container.append(corrige)
      for (let i = 0; i < data["solution"].length; i++) {
          let prob = data["solution"][i]
          let sols = d.createElement('div')
          let wrapSols=d.createElement('div')
          let head = d.createElement('div')
          let body = d.createElement('div')
          
          let scroll=d.createElement("div")
          let indice=d.createElement("div")
         // let sep = d.createElement('div')
          head.innerHTML = prob["head"]
          body.innerHTML = "<br>" + prob["body"]
          //sep.innerHTML = "<br><hr>"
          sols.classList.add("single-exo","single-sol")
          head.classList.add("exo-head")
          body.classList.add("sol-content")
          wrapSols.classList.add("sol-scroll")
          scroll.classList.add("scroll")
          indice.classList.add("indice")
          
          wrapSols.append(body)
          scroll.append(indice)
          sols.append(head, wrapSols)
          if (prob.plot || prob.geo) {
  
  // container principal
             const graphBox = d.createElement("div")
             graphBox.className = "graph-box"
             const canvas = d.createElement("canvas")
             canvas.className = "graph"
   // layer flou
             const flot_lay = d.createElement("div")
             flot_lay.className = "graph-flot"
   // bouton
             const voir = d.createElement("button")
             voir.className = "graph-btn"
             voir.textContent = "Voir"
             flot_lay.appendChild(voir)
           voir.addEventListener("click", () => {
              click.play() 
              currentTime=0
               // fond sombre
              const full = d.createElement("div")
              full.className = "full-graph"
              // boite blanche
              const box = d.createElement("div")
              box.className = "full-box"
             // bouton fermer
              const close = d.createElement("button")
              close.className = "close-full"
              close.innerText = "✕"
              
              close.onclick = () => full.remove()
             //canvas (clone)
              const bigCanvas = d.createElement("canvas")
              bigCanvas.style.width = "90%"
              bigCanvas.style.height = "90%"
              box.append(close, bigCanvas)
              full.append(box)
              d.body.append(full)
             // redraw courbe en grand
             if(prob.plot)
             drawGraph(bigCanvas, prob.plot)
             else
             drawGeo(bigCanvas, prob.geo)
          
        })
  
  // assembler
             graphBox.appendChild(canvas)
             graphBox.appendChild(flot_lay)
             sols.appendChild(graphBox)

  // draw graph
             drawGraph(canvas, prob.plot)
}
          sols.append(scroll)
          corriges.push(sols)
          container.append(sols)
      }
      
      MathJax.typesetPromise().then(() => {
  
  const wrappers = d.querySelectorAll(".sol-scroll")
  
  wrappers.forEach(w => {
    const content = w.querySelector(".sol-content")
    const indice = w.parentElement.querySelector(".indice")
    const scrollBar = w.parentElement.querySelector(".scroll")
    
    const updateAll = () => {
      
      /* ===== effet ChatGPT fade ===== */
      updateScrollFade(w)
      
      /* ===== déplacement boule ===== */
      const maxScroll = content.scrollWidth - content.clientWidth
      const current = content.scrollLeft
      
      if (maxScroll <= 0) {
        indice.style.opacity = "0"
        return
      } else {
        indice.style.opacity = "1"
      }
      
      const ratio = current / maxScroll
      
      const barWidth = scrollBar.clientWidth
      const dotSize = indice.clientWidth
      
      const pos = ratio * (barWidth - dotSize)
      
      indice.style.transform = `translateX(${pos}px)`
    }
    
    updateAll()
    content.addEventListener("scroll", updateAll)
    window.addEventListener("resize", updateAll)
  })
  
})
      corrige.addEventListener("click",()=>{
          swapColors(corrige)
          for(let s of corriges)
             s.style.display=
             (s.style.display === "flex") ? "none" :"flex"
      })
 
}
/*scroll dans block*/
function updateScrollFade(wrapper) {
  const content = wrapper.querySelector(".sol-content")
  
  const maxScroll = content.scrollWidth - content.clientWidth
  const current = content.scrollLeft
  
  // gauche
  if (current > 2) {
    wrapper.classList.add("show-left")
  } else {
    wrapper.classList.remove("show-left")
  }
  
  // droite
  if (current < maxScroll - 2) {
    wrapper.classList.add("show-right")
  } else {
    wrapper.classList.remove("show-right")
  }
}
/*** dessiner une courbe ***/
function drawGraph(canvas, funcString) {
  
  setTimeout(() => {
    
    canvas.width = 300
    canvas.height = 300
    
    const ctx = canvas.getContext("2d")
    
    const width = canvas.width
    const height = canvas.height
    
    const originX = width / 2
    const originY = height / 2
    const scale = Math.min(width, height) / 12
    const maxVal = 5
    
    ctx.clearRect(0, 0, width, height)
    
    /* ===== GRILLE ===== */
    ctx.strokeStyle = "#e0e0e0"
    ctx.lineWidth = 1
    
    for (let x = -maxVal; x <= maxVal; x++) {
      ctx.beginPath()
      ctx.moveTo(originX + x * scale, 0)
      ctx.lineTo(originX + x * scale, height)
      ctx.stroke()
    }
    
    for (let y = -maxVal; y <= maxVal; y++) {
      ctx.beginPath()
      ctx.moveTo(0, originY - y * scale)
      ctx.lineTo(width, originY - y * scale)
      ctx.stroke()
    }
    
    /* ===== AXES ===== */
    ctx.strokeStyle = "#000"
    ctx.lineWidth = 2
    
    ctx.beginPath()
    ctx.moveTo(0, originY)
    ctx.lineTo(width, originY)
    ctx.stroke()
    
    ctx.beginPath()
    ctx.moveTo(originX, 0)
    ctx.lineTo(originX, height)
    ctx.stroke()
    
    /* ===== NUMEROS ===== */
    ctx.fillStyle = "#000"
    ctx.font = "12px Arial"
    
    ctx.textAlign = "right"
    ctx.textBaseline = "middle"
    
    for (let y = -maxVal; y <= maxVal; y++) {
      if (y === 0) continue
      ctx.fillText(y, originX - 8, originY - y * scale)
    }
    
    ctx.textAlign = "center"
    ctx.textBaseline = "top"
    
    for (let x = -maxVal; x <= maxVal; x++) {
      if (x === 0) continue
      ctx.fillText(x, originX + x * scale, originY + 6)
    }
    
    ctx.fillText("O", originX - 5, originY + 5)
    
    /* ===== fonction ===== */
    let f
    try {
      f = new Function("x", "return " + funcString)
    } catch (e) {
      console.log("Erreur fonction")
      return
    }
    
    /* ===== courbe ===== */
    ctx.strokeStyle = "#2563eb"
    ctx.lineWidth = 2
    ctx.beginPath()
    
    let first = true
    
    for (let px = 0; px < width; px++) {
      
      let x = (px - originX) / scale
      let y
      
      try {
        y = f(x)
      } catch {
        continue
      }
      
      if (!isFinite(y)) continue
      
      let py = originY - y * scale
      
      if (first) {
        ctx.moveTo(px, py)
        first = false
      } else {
        ctx.lineTo(px, py)
      }
    }
    
    ctx.stroke()
    
  }, 100)
}
/***figure geometrique****/
function drawLabel(ctx, text, x, y, dx = 6, dy = -6) {
  ctx.fillStyle = "#000"
  ctx.font = "13px Arial"
  ctx.fillText(text, x + dx, y + dy)
}
function smartLabel(ctx, text, px, py, originX, originY) {
  
  ctx.fillStyle = "#000"
  ctx.font = "13px Arial"
  
  let dx = 6
  let dy = -6
  
  // gauche
  if (px < originX) dx = -12
  
  // droite
  if (px > originX) dx = 6
  
  // haut
  if (py < originY) dy = -6
  
  // bas
  if (py > originY) dy = 14
  
  ctx.fillText(text, px + dx, py + dy)
}
function drawGrid(ctx, width, height, originX, originY, scale) {
  ctx.strokeStyle = "#ddd"
  ctx.lineWidth = 1
  
  ctx.beginPath()
  
  // verticales
  for (let x = originX % scale; x < width; x += scale) {
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
  }
  
  // horizontales
  for (let y = originY % scale; y < height; y += scale) {
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
  }
  
  ctx.stroke()
}

function drawGeo(canvas, plotData) {
  setTimeout(() => {
    canvas.width = 320
    canvas.height = 320
    const ctx = canvas.getContext("2d")

    const w = canvas.width
    const h = canvas.height

    const originX = w / 2
    const originY = h / 2
    const scale = w / 12

    ctx.clearRect(0, 0, w, h)
    /// grille
    drawGrid(ctx,canvas.width,canvas.height,originX,originY,scale)

    //// ===== AXES =====
    ctx.strokeStyle = "#000"
    ctx.lineWidth = 2

    ctx.beginPath()
    ctx.moveTo(0, originY)
    ctx.lineTo(w, originY)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(originX, 0)
    ctx.lineTo(originX, h)
    ctx.stroke()

    //// ===== OBJETS =====
    const pts = {}

    ctx.font = "12px Arial"
    ctx.fillStyle = "#000"

    for (let obj of plotData.objects) {

      //// POINT
      if (obj.type === "point") {
         pts[obj.name] = { x: obj.x, y: obj.y }
  
         let px = originX + obj.x * scale
         let py = originY - obj.y * scale
  
         ctx.fillStyle = "#000"
         ctx.beginPath()
         ctx.arc(px, py, 4, 0, Math.PI * 2)
         ctx.fill()
  
         if (obj.label) {
            smartLabel(ctx, obj.label, px, py, originX, originY)
          }
       }

      //// SEGMENT
      if (obj.type === "segment") {
         let A = pts[obj.from]
         let B = pts[obj.to]

         let x1 = originX + A.x*scale
         let y1 = originY - A.y*scale
         let x2 = originX + B.x*scale
         let y2 = originY - B.y*scale

         ctx.strokeStyle="#000"
         ctx.beginPath()
         ctx.moveTo(x1,y1)
         ctx.lineTo(x2,y2)
         ctx.stroke()

       if (obj.label) {
  
  // milieu du vecteur
  let mx = (x1 + x2) / 2
  let my = (y1 + y2) / 2
  
  // décalage perpendiculaire (très important)
  let dx = x2 - x1
  let dy = y2 - y1
  let len = Math.sqrt(dx * dx + dy * dy)
  
  if (len !== 0) {
    dx /= len
    dy /= len
  }
  
  // perpendiculaire
  let offsetX = -dy * 14
  let offsetY = dx * 14
  
  smartLabel(
    ctx,
    obj.label,
    mx + offsetX,
    my + offsetY,
    originX,
    originY
  )
}
   }
// CERCLE 

if (obj.type === "circle") {
   let cx=originX+obj.center[0]*scale
   let cy=originY-obj.center[1]*scale
   let r=obj.r*scale

   ctx.strokeStyle="#007bff"
   ctx.beginPath()
   ctx.arc(cx,cy,r,0,Math.PI*2)
   ctx.stroke()

   if (obj.label) {
   smartLabel(ctx, obj.label,
    originX + obj.center[0] * scale,
    originY - obj.center[1] * scale - obj.r * scale,
    originX, originY)
}

}
//VECTEUR

if(obj.type==="vector"){
   let A=obj.from
   let B=obj.to

   let x1=originX+A[0]*scale
   let y1=originY-A[1]*scale
   let x2=originX+B[0]*scale
   let y2=originY-B[1]*scale

   ctx.strokeStyle="rgb(74, 222, 128)"
   ctx.beginPath()
   ctx.moveTo(x1,y1)
   ctx.lineTo(x2,y2)
   ctx.stroke()

  if (obj.label) {
  
  // milieu du vecteur
  let mx = (x1 + x2) / 2
  let my = (y1 + y2) / 2
  
  // décalage perpendiculaire (très important)
  let dx = x2 - x1
  let dy = y2 - y1
  let len = Math.sqrt(dx * dx + dy * dy)
  
  if (len !== 0) {
    dx /= len
    dy /= len
  }
  
  // perpendiculaire
  let offsetX = -dy * 14
  let offsetY = dx * 14
  
  smartLabel(
    ctx,
    obj.label,
    mx + offsetX,
    my + offsetY,
    originX,
    originY
  )
}
}
//ELLIPSE

if(obj.type==="ellipse"){
   let cx=originX+obj.x*scale
   let cy=originY-obj.y*scale

   ctx.strokeStyle="#FF3333"
   ctx.beginPath()
   ctx.ellipse(cx,cy,obj.rx*scale,obj.ry*scale,obj.rotation||0,0,Math.PI*2)
   ctx.stroke()

  if (obj.label) {
  smartLabel(ctx, obj.label,
    originX + obj.x * scale,
    originY - obj.y * scale - obj.ry * scale,
    originX, originY)
}
}
//COURBE

if(obj.type==="curve"){
   let f=new Function("x","return "+obj.func)

   ctx.strokeStyle="#007bff"
   ctx.beginPath()

   let first=true
   for(let px=-w/2;px<w/2;px++){
      let x=px/scale
      let y=f(x)

      let cx=originX+px
      let cy=originY-y*scale

      if(first){ctx.moveTo(cx,cy);first=false}
      else ctx.lineTo(cx,cy)
   }
   ctx.stroke()

   if(obj.label){
      smartLabel(ctx,obj.label,originX+w/4,originY-h/4,0,0)
   }
}

    }

  }, 60)
}

/****ouverture des fiches***/
const openFiche=(data)=>{
       const loadId=++currentLoadId
      //creation 
      exit.style.display="flex"
      let save=d.createElement("div")
      let title= d.createElement('div') 
      let apply=d.createElement('button')
      
      title.innerHTML=data["title"]+" "+data["matter"]+" "+data["date"]
      apply.innerText="appliquer"
      
      title.classList.add('exo-title')
      apply.classList.add('apply')
      
      container.append(title)
      console.log(data["body"])
      for(let i=0; i < data["body"].length;i++){
          let b = data["body"][i]
          let fiches = d.createElement('div')
          let head = d.createElement('div')
          let body = d.createElement('div')
          let sep = d.createElement('div')
          head.innerHTML = b["head"]
          body.innerHTML = "<br>"+b["body"]
          sep.innerHTML = "<br><hr>"
          fiches.classList.add("single-exo")
          head.classList.add("exo-head")

          fiches.append(head, body, sep)
          container.append(fiches)
      }
      container.append(apply)
      apply.addEventListener("click",()=>{
          click.currentTime = 0; click.play()
          swapColors(apply)
          openTest(data)
      })
      
}
const openTest = (data) => {
let currentTest = data["apply"]
let valider = d.createElement("button")
let continuer = d.createElement("button")
let quitter = d.createElement("button")
let valider_block = d.createElement("div")
let resultText = d.createElement("p")
let text = d.createElement("div")

/**** 🔊 SONS **/
const good = new Audio("sound/good.wav")
const bad = new Audio("sound/bad.wav")
const select = new Audio("sound/select.wav")
const completed = new Audio("sound/completed.wav")
const shake = new Audio("sound/shake.wav")
const matched= new Audio("sound/matched.wav")

good.volume="0.5"
bad.volume="0.5"
select.volume="0.5"
completed.volume="0.5"
shake.volume="0.5"
matched.volume="0.5"

valider.innerText = "valider"
continuer.innerText = "continuer"
quitter.innerText = "quitter"
let index = 0
let score = 0

text.className="test-text"
valider.className = continuer.className = quitter.className = "valider"
valider_block.className = "valider-block"
resultText.className = "result-text"

/* ================== UTILS ================== */
const choose = (el, i) => {
  if (!el) return
  el.style.backgroundColor = i === 1 ? "#5AEAF6" : "#fff"
  el.style.color = i === 1 ? "#fff" : "#000"
}
const clearContainer = () => {
  container.innerHTML = ""
  valider_block.innerHTML = ""
  valider_block.style.background = "#fff"
}
const updateProgress=(currentIndex, total)=>{
  // 1️⃣ Créer la barre si elle n'existe pas
    bar = document.createElement("div");
    bar.id = "progress-container";
    
    bar.innerHTML = `
      <div id="progress-info"></div>
      <div id="progress-bar">
        <div id="progress-fill"></div>
      </div>
    `;
    
    // Ajouter en haut de la page (ou dans ton container principal)
    container.append(bar);
  // 2️⃣ Calcul progression
  const percent = ((currentIndex + 1) / total) * 100;
  
  const fill = document.getElementById("progress-fill");
  const info = document.getElementById("progress-info");
  
  fill.style.width = percent + "%";
  info.textContent = `Étape ${currentIndex + 1} / ${total}`;
  
  // 3️⃣ Couleur dynamique
  if (percent < 40) {
    fill.style.background = "rgba(230,57,70,.5)"; // rouge
  } else if (percent < 70) {
    fill.style.background = "#f9a825"; // orange
  } else {
    fill.style.background = "rgba(46,204,113,.5)"; // vert
  }
  
  // 4️⃣ Message de fin
  if (currentIndex + 1 === total) {
    info.textContent = "Dernière étape 🎯";
  }
}
const loadTest = (test) => {
  clearContainer()
  updateProgress(index, currentTest.length);
  valider.onclick = null
  valider.disabled = false;// ✅ FIX anti double score
  switch (test.type) {
    case "QCM": QCM(test); break
    case "alternatif": alternatif(test); break
    case "rearrangement": rearrangement(test); break
    case "APPAREIMENT": appareiment(test); break
  }
}

/* ================== QCM ================== */
const QCM = (test) => {
  let big_block=d.createElement("div")
  let propos_block = d.createElement("div")
  let current_propos = null

  text.innerText = test.text
  getLittle(text)
  propos_block.className = "propos-block"
  big_block.className="big-propos"
  big_block.append(text,propos_block)

  test.propos.forEach((p, i) => {
    let btn = d.createElement("button")
    btn.textContent = p
    btn.className = "propos advance"
    short(btn)
    btn.onclick = () => {
      select.currentTime = 0; select.play() // 🔊
      choose(btn, 1)
      choose(current_propos, 2)
      current_propos = btn
    }

    propos_block.appendChild(btn)
  })

  valider.onclick = () => {
    if (!current_propos) {
      resultText.innerText = "Choisissez une option pour valider"
      valider_block.innerHTML = ""
      valider_block.append(resultText, valider)
      return
    }

    const valid = current_propos.textContent.trim() === test.res.trim()
    valider_block.innerHTML = ""

    if (valid) {
      good.currentTime = 0; good.play() // 🔊
      score++ // ✅ FIX (une seule fois)
      valider_block.style.background = "rgba(46,204,113,.5)"
      resultText.innerText = "✔️ Félicitations !"
    } else {
      bad.currentTime = 0; bad.play() // 🔊
      valider_block.style.background = "rgba(230,57,70,.5)"
      resultText.innerText = `❌ Faux. Réponse : "${test.res}"`
    }

    valider_block.append(resultText, continuer)
  }

  valider_block.innerHTML = ""
  valider_block.append(valider)
  container.append(big_block, valider_block)
}
/*===================APPAREIMENT==========*/
const paire = (el) => {
  matched.currentTime = 0; matched.play()
  el.classList.add("matched");
  el.style.backgroundColor = "rgba(46,204,113,.5)";
  
  el.offsetWidth
  
  setTimeout(() => {
    el.style.opacity = "0.3";
  }, 300);
};

const impaire = (el) => {
  shake.currentTime = 0; shake.play()
  el.classList.add("shake");
  el.style.backgroundColor = "rgba(230,57,70,.5)";
  void el.offsetWidth
  
  setTimeout(() => {
    el.style.opacity = "0.3"; 
  }, 400);
};

const appareiment = (tab) => {
  const block = d.createElement("div");
  const block_A = d.createElement("div");
  const block_B = d.createElement("div");
  
  let currentKey = null;
  let currentBtn = null;
  let lock = false;
  let level = tab.col_A.length;
  
  text.innerText = "Trouve les mots liés";
  getLittle(text)
  
  block.className = "appar-bigBlock";
  block_A.className = "appar-block";
  block_B.className = "appar-block";
  
  const createButton = (prop, left) => {
    if (!prop || !prop.value) {
      console.warn("proposition invalide", prop);
      return;
    }
    
    const bouton = d.createElement("button");
    bouton.innerText = prop.value;
    bouton.classList.add("propos","appar");
    short(bouton)
    bouton.addEventListener("click", () => {
      if (lock || bouton.classList.contains("matched")|| bouton.classList.contains("shake")) return;
      if (bouton === currentBtn) return;
      
      if (!currentKey) {
        currentKey = prop.key;
        currentBtn = bouton;
        bouton.classList.add("selected");
        return;
      }
      
      lock = true;
      
      if (currentKey === prop.key) {
        paire(bouton)
        paire(currentBtn)
        level--
      } else {
        impaire(bouton)
        impaire(currentBtn)
        level--
      }
      
      currentBtn.classList.remove("selected");
      currentKey = null;
      currentBtn = null;
      
      setTimeout(() => (lock = false), 400);
    });
    
    (left ? block_A : block_B).appendChild(bouton);
  };
  valider.onclick= () => {
  const found = d.querySelectorAll(".matched");
  const lost = d.querySelectorAll(".shake");
  
  const total = (found.length + lost.length) / 2;
  
  // si rien n'a été sélectionné ou incomplet
  if (total < tab.col_A.length) {
    resultText.innerText = "veillez terminer le test";
    valider_block.innerHTML = "";
    valider_block.append(resultText, valider);
    return;
  }
  
  // bloque le bouton pour ne pas cliquer plusieurs fois
  valider.disabled = true;
  
  // succès si tous les appariements sont corrects
  if (found.length / 2 === tab.col_A.length) {
    valider_block.style.background = "rgba(46,204,113,.5)";
    resultText.innerText = "✔️ Félicitations, tu comprends vite !";
    good.currentTime = 0;
    good.play(); // 🔊 son réussite
    score += 1; // incrément score une seule fois
  } else {
    valider_block.style.background = "rgba(230,57,70,.5)";
    resultText.innerText = "❌ Tu dois fournir des efforts";
    bad.currentTime = 0;
    bad.play(); // 🔊 son échec
  }
  
  valider_block.innerHTML = "";
  valider_block.append(resultText, continuer);
}

// création des boutons
tab.col_A.forEach(p => createButton(p, true));
tab.col_B.forEach(p => createButton(p, false));

// ajout des blocs
valider_block.append(valider)
container.append(text, block, valider_block);
container.append(valider_block)
block.append(block_A, block_B);
}
/* ================== REARRANGEMENT ================== */
const rearrangement = (test) => {
  const propos_block = d.createElement("div")
  const result_block = d.createElement("div")

  propos_block.className = "arrange-block"
  result_block.className = "arrange-result"
  text.innerText = test.text
  getLittle(text)

  const createLine = () => {
    const line = d.createElement("div")
    line.className = "arrange-line"
    result_block.appendChild(line)
    return line
  }

  let currentLine = createLine()

  test.propos.forEach(word => {
    const btn = d.createElement("button")
    btn.textContent = word
    btn.className = "propos arrange"

    btn.onclick = () => {
      select.currentTime = 0; select.play() // 🔊
      if (!result_block.contains(btn)) {
        currentLine.appendChild(btn)
        if (currentLine.scrollWidth > currentLine.clientWidth) {
          currentLine.removeChild(btn)
          currentLine = createLine()
          currentLine.appendChild(btn)
        }
      } else {
        propos_block.appendChild(btn)
      }
    }

    propos_block.appendChild(btn)
  })

  valider.onclick = () => {
    const resultat = [...result_block.querySelectorAll("button")]
      .map(b => b.textContent)
      .join(" ")
      .trim()

    if (!resultat) {
      resultText.innerText = "Choisissez une option pour valider"
      valider_block.innerHTML = ""
      valider_block.append(resultText, valider)
      return
    }

    valider_block.innerHTML = ""

    if (resultat === test.res.trim()) {
      good.currentTime = 0; good.play()
      score++
      valider_block.style.background = "rgba(46,204,113,.5)"
      resultText.innerText = "✔️ Bien joué !"
    } else {
      bad.currentTime = 0; bad.play()
      valider_block.style.background = "rgba(230,57,70,.5)"
      resultText.innerText = "❌ Mauvais ordre"
    }

    valider_block.append(resultText, continuer)
  }

  valider_block.innerHTML = ""
  valider_block.append(valider)
  container.append(text, result_block, propos_block, valider_block)
}

/* ================== ALTERNATIF ================== */
const alternatif = (tab) => {
  let big_block = d.createElement("div")
  let block = d.createElement("div")
  let vrai = d.createElement("button")
  let faux = d.createElement("button")
  let choice = null
 
  text.innerText = tab.text
  getLittle(text)
  vrai.innerText = "vrai"
  faux.innerText = "faux"

  vrai.className = faux.className = "propos altar"
  block.className="propos-block reduced"
  big_block.className="big-block"

  vrai.onclick = () => {
    select.currentTime = 0; select.play()
    choose(vrai,1); choose(faux,2)
    choice = vrai
  }

  faux.onclick = () => {
    select.currentTime = 0; select.play()
    choose(faux,1); choose(vrai,2)
    choice = faux
  }

  valider.onclick = () => {
    if (!choice) {
      resultText.innerText = "Choisissez une option"
      valider_block.innerHTML = ""
      valider_block.append(resultText, valider)
      return
    }

    const valid = choice.textContent.trim() === tab.res.trim()
    valider_block.innerHTML = ""

    if (valid) {
      good.currentTime = 0; good.play()
      score++
      valider_block.style.background = "rgba(46,204,113,.5)"
      resultText.innerText = "✔️ Correct"
    } else {
      bad.currentTime = 0; bad.play()
      valider_block.style.background = "rgba(230,57,70,.5)"
      resultText.innerText = "❌ Faux"
    }

    valider_block.append(resultText, continuer)
  }

  block.append(vrai, faux)
  valider_block.innerHTML = ""
  valider_block.append(valider)
  big_block.append(text,block)
  container.append(big_block, valider_block)
}

/* ================== NAVIGATION ================== */
continuer.onclick = () => {
  valider_block.innerHTML = ""
  text.style.fontSize="50px"
  reset()
  if (index < currentTest.length) loadTest(currentTest[index++])
  else loadResult(score)
}

quitter.onclick = () => {
  reset()
  openFiche(data)
}

/* ================== RESULTAT FINAL ================== */
const loadResult = (score) => {
  reset()
  const loadId=++currentLoadId
  loader.style.display = "block"

  const result = d.createElement("div")
  const img = new Image()
  const score_text = d.createElement("div")
  const message = d.createElement("div")
  const total = currentTest.length

  result.className = "result"
  img.className="result-img"
  score_text.className = "result score"
  message.className = "message"

  result.textContent = "Vous avez obtenu"
  score_text.textContent = score + "/"+total

  if (score <= Math.floor(total/2)) {
    message.textContent = "Chapitre non maîtrisé"
    img.src = "emoji/nul.png"
  } else if (score > Math.floor(total/2) && score < total) {
    message.textContent = "Bon travail"
    img.src = "emoji/bon.png"
  } else if(score === total) {
    message.textContent = "Parfait 🔥"
    img.src = "emoji/perfect.png"
  }

  img.onload = () => {
    if(loadId===currentLoadId) {
    loader.style.display = "none"
    container.append(result, img, score_text, message, quitter)
    if (score > (total/2)) { completed.currentTime = 0; completed.play() }
    else{completed.currentTime = 0; bad.play()}
    }
  }
}

loadTest(currentTest[index++])
}

/****bouton du menu******/
let current=null
for(let i=0; i<main.length ; i++){
  let elements=12
   main[i].addEventListener('click',async()=>{
     click.currentTime = 0; click.play()
     //style
     anim_menu(main[current],icon[current],2)
     anim_menu(main[i],icon[i],1)
     current=i
     //fonction
     reset()
     currentLoadId++
     if(main[i].id==="user-b"){
       fillInfo()
     }else if(main[i].id==='exo-b'){
          container.append(e_container)
          current_container=e_container
          for (let j = 0; j < elements; j++){
               fillExo()
          }
     }else if(main[i].id==='fiche-b'){
           container.append(f_container)
           current_container=f_container
          for (let j = 0; j < elements; j++){
            fillFiche()
          }
         
     }
   })
      
}
const anim_menu=(main,icon,i)=>{
      if (i === 1) {
         main.style.opacity = "1"
         icon.src = icon.src.replace('icon', 'full-icon')
      }else if(main){
         main.style.opacity = "0.5"
         icon.src = icon.src.replace('full-icon', 'icon')
}
}
/*****Reset*******/
const reset = () => {
  container.innerHTML=""
  exit.style.display = "none"
  container.append(loader, exit)
  current_container.scrollTop = 0
}
const context_reset=(i)=>{
      if(i===1){
        d.body.classList.remove("exo-open")
      }else{
        d.body.classList.add("exo-open")
      }
}
/******chagment dr couleurs****/
const swapColors= (elem)=>{
      const styles = getComputedStyle(elem)
      const cl=styles.color
      const bg=styles.backgroundColor
      
      elem.style.color=bg
      elem.style.backgroundColor=cl
  
}
/*******recuperation du contenu ******/
const getData= async(route,id)=>{
      try{
        const response= await fetch(route)
        if(response.status !=200){
          throw new Error("la rêquette a echoué code: "+ response.status)
        }
        const data= await response.json()
        if(id)
        { 
          return data.find(d=>{d["id"]===id})
        }
        else{
          let index=Math.floor(Math.random()*data.length)
          console.log("data est " + data)
          return data[index]
        }
      } catch (err){
        console.log(err.message)
      }
}
exit.onclick=()=>{
     click.currentTime = 0;click.play()
     exit.style.display="none"
     context_reset(1)
     if(main[current] !== null)
     main[current].click()
}
for (let i of main) {
  if (i.id === "exo-b")
    i.click()
}
})

let current_mat=undefined
Array.from(matter.children).map(c=>{
    c.addEventListener("click",()=>{
      console.log("ok ça entre")
      if(current_mat){
         current_mat.style.color="#000"
         current_mat.style.backgroundColor="#fff"
      }

      current_mat=c
      current_mat.style.color="#fff"
      current_mat.style.backgroundColor="#000"
      current_mat.style.border="none"
    })
    if(c.textContent==="Tous")
       c.click()
})

function setAppHeight() {
  const vh = window.innerHeight * 0.01;
  document.d.Element.style.setProperty('--vh', `${vh}px`);
}

setAppHeight();
window.addEventListener('resize', setAppHeight);



/*******app******/
