import React, { Component } from 'react';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import '../css/BoardComment.css';

const style = {
  userNameStyle: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
};

class BoardComment extends Component {
  constructor() {
    super('foo');
  }
  render() {
    const n = this.props.content.replies.length;
    const list = Array.from(Array(n).keys());
    return (
      <li className="comment">
        <Card>
          <CardHeader
            title={this.props.content.userName}
            titleStyle={style.userNameStyle}
            subtitle={this.props.content.time}
          />
          <CardText className="comment-text">
            {this.props.content.comment}
          </CardText>
          <div className="reply-block">
            <ul className="reply-list">
              {list.map(i =>
                <li>
                  <CardHeader
                    title={this.props.content.replies[i].userName}
                    titleStyle={style.userNameStyle}
                    subtitle={this.props.content.replies[i].time}
                  />
                  <CardText className="comment-text">
                    {this.props.content.replies[i].reply}
                  </CardText>
                </li>,
              )}
            </ul>
            <TextField
              fullWidth
              hintText="Reply"
              onKeyUp={(e) => {
                if (e.key === 'Enter' && e.target.value !== '') {
                  this.props.handleCreateReply(this.props.content.id, e.target.value);
                  e.target.value = '';
                }
              }}
            />
          </div>
        </Card>
      </li>
    );
  }
}

const p = React.PropTypes;

BoardComment.propTypes = {
  content: p.shape({
    id: p.number.isRequired,
    userName: p.string.isRequired,
    comment: p.string.isRequired,
    time: p.string.isRequired,
    inputReply: p.string.isRequired,
    replies: p.shape({
      id: p.number.isRequired,
      userName: p.string.isRequired,
      reply: p.string.isRequired,
      time: p.string.isRequired,
      length: p.number.isRequired,
    }).isRequired,
  }).isRequired,
  handleCreateReply: p.func.isRequired,
};

export default BoardComment;
