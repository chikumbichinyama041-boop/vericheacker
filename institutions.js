// VeriChecker – official records.
// Add an institution only when each detail is confirmed from the institution's own website,
// official helpline or branch. Always give the source link and the date you checked it.
// Leave a list empty ([]) if nothing is confirmed for it.
//
//   { id:"short-id", name:"Institution name", type:"Bank",   // Bank, Mobile money, School, Company, Government
//     status:"confirmed",   // "confirmed" or "being-checked" – set to confirmed only after you have checked it yourself
//     source:"https://official-site.example/", confirmed:"YYYY-MM-DD",   // confirmed = date last checked
//     account:[], phone:[], code:[], email:[], holder:[] }
const INSTITUTIONS = [
  { id:"mtn-zambia", name:"MTN Zambia", type:"Mobile money", status:"confirmed",
    source:"https://www.mtn.zm/", confirmed:"2026-10-22",
    // customer care phone, international line and WhatsApp number, and customer care email,
    // as published in the contact details on mtn.zm
    account:[], phone:["+260966750750","+260966221950","+260966221056"], code:[],
    email:["CustomerCare.zm@mtn.com"], holder:[] }
];
