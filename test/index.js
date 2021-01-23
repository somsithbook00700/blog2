const posts = {
  123: {
    id: "12321321",
    title: "test",
    comments: [],
  },
};

console.log(posts);
const post = posts["123"];
console.log(post);
post.comments.push({
  id: "000000",
  content: "test",
});
console.log(post);

console.log(posts);
