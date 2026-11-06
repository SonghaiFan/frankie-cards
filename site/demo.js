// Actual built-in question data, extracted at build time. No persistence or network.
const data=JSON.parse(document.querySelector('#question-data').textContent);
const question=document.querySelector('#sample-question'),energy=document.querySelector('#sample-energy');
let index=0;
function show(){const q=data.questions[index];question.textContent=q.question;energy.textContent=q.energy==='kiki'?data.energy[1]:data.energy[0];energy.dataset.energy=q.energy;document.querySelector('#sample-count').textContent=`${index+1} / ${data.questions.length}`;}
document.querySelector('#sample-next').addEventListener('click',()=>{index=(index+1)%data.questions.length;show();});show();
