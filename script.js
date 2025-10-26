//create flags
let currentNoteId = null;

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
  //if currentNoteId === null => create note
  if (currentNoteId === null) {
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
  }
  //if currentNoteId !== null => update note
  if (currentNoteId !== null) {
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;
    //tìm ghi chú cần chỉnh sửa
    const noteToEdit = notes.find((item) => item.id === currentNoteId);
    noteToEdit.title = title;
    noteToEdit.content = content;
    //save lại mảng notes vào localStorage
    localStorage.setItem("notes", JSON.stringify(notes));
    //reset currentNoteId về null
    currentNoteId = null;
  }

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
        <button onclick="editNote(${note.id})" class="edit_btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path>
          </svg>
        </button>
        <button onclick="deleteNote(${note.id})" class="delete_btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.88c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"></path>
          </svg>
        </button>
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
function editNote(id) {
  noteDialog.show();

  //fill data
  const noteToEdit = notes.find((item) => item.id === id);
  document.getElementById("title").value = noteToEdit.title;
  document.getElementById("content").value = noteToEdit.content;
  currentNoteId = id;
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
