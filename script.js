// script.js
document.addEventListener("DOMContentLoaded", () => {
  const landing = document.getElementById("landing");
  const questions = document.getElementById("questions");
  const result = document.getElementById("result");

  const userForm = document.getElementById("userForm");
  const quizForm = document.getElementById("quizForm");

  const totalScoreEl = document.getElementById("totalScore");
  const catTitleEl = document.getElementById("catTitle");
  const catDescEl = document.getElementById("catDesc");
  const fundListEl = document.getElementById("fundList");
  const catImageEl = document.getElementById("catImage");

  const phoneEl = document.getElementById("phone");
  const phoneErrEl = document.getElementById("phoneError");

  const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyTAbmrWB_JLwV6ylk8tR-OElSsonvhK0DuSZPRYFdNNuhKjlSJIFVdlwvgiX6PsZ0/exec";

  let lead = { firstName: "", lastName: "", phone: "", email: "" };

  // phone input lock to exactly 10 digits without popups
  phoneEl.addEventListener("input", () => {
    const digits = phoneEl.value.replace(/\D/g, "").slice(0, 10);
    phoneEl.value = digits;
    if (digits.length === 10) setPhoneError(false);
  });
  phoneEl.addEventListener("keypress", (e) => {
    if (!/[0-9]/.test(e.key)) e.preventDefault();
  });
  phoneEl.addEventListener("blur", () => {
    if (phoneEl.value.length && phoneEl.value.length !== 10) setPhoneError(true);
    else setPhoneError(false);
  });

  document.getElementById("backBtn").addEventListener("click", () => {
    questions.classList.add("hidden");
    landing.classList.remove("hidden");
  });

  document.getElementById("retryBtn").addEventListener("click", reset);

  userForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const firstName = document.getElementById("firstName").value.trim();
    const lastName  = document.getElementById("lastName").value.trim();
    const phone     = phoneEl.value.trim();
    const email     = document.getElementById("email").value.trim();

    if (phone.length !== 10) { setPhoneError(true); phoneEl.focus(); return; }

    if (!firstName || !lastName || !phone || !email) {
      alert("กรอกข้อมูลให้ครบถ้วน");
      return;
    }

    lead = { firstName, lastName, phone, email };
    landing.classList.add("hidden");
    questions.classList.remove("hidden");
  });

  quizForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const values = ["q1","q2","q3","q4","q5"].map(n => {
      const el = quizForm.querySelector(`input[name="${n}"]:checked`);
      return el ? Number(el.value) : null;
    });
    if (values.some(v => v === null)) { alert("ตอบให้ครบทุกข้อ"); return; }

    const sum = values.reduce((a,b) => a + b, 0);
    renderResult(sum);
    questions.classList.add("hidden");
    result.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  function setPhoneError(show) {
    if (show) {
      phoneEl.classList.add("input-error");
      phoneErrEl.classList.remove("hidden");
    } else {
      phoneEl.classList.remove("input-error");
      phoneErrEl.classList.add("hidden");
    }
  }

  function renderResult(score) {
    totalScoreEl.textContent = String(score);

    let cat = "";
    let desc = "";
    let funds = [];
    let catClass = "";
    let candidates = [];

    if (score >= 5 && score <= 7) {
      cat = "นักลงทุนสายชิล";
      desc = "คุณเป็นคนสบาย ๆ สายชิล ลงทุนแบบเรียบง่ายไม่ซับซ้อน ชอบความมั่นคง และบริหารจัดการพอร์ตให้เป็นไปตามที่ต้องการ";
      funds = ["กองทุนรวมตลาดเงิน","กองทุนรวมพันธบัตรรัฐบาล","กองทุนรวมตราสารหนี้"];
      catClass = "chill";
      candidates = ["Chill.JPG","Chill.jpg","images/Chill.JPG","images/Chill.jpg"];
    } else if (score >= 8 && score <= 11) {
      cat = "นักลงทุนสายปรับตัว";
      desc = "คุณเป็นคนมีวินัย วางแผนดี แต่ยืดหยุ่นตามสถานการณ์ ลงทุนระยะยาวแบบที่พร้อมเปิดรับโอกาสเติบโตอย่างสมดุล";
      funds = ["กองทุนรวมดัชนี","กองทุนรวมผสม"];
      catClass = "flex";
      candidates = ["Flexible.JPG","Flexible.jpg","images/Flexible.JPG","images/Flexible.jpg"];
    } else {
      cat = "นักลงทุนสายท้าทาย";
      desc = "คุณเป็นคนที่มั่นใจ มีเป้าหมายให้พุ่งชน วิเคราะห์สถานการณ์ได้อย่างละเอียด และพร้อมเปลี่ยนสินทรัพย์ไปสู่ผลตอบแทนที่ดีกว่า";
      funds = ["กองทุนรวมหุ้น","กองทุนรวม Sector","กองทุนรวมสินทรัพย์ทางเลือก"];
      catClass = "brave";
      candidates = ["Challenge.JPG","Challenge.jpg","images/Challenge.JPG","images/Challenge.jpg"];
    }

    catTitleEl.textContent = cat;
    catTitleEl.className = `cat ${catClass}`;
    catDescEl.textContent = desc;

    setImageSafe(catImageEl, candidates);

    fundListEl.innerHTML = "";
    funds.forEach(f => {
      const li = document.createElement("li");
      li.textContent = f;
      fundListEl.appendChild(li);
    });

    saveLead({ ...lead, resultCat: cat });
  }

  function setImageSafe(imgEl, filenameCandidates) {
    let i = 0;
    const tryNext = () => {
      if (i >= filenameCandidates.length) {
        imgEl.removeAttribute("src");
        imgEl.alt = "ไม่พบรูปผลลัพธ์";
        return;
      }
      const f = filenameCandidates[i++];
      imgEl.onerror = tryNext;
      imgEl.src = encodeURI(f);
      imgEl.alt = f;
    };
    tryNext();
  }

  function reset() {
    ["q1","q2","q3","q4","q5"].forEach(n => {
      const el = quizForm.querySelector(`input[name="${n}"]:checked`);
      if (el) el.checked = false;
    });
    result.classList.add("hidden");
    landing.classList.remove("hidden");
    document.getElementById("firstName").focus();
  }

  function saveLead(payload) {
    if (!GAS_WEB_APP_URL) return;
    const body = new URLSearchParams(payload).toString();
    fetch(GAS_WEB_APP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body
    }).catch(err => console.error("saveLead error", err));
  }
});
