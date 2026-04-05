// 文字数制限関数
function shorten(text) {
  return text.length > 5 ? text.slice(0,5) + "…" : text;
}
// 並び替え
function sortCards(type) {
  if (!type) return;

  const container = document.getElementById("cardContainer");
  const cards = Array.from(container.children);

  cards.sort((a, b) => {

    // ===== 単位 =====
    if (type === "unit-asc") {
      return Number(a.dataset.unit) - Number(b.dataset.unit);
    }

    if (type === "unit-desc") {
      return Number(b.dataset.unit) - Number(a.dataset.unit);
    }

    // ===== 試験日 =====
    if (type === "exam-asc") {
      return new Date(a.dataset.examStart) - new Date(b.dataset.examStart);
    }

    if (type === "exam-desc") {
      return new Date(b.dataset.examStart) - new Date(a.dataset.examStart);
    }

    // ===== 申込開始日 =====
    if (type === "apply-asc") {
      return new Date(a.dataset.applyStart) - new Date(b.dataset.applyStart);
    }

    if (type === "apply-desc") {
      return new Date(b.dataset.applyStart) - new Date(a.dataset.applyStart);
    }

    return 0;
  });

  cards.forEach(card => container.appendChild(card));
}
// カレンダー関連
const title = document.getElementById("title");
const body = document.getElementById("calendar-body");

let currentDate = new Date();
// イベントデータ
const events = {
  "2026-04-10": [{ type: "exam", title: "基本情報試験" }],
  "2026-04-01": [{ type: "apply", title: "申込開始" }]
};
// パネル表示用
let panel = document.createElement("div");
panel.id = "event-panel";
panel.className = "event-panel";
panel.innerHTML = `
  <div class="panel-inner">
    <h3 id="panel-date"></h3>
    <ul id="panel-events"></ul>
  </div>
`;
document.body.appendChild(panel);

panel.addEventListener("click", function(e){
  if(e.target === this){ // 背景をタップしたら閉じる
    this.classList.remove("active");
  }
});

function openPanel(date) {
  const panelEl = document.getElementById("event-panel");
  const list = document.getElementById("panel-events");
  const titleEl = document.getElementById("panel-date");

  titleEl.textContent = date;
  list.innerHTML = "";

  (events[date] || []).forEach(e => {
    const li = document.createElement("li");
    li.textContent = e.title; // パネルはフル表示
    list.appendChild(li);
  });

  panelEl.classList.add("active");
}

// カレンダー
function renderCalendar(date) {
  body.innerHTML = "";

  const year = date.getFullYear();
  const month = date.getMonth();

  title.textContent = `${year}年 ${month + 1}月`;

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  // 空白マス
  for (let i = 0; i < firstDay; i++) {
    body.innerHTML += `<div></div>`;
  }

  for (let day = 1; day <= lastDate; day++) {
    const dateObj = new Date(year, month, day);
    const key = `${dateObj.getFullYear()}-${String(dateObj.getMonth()+1).padStart(2,'0')}-${String(dateObj.getDate()).padStart(2,'0')}`;

    const isToday =
      new Date().toDateString() === dateObj.toDateString();

    let html = `<div class="${isToday ? "today" : ""}" onclick="openPanel('${key}')">
      <div>${day}</div>
    `;

    if (events[key]) {
      events[key].forEach(e => {
        html += `<div class="event ${e.type}">● ${shorten(e.title)}</div>`; // ← 文字制限
      });
    }

    html += `</div>`;
    body.innerHTML += html;
  }
}
// 前月・次月ボタン
document.getElementById("prev").onclick = () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
};

document.getElementById("next").onclick = () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
};
// 初期表示
renderCalendar(currentDate);
