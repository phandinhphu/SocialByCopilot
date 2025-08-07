import { get, post, put, del } from "../utils/httpRequest";

// Posts API
export const postsAPI = {
    getAll: () => get("/posts"),
    getById: (id) => get(`/posts/${id}`),
    getComments: (postId) => get(`/posts/${postId}/comments`),
    create: (post) => post("/posts", post),
    update: (id, post) => put(`/posts/${id}`, post),
    delete: (id) => del(`/posts/${id}`),
};

// Comments API
export const commentsAPI = {
    getAll: () => get("/comments"),
    getById: (id) => get(`/comments/${id}`),
    getByPostId: (postId) => get("/comments", { postId }),
    create: (comment) => post("/comments", comment),
    update: (id, comment) => put(`/comments/${id}`, comment),
    delete: (id) => del(`/comments/${id}`),
};

// Albums API
export const albumsAPI = {
    getAll: () => get("/albums"),
    getById: (id) => get(`/albums/${id}`),
    getPhotos: (albumId) => get(`/albums/${albumId}/photos`),
    getByUserId: (userId) => get("/albums", { userId }),
    create: (album) => post("/albums", album),
    update: (id, album) => put(`/albums/${id}`, album),
    delete: (id) => del(`/albums/${id}`),
};

// Photos API
export const photosAPI = {
    getAll: () => get("/photos"),
    getById: (id) => get(`/photos/${id}`),
    getByAlbumId: (albumId) => get("/photos", { albumId }),
    create: (photo) => post("/photos", photo),
    update: (id, photo) => put(`/photos/${id}`, photo),
    delete: (id) => del(`/photos/${id}`),
};

// Todos API
export const todosAPI = {
    getAll: () => get("/todos"),
    getById: (id) => get(`/todos/${id}`),
    getByUserId: (userId) => get("/todos", { userId }),
    create: (todo) => post("/todos", todo),
    update: (id, todo) => put(`/todos/${id}`, todo),
    delete: (id) => del(`/todos/${id}`),
};

// Users API
export const usersAPI = {
    getAll: () => get("/users"),
    getById: (id) => get(`/users/${id}`),
    getAlbums: (userId) => get(`/users/${userId}/albums`),
    getTodos: (userId) => get(`/users/${userId}/todos`),
    getPosts: (userId) => get(`/users/${userId}/posts`),
    create: (user) => post("/users", user),
    update: (id, user) => put(`/users/${id}`, user),
    delete: (id) => del(`/users/${id}`),
};
