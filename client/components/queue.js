import React from 'react';
import QueueStore from '../stores/queue-store.js';
import Actions from '../actions/actions.js';

var QueueClass = React.createClass({
  getInitialState: function(){
    return {
      videoQueue : QueueStore.getQueueState()
    }
  },

  _onChange: function(){
    this.setState({videoQueue: QueueStore.getQueueState()})
  },

  componentDidMount: function(){
    QueueStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function(){
    QueueStore.removeChangeListener(this._onChange);
  },

  loadVideo: function(vid){
    if(this.state.videoQueue.currentId != vid.id.videoId){
      Actions.loadVideo(vid.id.videoId)
    }
  },

  deleteVideo: function(vid){
    console.log(vid)
    Actions.deleteVideo(vid)
  },

  getClass: function(vid){
    if(this.state.videoQueue && this.state.videoQueue.currentId == vid.id.videoId){
      return 'highlight-current'
    }
  },


  getQueue: function(){
    var self = this;
    return(
      this.state.videoQueue.videos.map(function(vid){
        return(
          <div>
            <span className={self.getClass(vid)} onClick={self.loadVideo.bind(null, vid)}>{vid.snippet.title}</span>
            <button onClick={self.deleteVideo.bind(null, vid)}>Delete</button>
          </div>
        )
      })
    )
  },

  render: function(){
    console.log('current', this.state.videoQueue)
    if(!this.state.videoQueue){
      return(<div>Loading...</div>)
    }
    return(
      <div className="queue">
        <p>Queue</p>
        {this.getQueue()}
      </div>
    )
  }
})



export default QueueClass;

