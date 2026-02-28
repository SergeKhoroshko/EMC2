import{d as T,f as q,e as H,h as I,j as S,o as A,i as F,a as Q,b as j,c as N}from"./assets/exercise-modal-L2vpooXt.js";/* empty css                      */function E({author:e,quote:t}){const a=document.getElementById("quoteBlock");a&&(a.innerHTML=`
    <p class="quote-text">${k(t)}</p>
    <p class="quote-author">— ${k(e)}</p>
  `)}async function R(){const e=T();if(e){E(e);return}try{const t=await q();H(t),E(t)}catch(t){console.error("Failed to load quote:",t);const a=document.getElementById("quoteBlock");a&&(a.innerHTML=`<p class="quote-text" style="font-style:normal;color:var(--color-text-muted)">
        "The secret of getting ahead is getting started."</p>
        <p class="quote-author">— Mark Twain</p>`)}}function k(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function $({currentPage:e,totalPages:t,onPageChange:a}){const s=document.getElementById("pagination");if(s){if(t<=1){s.hidden=!0,s.innerHTML="";return}s.hidden=!1,s.innerHTML=G(e,t),s.querySelectorAll(".pagination-btn[data-page]").forEach(n=>{n.addEventListener("click",()=>{const g=parseInt(n.dataset.page,10);!isNaN(g)&&g!==e&&a(g)})})}}function G(e,t){const a=W(e,t);let s="";s+=`<button class="pagination-btn" data-page="${e-1}"
    aria-label="Previous page" ${e===1?"disabled":""}>
    <svg width="20" height="20" aria-hidden="true"><use href="./img/sprite.svg#icon-arrow-left"></use></svg>
  </button>`;for(const n of a)n==="..."?s+='<span class="pagination-ellipsis" aria-hidden="true">…</span>':s+=`<button class="pagination-btn ${n===e?"active":""}"
        data-page="${n}" aria-label="Page ${n}" aria-current="${n===e?"page":"false"}">
        ${n}
      </button>`;return s+=`<button class="pagination-btn" data-page="${e+1}"
    aria-label="Next page" ${e===t?"disabled":""}>
    <svg width="20" height="20" aria-hidden="true"><use href="./img/sprite.svg#icon-arrow-right"></use></svg>
  </button>`,s}function W(e,t){if(t<=7)return Array.from({length:t},(o,m)=>m+1);const a=[],s=1,n=new Set([1,t]);for(let o=Math.max(2,e-s);o<=Math.min(t-1,e+s);o++)n.add(o);const g=[...n].sort((o,m)=>o-m);let x=0;for(const o of g)o-x>1&&a.push("..."),a.push(o),x=o;return a}const r={filter:"Muscles",category:null,categoryPage:1,exercisePage:1,keyword:"",totalCategoryPages:0,totalExercisePages:0},l=document.getElementById("cardsGrid"),d=document.getElementById("cardsEmpty"),L=document.getElementById("workoutControls"),f=document.querySelector(".workout-breadcrumb"),P=document.getElementById("breadcrumbCurrent"),p=document.getElementById("backBtn"),h=document.getElementById("searchForm"),c=document.getElementById("searchInput");async function _(){var e;(e=document.getElementById("filterTabs"))==null||e.addEventListener("click",D),p==null||p.addEventListener("click",y),h==null||h.addEventListener("submit",t=>{t.preventDefault();const a=(c==null?void 0:c.value.trim())??"";if(r.keyword=a,r.exercisePage=1,!a){y();return}r.category||(L.hidden=!1,u(!1)),b()}),await v()}function D(e){const t=e.target.closest(".filter-tab");t&&(document.querySelectorAll(".filter-tab").forEach(a=>{a.classList.remove("active"),a.setAttribute("aria-selected","false")}),t.classList.add("active"),t.setAttribute("aria-selected","true"),r.filter=t.dataset.filter,r.category=null,r.categoryPage=1,r.keyword="",y())}async function v(){u(!1),C();try{const e=w(),t=await I({filter:r.filter,page:r.categoryPage,limit:e});r.totalCategoryPages=t.totalPages,U(t.results),$({currentPage:r.categoryPage,totalPages:r.totalCategoryPages,onPageChange:a=>{r.categoryPage=a,v(),B()}})}catch(e){console.error("Failed to load categories:",e),M("Could not load categories. Please try again later.")}}async function b(){C();try{const e=w(),t={keyword:r.keyword||void 0,page:r.exercisePage,limit:e};r.category&&(t[V(r.filter)]=r.category.name);const a=await S(t);r.totalExercisePages=a.totalPages,a.results.length===0?(l.innerHTML="",d.hidden=!1):(d.hidden=!0,z(a.results)),$({currentPage:r.exercisePage,totalPages:r.totalExercisePages,onPageChange:s=>{r.exercisePage=s,b(),B()}})}catch(e){console.error("Failed to load exercises:",e),M("Could not load exercises. Please try again.")}}function U(e){d.hidden=!0,l.innerHTML=e.map(t=>`
    <li class="category-card" tabindex="0"
        data-name="${i(t.name)}"
        data-filter="${i(t.filter)}"
        role="button"
        aria-label="Filter by ${i(t.name)}">
      ${t.imgURL?`<img class="category-card-img" src="${i(t.imgURL)}" alt="${i(t.name)}" loading="lazy" />`:'<div class="category-card-img" style="background:var(--color-surface-2)"></div>'}
      <div class="category-card-overlay">
        <span class="category-card-filter">${i(t.filter)}</span>
        <span class="category-card-name">${i(t.name)}</span>
      </div>
    </li>
  `).join(""),l.querySelectorAll(".category-card").forEach(t=>{const a=()=>{r.category={filter:t.dataset.filter,name:t.dataset.name},r.exercisePage=1,r.keyword="",c&&(c.value=""),O()};t.addEventListener("click",a),t.addEventListener("keydown",s=>{(s.key==="Enter"||s.key===" ")&&a()})})}function z(e){l.innerHTML=e.map(a=>`
    <li class="exercise-card">
      <div class="exercise-card-top">
        <span class="exercise-card-badge">Workout</span>
        <span class="exercise-card-rating">
          ${Number(a.rating).toFixed(1)}
          <svg class="exercise-card-star" width="14" height="14" aria-hidden="true">
            <use href="./img/sprite.svg#icon-star"></use>
          </svg>
        </span>
      </div>
      <h3 class="exercise-card-name">${i(a.name)}</h3>
      <div class="exercise-card-meta">
        <div class="exercise-card-meta-item">
          <span class="exercise-card-meta-label">Body part</span>
          <span class="exercise-card-meta-val">${i(a.bodyPart??"—")}</span>
        </div>
        <div class="exercise-card-meta-item">
          <span class="exercise-card-meta-label">Target</span>
          <span class="exercise-card-meta-val">${i(a.target??"—")}</span>
        </div>
      </div>
      <div class="exercise-card-bottom">
        <div class="exercise-card-stats">
          <span class="exercise-card-stat">
            <svg width="14" height="14" aria-hidden="true"><use href="./img/sprite.svg#icon-fire"></use></svg>
            ${a.burnedCalories??0} kcal
          </span>
          <span class="exercise-card-stat">
            <svg width="14" height="14" aria-hidden="true"><use href="./img/sprite.svg#icon-clock"></use></svg>
            ${a.time??0} min
          </span>
        </div>
        <button class="exercise-card-start" data-id="${i(a._id)}" type="button"
          aria-label="Start ${i(a.name)}">
          Start
          <svg width="14" height="14" aria-hidden="true"><use href="./img/sprite.svg#icon-arrow-right"></use></svg>
        </button>
      </div>
    </li>
  `).join("");const t=new Map(e.map(a=>[a._id,a]));l.querySelectorAll(".exercise-card-start").forEach(a=>{a.addEventListener("click",()=>{const s=t.get(a.dataset.id);s&&A(s)})})}function O(){var e;L.hidden=!1,u(!0),P&&(P.textContent=((e=r.category)==null?void 0:e.name)??""),b()}function y(){r.category=null,r.keyword="",r.exercisePage=1,c&&(c.value=""),u(!1),v()}function u(e){f&&(e?f.removeAttribute("hidden"):f.setAttribute("hidden",""))}function C(){const e=w();l.innerHTML=Array.from({length:e},()=>`
    <li class="card-skeleton">
      <div class="skeleton-line short"></div>
      <div class="skeleton-line medium"></div>
      <div class="skeleton-line long"></div>
    </li>
  `).join(""),d.hidden=!0}function M(e){l.innerHTML="",d.hidden=!1,d.textContent=e}function B(){var e;(e=document.getElementById("workoutSection"))==null||e.scrollIntoView({behavior:"smooth",block:"start"})}function w(){const e=window.innerWidth;return e>=1200?9:e>=768?8:4}function V(e){return{Muscles:"muscles","Body parts":"bodypart",Equipment:"equipment"}[e]??"muscles"}function i(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}document.addEventListener("DOMContentLoaded",async()=>{F(),Q(),j(),N(null,!1),R(),await _()});
//# sourceMappingURL=index.js.map
