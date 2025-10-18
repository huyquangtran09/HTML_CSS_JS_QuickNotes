//Tạo tên biến cho id="theme_btn"
const theme_btn = document.getElementById("theme_btn");
const noteDialog = document.getElementById("noteDialog");
const noteForm = document.getElementById("noteForm");

const add_btn = document.getElementById("add_btn");
const close_btn = document.getElementById("close_btn");

const addnote_btn = document.getElementById("addnote_btn");
const cancel_btn = document.getElementById("cancel_btn");

const save_btn = document.getElementById("save_btn");

//Kiểm tra localStorage khi tải trang
if (localStorage.getItem("theme") == "dark-theme") {
  document.body.classList.add("dark-theme");
  theme_btn.querySelector(".icon-light").style.display = "none";
  theme_btn.querySelector(".icon-dark").style.display = "block";
} else {
  document.body.classList.remove("dark-theme");
  theme_btn.querySelector(".icon-light").style.display = "block";
  theme_btn.querySelector(".icon-dark").style.display = "none";
}

//Tạo click cho id="theme_btn"
theme_btn.addEventListener("click", () => {
  //Tạo class dark-theme
  document.body.classList.toggle("dark-theme");

  //Lưu vào localStorage và cập nhật icon
  if (document.body.classList.contains("dark-theme")) {
    localStorage.setItem("theme", "dark-theme");
    theme_btn.querySelector(".icon-light").style.display = "none";
    theme_btn.querySelector(".icon-dark").style.display = "block";
  } else {
    localStorage.setItem("theme", "light-theme");
    theme_btn.querySelector(".icon-light").style.display = "block";
    theme_btn.querySelector(".icon-dark").style.display = "none";
  }
});

add_btn.addEventListener("click", () => {
  noteDialog.show();
});
//tạo sự kiện click close_btn
close_btn.addEventListener("click", () => {
  noteDialog.close();
});

//tạo sự kiện click addnote_btn
addnote_btn.addEventListener("click", () => {
  noteDialog.show();
});

//tạo sự kiện click cancel_btn
cancel_btn.addEventListener("click", () => {
  noteDialog.close();
});

//tạo mảng dữ liệu lưu trữ ghi chú
let notes = [];

//tạo sự kiện submit cho form noteForm
noteForm.addEventListener("submit", (e) => {
  e.preventDefault(); //ngăn reload trang
  //lấy giá trị từ input
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;

  //tạo đối tượng ghi chú mới
  const newNote = {
    id: Date.now(),
    title: title,
    content: content,
  };
  //thêm ghi chú mới vào mảng notes
  notes.push(newNote);
  console.log(notes); //hiển thị mảng notes trong console

  // lưu trữ mảng notes vào localStorage
  localStorage.setItem("notes", JSON.stringify(notes));

  //đóng dialog và đặt lại form
  noteDialog.close();
  noteForm.reset();

  //gọi renderNotes để cập nhật giao diện
  renderNotes();
});

//hàm renderNotes để hiển thị ghi chú
function renderNotes() {
  const notesContainer = document.getElementById("notesContainer");
  const emptyState = document.querySelector(".note_state");

  // Xóa nội dung cũ
  notesContainer.innerHTML = "";

  if (notes.length === 0) {
    emptyState.style.display = "block";
    notesContainer.hidden = true;
    return;
  }

  emptyState.style.display = "none";
  notesContainer.hidden = false;

  // Tạo card cho từng note
  notes.forEach((note) => {
    const noteEl = document.createElement("div");
    noteEl.className = "note_card";
    noteEl.innerHTML = `
    <div>
    <h3>${note.title}</h3>
    <p>${note.content}</p>
    </div>
      <div class="note_actions">
        <button onclick="editNote(${note.id})" class="edit_btn">✏️</button>
        <button onclick="deleteNote(${note.id})" class="delete_btn">🗑️</button>
      </div>
    `;
    notesContainer.appendChild(noteEl);
  });
}

//xóa ghi chú
function deleteNote(id) {
  notes = notes.filter((note) => note.id !== id);
  localStorage.setItem("notes", JSON.stringify(notes));
  renderNotes();
}

//chỉnh sửa ghi chú
function editNote(id, updatedContent) {
  debugger;
  const note = notes.find((note) => note.id === id);
  noteDialog.showModal();
  //sửa nội dung ghi chú
  document.getElementById("title").value = note.title;
  document.getElementById("content").value = note.content;

  //thay đổi tiêu đề dialog
  const titleDialog = document.querySelector("dialog_header div");
  titleDialog.textContent = "Chỉnh sửa ghi chú";

  //thay đổi nút lưu
  const saveButton = noteDialog.querySelector("#addnote_btn");
  saveButton.textContent = "Lưu";

  //đóng dialog và đặt lại form
  noteDialog.close();
  noteForm.reset();
  //hiển thị dialog add note với nội dung hiện tại
  document.body.appendChild(editDialog);
  editDialog.showModal();
}

//khi bấm lưu, trang sẽ tải lại ghi chú từ localStorage
window.addEventListener("beforeunload", () => {
  localStorage.setItem("notes", JSON.stringify(notes));
});

//tải ghi chú từ localStorage khi trang được tải
window.addEventListener("load", () => {
  const storedNotes = localStorage.getItem("notes");
  if (storedNotes) {
    notes = JSON.parse(storedNotes);
  }
  renderNotes(); //gọi hàm renderNotes để hiển thị ghi chú
});

// Hàm mặc định để phục hồi sau khi sửa đổi
function defaultFunction() {
  console.log("This is the default function.");
}
