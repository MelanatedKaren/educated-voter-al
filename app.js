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

// Local resource navigator — no personal data is collected or sent to a server.
(function initResourceBot(){
  const form=document.getElementById("botForm");
  const answer=document.getElementById("botAnswer");
  const question=document.getElementById("botQuestion");
  if(!form||!answer||!question)return;
  const state="https://www.sos.alabama.gov/alabama-votes";
  const lookup="https://myinfo.alabamavotes.gov/voterview";
  const ballot="https://www.sos.alabama.gov/alabama-votes/2026-general-election-sample-ballots";
  const resources={
    ballot:{
      title:"Find your ballot and learn what is being decided",
      body:"Alabama's official 2026 sample ballots are organized by county. Check your county and voting district; review each contest and the plain-language summary of any proposed constitutional amendments.",
      links:[["View official county sample ballots",ballot],["See Alabama election information",state]]
    },
    registration:{
      title:"Check voter registration",
      body:"Use the Alabama Secretary of State's voter portal to check your registration. The general-election registration deadline is October 19, 2026.",
      links:[["Check my voter registration",lookup],["Alabama Votes",state]]
    },
    polling:{
      title:"Find your polling place",
      body:"Your polling place depends on your registration address and precinct. Use Alabama's official lookup rather than relying on an old voting location.",
      links:[["Find my polling place",lookup]]
    },
    absentee:{
      title:"Absentee voting rules and deadlines",
      body:"Check official eligibility, application instructions, deadlines and ballot return requirements. Alabama's absentee voting is not unrestricted early voting.",
      links:[["Alabama absentee voting information","https://www.sos.alabama.gov/alabama-votes/voter/absentee-voting"]]
    },
    id:{
      title:"Photo voter ID",
      body:"See accepted forms of ID, exceptions, and how to obtain a free Alabama photo voter ID on the official state website.",
      links:[["Official Alabama voter ID information","https://www.sos.alabama.gov/alabama-votes/voter/voter-id"]]
    },
    access:{
      title:"Accessible voting information",
      body:"Voters with disabilities can review accessible voting options and assistance. The absentee information page includes permanent disability applications where eligible. Transportation accommodations may be requested separately.",
      links:[["Alabama absentee and disability options","https://www.sos.alabama.gov/alabama-votes/voter/absentee-voting"],["Find election officials", "https://www.sos.alabama.gov/city-county-lookup"],["Request accessible transportation (subject to availability)","https://form.jotform.com/262826321453051"]]
    },
    ride:{
      title:"REVUP to the Polls — free ride request",
      body:"Need transportation to vote on Tuesday, November 3? Open the separate REVUP to the Polls Jotform. This is a REQUEST, not a confirmed ride. Service focuses on Montgomery and surrounding Black Belt communities, and accessibility needs can be noted. You do not have to fill out this form to use the rest of Educated Voters.",
      links:[["Open REVUP free ride Jotform","https://form.jotform.com/262826321453051"],["Check my polling place first",lookup]]
    },
    help:{
      title:"Help with voting questions or problems",
      body:"Contact Alabama election officials or Election Protection for help. For local election office information, use the state's county directory.",
      links:[["Find county election officials","https://www.sos.alabama.gov/city-county-lookup"],["Call Alabama Elections: (334) 242-7200","tel:+13342427200"],["Call Election Protection: 866-OUR-VOTE","tel:+18666878683"]]
    }
  };
  function show(topic){
    const data=resources[topic];
    document.querySelectorAll("[data-bot-topic]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.botTopic===topic)));
    if(!data){
      answer.replaceChildren();
      const title=document.createElement("strong"); title.textContent="Here's how to get started";
      const p=document.createElement("p");p.textContent="Try asking about your sample ballot, registration, polling place, absentee voting, photo ID, accessibility, a free ride, or help at the polls.";
      answer.append(title,p);
      return;
    }
    answer.replaceChildren();
    const title=document.createElement("strong");title.textContent=data.title;
    const body=document.createElement("p");body.textContent=data.body;
    answer.append(title,body);
    data.links.forEach(([name,url])=>{
      const a=document.createElement("a");a.href=url;a.textContent=name+" →";
      if(!url.startsWith("tel:")){a.target="_blank";a.rel="noopener noreferrer";}
      answer.appendChild(a);
    });
  }
  function findTopic(q){
    const s=q.toLowerCase().trim();
    if(/ride|transport|pickup|car|jotform|lift/.test(s))return "ride";
    if(/disab|access|wheelchair|hearing|blind|mobility|assistive/.test(s))return "access";
    if(/absentee|mail|early|away|overseas/.test(s))return "absentee";
    if(/sample|ballot|amend|candidate|judg|office|senat|representative|governor/.test(s))return "ballot";
    if(/registr|eligible|sign up|registered/.test(s))return "registration";
    if(/poll|precinct|where (do|can) i vote|location/.test(s))return "polling";
    if(/identif|photo id|driver.?s license|passport/.test(s))return "id";
    if(/help|problem|challeng|refus|complain|hotline|official/.test(s))return "help";
    return null;
  }
  document.querySelectorAll("[data-bot-topic]").forEach(b=>b.addEventListener("click",()=>show(b.dataset.botTopic)));
  form.addEventListener("submit",e=>{e.preventDefault();show(findTopic(question.value));});
})();
