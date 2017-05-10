import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Popover from 'material-ui/Popover';
import Dialog from 'material-ui/Dialog';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ActionSettings from 'material-ui/svg-icons/action/settings';
import BoardComment from './BoardComment';
import '../css/BoardApp.css';


const style = {
  floatingButton: {
    position: 'fixed',
    bottom: '5%',
    right: '5%',
  },
};

class BoardApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogOpen: false,
      popoverOpen: false,
      userName: 'Guest',
      comment: '',
      comments: [],
    };
    this.handleTouchTap = this.handleTouchTap.bind(this);
    this.handleSubmitBtnClick = this.handleSubmitBtnClick.bind(this);
    this.handleChangeReply = this.handleChangeReply.bind(this);
    this.handleCreateReply = this.handleCreateReply.bind(this);
  }

  componentDidMount() {
    fetch('/api/comments')
      .then(res => res.json())
      .then(c => this.setState({ comments: c }))
      .catch(err => console.error(err));
  }

  handleTouchTap(event) {
    event.preventDefault();
    this.setState({
      popoverOpen: true,
      anchorEl: event.currentTarget,
    });
  }

  handleSubmitBtnClick() {
    if (this.state.comment !== '') {
      let comments = this.state.comments;
      fetch('/api/comments', {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: comments.length,
          userName: this.state.userName,
          comment: this.state.comment,
          time: Date(),
          replies: [],
        }),
      });

      const newComment = {
        id: comments.length,
        userName: this.state.userName,
        comment: this.state.comment,
        time: Date(),
        inputReply: '',
        replies: [],
      };
      comments = comments.concat(newComment);
      this.setState({
        dialogOpen: false,
        comment: '',
        comments,
      });
    }
  }

  handleChangeReply(id, reply) {
    const comments = this.state.comments;
    comments[id].inputReply = reply;
    this.setState({
      comments,
    });
  }

  handleCreateReply(id, newReply) {
    const comments = this.state.comments;
    fetch('/api/reply', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        commentId: id,
        id: comments[id].replies.length,
        userName: this.state.userName,
        reply: newReply,
        time: Date(),
      }),
    });

    const reply = {
      id: comments[id].replies.length,
      userName: this.state.userName,
      reply: newReply,
      time: Date(),
    };
    comments[id].replies = comments[id].replies.concat(reply);
    this.setState({
      comments,
    });
  }

  render() {
    const n = this.state.comments.length;
    const list = Array.from(Array(n).keys());
    const actions = [
      <FlatButton
        label="Cancel"
        secondary
        onTouchTap={() => {
          this.setState({
            dialogOpen: false,
            comment: '',
          });
        }}
      />,
      <RaisedButton
        label="Submit"
        primary
        onTouchTap={this.handleSubmitBtnClick}
      />,
    ];
    return (
      <div>
        <div className="board-header">
          <h1>Board</h1>
          <IconButton
            onTouchTap={this.handleTouchTap}
          >
            <ActionSettings color="white" />
          </IconButton>
          <Popover
            open={this.state.popoverOpen}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            targetOrigin={{ horizontal: 'right', vertical: 'top' }}
            onRequestClose={() => {
              this.setState({
                popoverOpen: false,
              });
            }}
          >
            <div className="popover">
              <TextField
                fullWidth
                hintText="User Name"
                floatingLabelText="User Name"
                value={this.state.userName}
                onChange={(e) => {
                  this.setState({
                    userName: e.target.value,
                  });
                }}
                onKeyUp={(e) => {
                  if (e.key === 'Enter') {
                    this.setState({
                      popoverOpen: false,
                    });
                  }
                }}
              />
            </div>
          </Popover>
        </div>

        <Dialog
          title="Leave a message..."
          actions={actions}
          open={this.state.dialogOpen}
          autoScrollBodyContent
        >
          <div className="content-input">
            <TextField
              fullWidth
              multiLine
              rows={9999}
              value={this.state.comment}
              onChange={(e) => {
                this.setState({
                  comment: e.target.value,
                });
              }}
            />
          </div>
        </Dialog>

        <ul className="comment-list">
          {list.map(i =>
            <div>
              <BoardComment
                content={this.state.comments[i]}
                handleChangeReply={(id, reply) => this.handleChangeReply(id, reply)}
                handleCreateReply={(id, newReply) => this.handleCreateReply(id, newReply)}
              />
            </div>,
          )}
        </ul>
        <FloatingActionButton
          style={style.floatingButton}
          onTouchTap={() => {
            this.setState({
              dialogOpen: true,
            });
          }}
        >
          <ContentAdd />
        </FloatingActionButton>
      </div>
    );
  }
}

export default BoardApp;
