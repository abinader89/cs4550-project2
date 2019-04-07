import React from 'react';
import _ from 'lodash';

import api from './api';

import WallPosts from './WallPosts';

// TODO make this a function after adding store...?
class UserProfile extends React.Component {
  constructor(props) {
    super(props);

    this.user_id = props.match.params.id;
  
    this.state = {
      display_name: "loading",
      new_post_content: ""
    }; 
  
    this.fetchUser();  
  }

  fetchUser() {
    console.log("fetch user");
    api.fetch_user(this.user_id, this.updateState.bind(this));
  }

  updateState(state) {
    this.setState(state);
  }

  acceptFriendRequest() {
    api.accept_friend_request(this.user_id, this.fetchUser.bind(this));
  }
  deleteFriendRequest() {
    api.delete_friend_request(this.user_id, this.fetchUser.bind(this));
  }
  sendFriendRequest() {
    api.send_friend_request(this.user_id, this.fetchUser.bind(this));
  }
  
  deleteFriend() {
    api.delete_friend(this.user_id, this.fetchUser.bind(this));
  }

  pokeUser() {
      api.poke_user(this.user_id, this.fetchUser.bind(this));
  }

  // this should only be called if a user is on their own page
  createNewPost() {
    let content = this.state.new_post_content;

    this.updateState({new_post_content: ""});
    api.create_new_post(this.user_id, content, this.fetchUser.bind(this));
  }

  render() {
    let friendStatus;
    if (this.props.session && this.props.session.user_id != this.user_id) { 
      if (this.state.is_friend) {
        friendStatus = <div>
          <button className="btn btn-danger" onClick={this.pokeUser.bind(this)}>Poke!</button>
          <button className="ml-2 btn btn-secondary" onClick={this.deleteFriend.bind(this)}>Unfriend :(</button>
        </div>;
      } else if (this.state.sent_request_to) {
        friendStatus = <p>Waiting for friend request to be accepted...<button className="ml-2 mr-2 btn btn-secondary" onClick={this.deleteFriendRequest.bind(this)}>Cancel friend request</button></p>;
      } else if (this.state.has_request_from) {
        friendStatus = <div><button className="btn btn-primary" onClick={this.acceptFriendRequest.bind(this)}>Accept friend request!</button><button className="ml-2 mr-2 btn btn-secondary" onClick={this.deleteFriendRequest.bind(this)}>Decline</button></div>;
      } else {
        friendStatus = <button className="mr-2 btn btn-primary" onClick={this.sendFriendRequest.bind(this)}>Send friend request</button>;
      }
    }

    let createPost;

    if (this.props.session && this.props.session.user_id == this.user_id) {
      createPost = <div className="row">
          <div className="col-6 input-div">
            <input className="post-input" placeholder="What's on my mind..." value={this.state.new_post_content} onChange={(ev) => this.updateState({new_post_content: ev.target.value})} /> 
          </div>
          <div className="col-2">  
            <button className="btn btn-primary" onClick={this.createNewPost.bind(this)}>Post</button>
          </div>
        </div>;

    }

    return <div>
        <div className="row">
          <div className="col-6">
            <h2>{this.state.display_name}</h2>
          </div>
          <div className="col-6">
            {friendStatus}
            <i>Points: {this.state.points}</i>
          </div>
        </div>
        <div>
          {createPost}
        </div>
        
        <WallPosts session={this.props.session} posts={this.state.posts} deleteCallback={this.fetchUser.bind(this)} /> 
      </div>;
  }
    
}

export default UserProfile;
