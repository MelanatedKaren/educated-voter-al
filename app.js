const counties=["Autauga","Baldwin","Barbour","Bibb","Blount","Bullock","Butler","Calhoun","Chambers","Cherokee","Chilton","Choctaw","Clarke","Clay","Cleburne","Coffee","Colbert","Conecuh","Coosa","Covington","Crenshaw","Cullman","Dale","Dallas","DeKalb","Elmore","Escambia","Etowah","Fayette","Franklin","Geneva","Greene","Hale","Henry","Houston","Jackson","Jefferson","Lamar","Lauderdale","Lawrence","Lee","Limestone","Lowndes","Macon","Madison","Marengo","Marion","Marshall","Mobile","Monroe","Montgomery","Morgan","Perry","Pickens","Pike","Randolph","Russell","Shelby","St. Clair","Sumter","Talladega","Tallapoosa","Tuscaloosa","Walker","Washington","Wilcox","Winston"];
const countyData={
  default:{
    text:"Use Alabama's official county lookup to find the Board of Registrars, Judge of Probate, Circuit Clerk, and Absentee Election Manager for this county.",
    links:[
      ["Find County Election Officials","https://www.sos.alabama.gov/city-county-lookup"],
      ["My Voting Information","https://myinfo.alabamavotes.gov/voterview"],
      ["Alabama Votes","https://www.sos.alabama.gov/alabama-votes"]
    ]
  },
  Montgomery:{
    text:"Montgomery County Election Center • 125 Washington Ave, Montgomery, AL 36104 • Election Center: (334) 832-7744",
    links:[
      ["Montgomery County Election Center","https://www.montgomeryvotesal.gov/"],
      ["Polling Location & Election Information","https://www.montgomeryvotesal.gov/"],
      ["My Voting Information","https://myinfo.alabamavotes.gov/voterview"]
    ]
  }
};

const select=document.getElementById("countySelect");
counties.forEach(c=>{const o=document.createElement("option");o.value=c;o.textContent=c+" County";select.appendChild(o)});
select.value="Montgomery";

function renderCounty(){
  const c=select.value;
  const d=countyData[c]||countyData.default;
  const links=d.links.map(([label,url])=>`<a href="${url}" target="_blank" rel="noopener">${label} →</a>`).join("");
  document.getElementById("countyCard").innerHTML=`<h3>${c} County</h3><p>${d.text}</p><div class="county-actions">${links}</div>`;
}
select.addEventListener("change",renderCounty);
renderCounty();

function updateCountdown(){
  const election=new Date("2026-11-03T07:00:00-06:00");
  const now=new Date();
  const days=Math.ceil((election-now)/(1000*60*60*24));
  const el=document.getElementById("countdown");
  if(days>1)el.textContent=`${days} days until the November 3 General Election`;
  else if(days===1)el.textContent="Election Day is tomorrow";
  else if(days===0)el.textContent="Election Day is today";
  else el.textContent="2026 General Election information";
}
updateCountdown();

document.getElementById("rideBtn").addEventListener("click",()=>document.getElementById("rideDialog").showModal());

document.querySelectorAll("[data-plan]").forEach(box=>{
  const key="ev-plan-"+box.dataset.plan;
  box.checked=localStorage.getItem(key)==="1";
  box.addEventListener("change",()=>localStorage.setItem(key,box.checked?"1":"0"));
});

let deferredPrompt;
const installBtn=document.getElementById("installBtn");
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;installBtn.hidden=false});
installBtn.addEventListener("click",async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;installBtn.hidden=true});

if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js"));