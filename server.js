const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

const data = [];

app.use(express.static(`${__dirname}/client/build/`));

function postComment(req, res) {
  data.push({
    id: req.body.id,
    userName: req.body.userName,
    comment: req.body.comment,
    time: req.body.time,
    replies: req.body.replies,
  });
}

function postReply(req, res) {
  data[req.body.commentId].replies.push({
    id: req.body.id,
    userName: req.body.userName,
    reply: req.body.reply,
    time: req.body.time,
  });
}

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/client/public/index.html`);
});

app.get('/api/comments', (req, res) => {
  res.json(data);
});

app.post('/api/comments', postComment);
app.post('/api/reply', postReply);

app.set('port', (process.env.PORT || 3001));
app.listen(app.get('port'), () => {
  console.log(app.get('port'));
});
