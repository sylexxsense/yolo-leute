document.addEventListener('DOMContentLoaded', () => {
  const postForm = document.getElementById('postForm');
  const postsDiv = document.getElementById('posts');

  function loadPosts() {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => {
        postsDiv.innerHTML = '';
        data.forEach(post => {
          const div = document.createElement('div');
          div.className = 'post';
          div.innerHTML = `
            <div class="name">${post.name}</div>
            <div class="message">${post.message}</div>
            <div class="time">${new Date(post.created_at).toLocaleString()}</div>
          `;
          postsDiv.appendChild(div);
        });
      });
  }

  postForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const message = document.getElementById('message').value;
    fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, message })
    })
    .then(res => res.json())
    .then(() => {
      postForm.reset();
      loadPosts();
    });
  });

  loadPosts();
});
