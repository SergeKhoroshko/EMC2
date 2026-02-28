import{g as n,r as o,o as l,i as g,a as v,b as m,c as p}from"./assets/exercise-modal-L2vpooXt.js";/* empty css                      */function i(){const a=document.getElementById("favoritesGrid"),r=document.getElementById("favoritesEmpty");if(!a||!r)return;const t=n();if(t.length===0){a.innerHTML="",r.hidden=!1;return}r.hidden=!0,a.innerHTML=t.map(e=>`
    <li class="exercise-card">
      <div class="exercise-card-top">
        <span class="exercise-card-badge">Workout</span>
        <span class="exercise-card-rating">
          ${Number(e.rating??0).toFixed(1)}
          <svg class="exercise-card-star" width="14" height="14" aria-hidden="true">
            <use href="./img/sprite.svg#icon-star"></use>
          </svg>
        </span>
      </div>
      <h3 class="exercise-card-name">${s(e.name)}</h3>
      <div class="exercise-card-meta">
        <div class="exercise-card-meta-item">
          <span class="exercise-card-meta-label">Body part</span>
          <span class="exercise-card-meta-val">${s(e.bodyPart??"—")}</span>
        </div>
        <div class="exercise-card-meta-item">
          <span class="exercise-card-meta-label">Target</span>
          <span class="exercise-card-meta-val">${s(e.target??"—")}</span>
        </div>
      </div>
      <div class="exercise-card-bottom">
        <div class="exercise-card-stats">
          <span class="exercise-card-stat">
            <svg width="14" height="14" aria-hidden="true"><use href="./img/sprite.svg#icon-fire"></use></svg>
            ${e.burnedCalories??0} kcal
          </span>
          <span class="exercise-card-stat">
            <svg width="14" height="14" aria-hidden="true"><use href="./img/sprite.svg#icon-clock"></use></svg>
            ${e.time??0} min
          </span>
        </div>
        <div style="display:flex;gap:8px;align-items:center">
          <button class="exercise-card-remove" data-remove="${s(e._id)}"
            type="button" aria-label="Remove ${s(e.name)} from favorites">
            <svg width="16" height="16" aria-hidden="true"><use href="./img/sprite.svg#icon-trash"></use></svg>
          </button>
          <button class="exercise-card-start" data-id="${s(e._id)}" type="button"
            aria-label="View details of ${s(e.name)}">
            Start
            <svg width="14" height="14" aria-hidden="true"><use href="./img/sprite.svg#icon-arrow-right"></use></svg>
          </button>
        </div>
      </div>
    </li>
  `).join("");const d=new Map(t.map(e=>[e._id,e]));a.querySelectorAll(".exercise-card-remove").forEach(e=>{e.addEventListener("click",()=>{o(e.dataset.remove),i()})}),a.querySelectorAll(".exercise-card-start").forEach(e=>{e.addEventListener("click",()=>{const c=d.get(e.dataset.id);c&&l(c)})})}function s(a){return String(a??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}document.addEventListener("DOMContentLoaded",()=>{g(),v(),m(),p(i,!0),i()});
//# sourceMappingURL=page-2.js.map
