const BASE_URL = "http://localhost:3000/posts";

let currentPostId = null; 

function main() {
  displayPosts();
  addNewPostListener();
  addEditPostListener();
  addCancelEditListener();
}

function displayPosts() {
  fetch(BASE_URL)
    .then(res => res.json())
    .then(posts => {
      const postList = document.getElementById("post-list");
      postList.innerHTML = "";

      posts.forEach((post, index) => {
        const postItem = document.createElement("div");
        postItem.textContent = post.title;
        postItem.classList.add("post-title");
        postItem.dataset.id = post.id;
        postItem.addEventListener("click", () => handlePostClick(post.id));
        postList.appendChild(postItem);

        
        if (index === 0) handlePostClick(post.id);
      });
    });
}

function handlePostClick(id) {
  fetch(`${BASE_URL}/${id}`)
    .then(res => res.json())
    .then(post => {
      currentPostId = post.id;

      const postDetail = document.getElementById("post-detail");
      postDetail.innerHTML = `
        <h2>${post.title}</h2>
        <p>${post.content}</p>
        <p><strong>Author:</strong> ${post.author}</p>
        <button id="edit-btn">Edit</button>
        <button id="delete-btn">Delete</button>
      `;

      
      document.getElementById("edit-btn").addEventListener("click", () => showEditForm(post));
      document.getElementById("delete-btn").addEventListener("click", () => deletePost(post.id));
    });
}

function addNewPostListener() {
  const form = document.getElementById("new-post-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const newPost = {
      title: form.title.value,
      content: form.content.value,
      author: form.author.value
    };

    fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost)
    })
      .then(res => res.json())
      .then(() => {
        displayPosts();
        form.reset();
      });
  });
}

function showEditForm(post) {
  const form = document.getElementById("edit-post-form");
  form.classList.remove("hidden");
  form["edit-title"].value = post.title;
  form["edit-content"].value = post.content;
}

function addEditPostListener() {
  const form = document.getElementById("edit-post-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const updatedData = {
      title: form["edit-title"].value,
      content: form["edit-content"].value
    };

    fetch(`${BASE_URL}/${currentPostId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData)
    })
      .then(res => res.json())
      .then(() => {
        form.classList.add("hidden");
        displayPosts();
        handlePostClick(currentPostId);
      });
  });
}

function addCancelEditListener() {
  const cancelBtn = document.getElementById("cancel-edit");
  cancelBtn.addEventListener("click", () => {
    document.getElementById("edit-post-form").classList.add("hidden");
  });
}

function deletePost(id) {
  fetch(`${BASE_URL}/${id}`, {
    method: "DELETE"
  })
    .then(() => {
      document.getElementById("post-detail").innerHTML = "<p>Select a post to view details</p>";
      displayPosts();
    });
}

document.addEventListener("DOMContentLoaded", main);
