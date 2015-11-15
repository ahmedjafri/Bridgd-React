import React from 'react';
import $ from 'jquery';
import TextField from 'material-ui/lib/text-field';
import List from 'material-ui/lib/lists/list';
import ListDivider from 'material-ui/lib/lists/list-divider';
import ListItem from 'material-ui/lib/lists/list-item';

import PlayerStore from '../stores/player-store.js';
import QueueStore from '../stores/queue-store.js';
import {enqueueVideo} from '../actions/actions.js';

var SearchBarClass = React.createClass({
  getInitialState: function(){
    return {
      results : null
    }
  },

  search: function(e){
    var self = this;
    var query = e.target.value;
    if(query.length > 2){
       $.ajax({
        url: 'https://www.googleapis.com/youtube/v3/search',
        data: {
          key: 'AIzaSyA-2P-UjlhcwiMC4P6z0z9f-SU7s4FMIJQ',
          type: 'video',
          maxResults: '8',
          part: 'id,snippet',
          fields: 'items/id,items/snippet/title,items/snippet/description,items/snippet/thumbnails/default,items/snippet/channelTitle',
          q: query
        }
      })
      .done( function (data) {
        self.setState({results: data.items})
      })
    }
   
  },

  showResults: function(e){
    var self = this;
    if(this.state.results){
      return(
        <div>
          {this.state.results.map(function(item){
            return(
              <ListItem
                key={item.id.videoId}
                leftIcon={<img src={item.snippet.thumbnails.default.url} />}
                primaryText={item.snippet.title}
                secondaryText={item.snippet.channelTitle}
                secondaryTextLines={2} 
                onClick={this.queueVideo.bind(null, item)}/>
            )
          }.bind(this))}
        </div>
      )
    }else if(this.state.results && this.state.results.length == 0){
      return(
        <div>No results</div>
      )
    }
  },

  queueVideo: function(vid){
    var videos = QueueStore.getQueueState().videos;
    var dupe =videos.filter(obj => {
      return obj.id.videoId == vid.id.videoId
    });
   
    if(dupe.length ==  0){
      console.log('Added')
      enqueueVideo(vid);
    }
  },

  clearResult: function(){
    this.setState({results: null})
  },

  render: function(){
    const {results} = this.state;
    return(
      <div className="results">
        <TextField hintText="Search for Videos"  onChange={this.search}/>
        {results && <i className="material-icons" onClick={this.clearResult}>keyboard_arrow_up</i>}
        <List>
          {this.showResults()}
        </List>
      </div>
    )
  } 
})

module.exports = SearchBarClass; 