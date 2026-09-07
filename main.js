const posts = [
  {id:"p1",title:"8 AI Tools Every Marketer Needs Next Year",platforms:["Blog"],status:"draft"},
  {id:"p2",title:"10 AI Trends Reshaping Content Teams",platforms:["Blog","Social"],status:"draft"},
  {id:"p3",title:"Behind the Scenes: Our Content Pipeline",platforms:["Instagram"],status:"draft"},
  {id:"p4",title:"The Future of SEO: What Changes This Year",platforms:["Blog","YouTube"],status:"scheduled"},
  {id:"p5",title:"Weekly Roundup: Automation Wins",platforms:["Social","Facebook"],status:"scheduled"},
  {id:"p6",title:"Content Automation, Demystified",platforms:["YouTube"],status:"published"},
  {id:"p7",title:"Repurposing One Article Into Six Posts",platforms:["Blog","Instagram"],status:"published"}
];

const order=["draft","scheduled","published"];
const labels={draft:"Drafts",scheduled:"Scheduled",published:"Published"};
let toastTimer;

function showToast(message){
  const toast=document.getElementById("toast");
  toast.querySelector("span").textContent=message;
  toast.hidden=false;
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>toast.hidden=true,2400);
}

function renderPosts(){
  order.forEach(status=>{
    const container=document.getElementById(status==="draft"?"drafts":status);
    container.innerHTML="";
    posts.filter(p=>p.status===status).forEach(post=>{
      const card=document.createElement("article");
      card.className="post-card";
      const nextIndex=order.indexOf(post.status)+1;
      const next=order[nextIndex];
      const platformHTML=post.platforms.map(p=>`<span class="platform" title="${p}">${p.slice(0,2).toUpperCase()}</span>`).join("");
      card.innerHTML=`<p>${post.title}</p><div class="post-footer"><div class="platforms">${platformHTML}</div>${next?`<button class="advance" data-id="${post.id}">${labels[next]} →</button>`:""}</div>`;
      container.appendChild(card);
    });
  });
  updateCounts();
}

function updateCounts(){
  order.forEach(status=>{
    const count=posts.filter(p=>p.status===status).length;
    const ids={draft:"draft",scheduled:"scheduled",published:"published"};
    document.getElementById(`${ids[status]}-count`).textContent=count;
    document.getElementById(`${ids[status]}-column-count`).textContent=count;
  });
}

document.addEventListener("click",event=>{
  const advance=event.target.closest(".advance");
  if(advance){
    const post=posts.find(p=>p.id===advance.dataset.id);
    const index=order.indexOf(post.status);
    if(index<order.length-1){post.status=order[index+1];renderPosts();showToast("Post moved to the next stage.");}
  }

  const action=event.target.closest("[data-toast]");
  if(action) showToast(action.dataset.toast);

  if(event.target.closest("#new-post")) showToast("Draft slot ready in the Drafts column.");

  const suggestion=event.target.closest("[data-suggestion]");
  if(suggestion){
    const index=Number(suggestion.dataset.suggestion);
    const editable=document.querySelectorAll(".editable")[index];
    const applied=editable.classList.toggle("applied");
    editable.textContent=applied?editable.dataset.revision:editable.dataset.original;
    suggestion.classList.toggle("applied",applied);
    suggestion.textContent=applied?"✓ Applied":"Apply →";
    const count=document.querySelectorAll(".editable.applied").length;
    document.getElementById("review-count").textContent=`${count}/3 applied`;
  }
});

const menu=document.getElementById("main-nav");
const toggle=document.getElementById("menu-toggle");
toggle.addEventListener("click",()=>{
  const open=menu.classList.toggle("open");
  toggle.setAttribute("aria-expanded",String(open));
  toggle.setAttribute("aria-label",open?"Close navigation":"Open navigation");
  toggle.textContent=open?"×":"☰";
});
document.querySelectorAll(".main-nav a").forEach(a=>a.addEventListener("click",()=>{
  menu.classList.remove("open");
  toggle.setAttribute("aria-expanded","false");
  toggle.setAttribute("aria-label","Open navigation");
  toggle.textContent="☰";
}));

if("IntersectionObserver" in window){
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.style.animation="rise .55s ease both";observer.unobserve(entry.target);}
    });
  },{threshold:.08});
  document.querySelectorAll(".feature-card,.panel,.stat-card").forEach(el=>observer.observe(el));
}

renderPosts();
