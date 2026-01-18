const d = document;

d.addEventListener("DOMContentLoaded", () => {
  const container = d.getElementById('container');
  const loader = d.getElementById('loader');
  const exit = d.getElementById('exit');
  const main = d.querySelectorAll('.nav');
  const icon = d.querySelectorAll('.main-icon');

  /*** TESTS ET VARIABLES GLOBALES ***/
  let currentLoadId = 0;
  let index;
  let score;
  let currentTest;

  /*** CONSTANTES ***/
  const BOTTOM_SPACE_VH = 8;

  /*** UTILS ***/
  const cut = (t) => {
    if(t.length <= 24) return t;
    let r = "";
    t.split("").map((c, i) => r += (i <= 18) ? c : "");
    r += "...";
    return r;
  };

  const getLittle = (e) => { e.style.fontSize = "1rem"; };
  const short = (l) => { if(l.textContent.length > 10) l.style.fontSize = "1rem"; };

  /*** AUDIO ***/
  const click = new Audio("sound/click.mp3");
  const good = new Audio("sound/good.wav");
  const bad = new Audio("sound/bad.wav");
  const select = new Audio("sound/select.wav");
  const completed = new Audio("sound/completed.wav");
  const shake = new Audio("sound/shake.wav");
  const matched = new Audio("sound/matched.wav");

  good.volume = bad.volume = select.volume = completed.volume = shake.volume = matched.volume = 0.5;

  /*** SPACER BAS POUR NAV-B ***/
  const addBottomSpace = () => {
    const old = container.querySelector('[data-bottom-space]');
    if (old) old.remove();

    const spacer = d.createElement("div");
    spacer.dataset.bottomSpace = "true";
    spacer.style.height = BOTTOM_SPACE_VH + "vh";
    spacer.style.width = "100%";
    spacer.style.flexShrink = "0";

    container.appendChild(spacer);
  };

  /*** RESET CONTAINER ***/
  const reset = () => {
    exit.style.display = "none";
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.append(loader, exit);
    addBottomSpace();
    container.scrollTop = 0;
  };

  /*** RÉCUPÉRATION DES DONNÉES ***/
  const getData = async (route, id) => {
    try {
      const response = await fetch(route);
      if(response.status != 200) throw new Error("La requête a échoué code: " + response.status);
      const data = await response.json();
      if(id) return data.find(d => d["id"] === id);
      else {
        let index = Math.floor(Math.random() * data.length);
        return data[index];
      }
    } catch (err) { console.log(err.message); }
  };

  /*** DASHBOARD ***/
  const fillInfo = async () => {
    const loadId = ++currentLoadId;
    loader.style.display = "block";
    let img = new Image();
    let message = d.createElement("div");
    img.src = "emoji/explose.png";
    message.innerText = "Cette section n'est pas dispo pour l'instant";
    img.className = "result-img";
    message.className = "dash-text";

    img.onload = () => {
      if(loadId !== currentLoadId) return;
      loader.style.display = "none";
      container.append(img, message);
      addBottomSpace();
    };
  };

  /*** FICHES ***/
  const fillFiche = async () => {
    const loadId = ++currentLoadId;
    loader.style.display = "block";
    const data = await getData("data/fiche.json");

    if(loadId !== currentLoadId) return;

    let fiche_block = d.createElement('div');
    let block_1 = d.createElement('div');
    let block_2 = d.createElement('div');
    let state = d.createElement('div');
    let date = d.createElement('div');
    let plus_b = d.createElement('button');
    let plus = d.createElement('img');

    block_1.innerText = cut(data["title"]) + " / " + data["matter"];
    state.innerText = data["apply"].length.toString() + " questions";
    date.innerText = data["date"];
    plus.src = 'icon/menu-dots-vertical.svg';

    fiche_block.classList.add('exo');
    block_1.classList.add('title');
    block_2.classList.add('info');
    state.classList.add('contry');
    date.classList.add('level');
    plus_b.classList.add('but');
    plus.classList.add('icon', 'option');

    plus_b.appendChild(plus);
    block_2.append(state, date, plus_b);
    fiche_block.append(block_1, block_2);
    container.appendChild(fiche_block);
    addBottomSpace();

    fiche_block.addEventListener("click", () => {
      click.currentTime = 0;
      click.play();
      reset();
      openFiche(data);
    });

    loader.style.display = 'none';
  };

  /*** EXOS ***/
  const fillExo = async () => {
    const loadId = ++currentLoadId;
    loader.style.display = 'block';
    const data = await getData("data/exo.json");

    if(loadId !== currentLoadId) return;

    let exo_block = d.createElement('div');
    let block_1 = d.createElement('div');
    let block_2 = d.createElement('div');
    let contry = d.createElement('div');
    let level = d.createElement('div');
    let plus_b = d.createElement('button');
    let plus = d.createElement('img');

    block_1.innerText = cut(data["title"]) + " / " + data["matter"];
    contry.innerText = data["contry"];
    level.innerText = data["level"];
    plus.src = 'icon/menu-dots-vertical.svg';

    exo_block.classList.add('exo');
    block_1.classList.add('title');
    block_2.classList.add('info');
    contry.classList.add('contry');
    level.classList.add('level');
    plus_b.classList.add('but');
    plus.classList.add('icon', 'option');

    plus_b.appendChild(plus);
    block_2.append(contry, level, plus_b);
    exo_block.append(block_1, block_2);
    container.appendChild(exo_block);
    addBottomSpace();

    exo_block.addEventListener("click", () => {
      click.currentTime = 0;
      click.play();
      reset();
      openExo(data);
    });

    loader.style.display = 'none';
  };

  /*** OUVERTURE FICHES ***/
  const openFiche = (data) => {
    exit.style.display = "flex";
    let title = d.createElement('div');
    let apply = d.createElement('button');

    title.innerHTML = data["title"] + " " + data["matter"] + " " + data["date"];
    apply.innerText = "appliquer";
    title.classList.add('exo-title');
    apply.classList.add('apply');

    container.append(title);

    data["body"].forEach(b => {
      let fiches = d.createElement('div');
      let head = d.createElement('div');
      let body = d.createElement('div');
      let sep = d.createElement('div');

      head.innerHTML = b["head"];
      body.innerHTML = "<br>" + b["body"];
      sep.innerHTML = "<br><hr>";

      fiches.classList.add("single-exo");
      head.classList.add("exo-head");

      fiches.append(head, body, sep);
      container.append(fiches);
    });

    container.append(apply);
    addBottomSpace();

    apply.addEventListener("click", () => {
      click.currentTime = 0;
      click.play();
      openTest(data);
    });
  };

  /*** OUVERTURE EXOS ***/
  const openExo = (data) => {
    exit.style.display = "flex";
    let title = d.createElement('div');
    let corrige = d.createElement('button');
    let corriges = [];

    title.innerHTML = data["title"] + " " + data["matter"] + " " + data["contry"];
    corrige.innerText = "corrigé";

    title.classList.add('exo-title');
    corrige.classList.add('corrige');

    container.append(title);

    data["problem"].forEach(prob => {
      let exos = d.createElement('div');
      let head = d.createElement('div');
      let body = d.createElement('div');
      let sep = d.createElement('div');

      head.innerHTML = prob["head"];
      body.innerHTML = "<br>" + prob["body"];
      sep.innerHTML = "<br><hr>";

      exos.classList.add("single-exo");
      head.classList.add("exo-head");

      exos.append(head, body, sep);
      container.append(exos);
    });

    container.append(corrige);
    data["solution"].forEach(prob => {
      let sols = d.createElement('div');
      let head = d.createElement('div');
      let body = d.createElement('div');

      head.innerHTML = prob["head"];
      body.innerHTML = "<br>" + prob["body"];

      sols.classList.add("single-exo", "single-sol");
      head.classList.add("exo-head");

      sols.append(head, body);
      corriges.push(sols);
      container.append(sols);
    });

    addBottomSpace();

    corrige.addEventListener("click", () => {
      swapColors(corrige);
      corriges.forEach(s => {
        s.style.display = (s.style.display === "block") ? "none" : "block";
      });
    });
  };

  /*** BOUTONS NAV ***/
  let current = null;
  main.forEach((btn, i) => {
    btn.addEventListener('click', async () => {
      click.currentTime = 0; click.play();

      if(current !== null) anim_menu(main[current], icon[current], 2);
      anim_menu(main[i], icon[i], 1);
      current = i;

      reset();
      currentLoadId++;

      if(btn.id === "user-b") fillInfo();
      else {
        for(let j = 0; j < 12; j++) {
          if(btn.id === 'exo-b') fillExo();
          else if(btn.id === 'fiche-b') fillFiche();
        }
      }
    });
  });

  const anim_menu = (main, icon, i) => {
    if(i === 1) {
      main.style.opacity = "1";
      icon.src = icon.src.replace('icon', 'full-icon');
    } else if(main) {
      main.style.opacity = "0.5";
      icon.src = icon.src.replace('full-icon', 'icon');
    }
  };

  /*** EXIT ***/
  exit.onclick = () => {
    click.currentTime = 0; click.play();
    exit.style.display = "none";
    if(current !== null) main[current].click();
  };

  /*** AUTO CLICK EXO AU DÉPART ***/
  main.forEach(i => { if(i.id === "exo-b") i.click(); });
});
