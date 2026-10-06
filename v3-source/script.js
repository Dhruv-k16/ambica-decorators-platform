const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];

const modal=$("#enquiryModal");
$$("[data-open-enquiry]").forEach(b=>b.addEventListener("click",()=>{modal.classList.add("open");modal.setAttribute("aria-hidden","false");document.body.style.overflow="hidden"}));
$$("[data-close-modal]").forEach(b=>b.addEventListener("click",()=>{modal.classList.remove("open");modal.setAttribute("aria-hidden","true");document.body.style.overflow="" }));

const hamburger=$("#hamburger"), navWrap=$(".nav-wrap");
hamburger?.addEventListener("click",()=>navWrap.classList.toggle("nav-open"));
$$("nav a").forEach(a=>a.addEventListener("click",()=>navWrap.classList.remove("nav-open")));

const filters=$$(".filter"), figures=$$(".portfolio-grid figure");
filters.forEach(btn=>btn.addEventListener("click",()=>{
  filters.forEach(x=>x.classList.remove("active"));btn.classList.add("active");
  const f=btn.dataset.filter;figures.forEach(x=>x.style.display=(f==="all"||x.dataset.cat===f)?"block":"none");
}));

$$("[data-service]").forEach(b=>b.addEventListener("click",()=>{
  modal.classList.add("open");document.body.style.overflow="hidden";
  const wanted=b.dataset.service;
  const boxes=$$("input[name='services']");
  boxes.forEach(x=>x.checked=x.value===wanted);
  $("#enquiryModal").scrollTo({top:0,behavior:"smooth"});
}));

const dateList=$("#dateList");
$("#addDate").addEventListener("click",()=>{
  const row=document.createElement("div");row.className="date-row";
  row.innerHTML='<input type="date" name="eventDates[]"><button type="button" class="remove-date">×</button>';
  dateList.appendChild(row);
  row.querySelector(".remove-date").addEventListener("click",()=>row.remove());
});

$("#enquiryForm").addEventListener("submit",e=>{
  e.preventDefault();
  const form=e.currentTarget;
  const eventTypes=$$("input[name='eventType']:checked",form).map(x=>x.value);
  const services=$$("input[name='services']:checked",form).map(x=>x.value);
  const dates=$$("input[name='eventDates[]']",form).map(x=>x.value).filter(Boolean);
  if(!eventTypes.length){$("#formStatus").textContent="Please select at least one event type.";return}
  if(!dates.length){$("#formStatus").textContent="Please add at least one event date.";return}
  const data={name:form.name.value,phone:form.phone.value,email:form.email.value,city:form.city.value,eventTypes,venue:form.venue.value,guests:form.guests.value,dates,services,budget:form.budget.value,venueFinal:form.venueFinal.value,message:form.message.value,createdAt:new Date().toISOString()};
  const existing=JSON.parse(localStorage.getItem("ambica_demo_enquiries")||"[]");existing.push(data);localStorage.setItem("ambica_demo_enquiries",JSON.stringify(existing));
  $("#formStatus").textContent="Enquiry captured successfully. Connect the form to your email/CRM backend before launch.";
  $("#formStatus").className="success";
  form.reset();
  dateList.innerHTML='<div class="date-row"><input type="date" name="eventDates[]"><button type="button" class="remove-date" disabled>×</button></div>';
});

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("show");observer.unobserve(e.target)}}),{threshold:.1});
$$(".service-row article,.portfolio-grid figure,.review-grid article,.location-card").forEach(el=>{el.style.opacity="0";el.style.transform="translateY(15px)";el.style.transition="opacity .6s ease,transform .6s ease";observer.observe(el)});
const st=document.createElement("style");st.textContent=".show{opacity:1!important;transform:none!important}";document.head.appendChild(st);
