import client from './client';

export async function getPosts({ page = 1, searchType, keyword } = {}) {
  const params = { page };
  if (searchType && keyword) {
    params.searchType = searchType;
    params.keyword = keyword;
  }
  const { data } = await client.get('/posts', { params });
  return data;
}

export async function getPost(id) {
  const { data } = await client.get(`/posts/${id}`);
  return data;
}

export async function createPost({ title, content, author, password }) {
  const { data } = await client.post('/posts', { title, content, author, password });
  return data;
}

export async function updatePost(id, { title, content, password }) {
  const { data } = await client.put(`/posts/${id}`, { title, content, password });
  return data;
}

export async function deletePost(id, { password }) {
  await client.delete(`/posts/${id}`, { data: { password } });
}
