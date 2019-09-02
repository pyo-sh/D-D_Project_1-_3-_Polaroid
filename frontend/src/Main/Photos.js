import React, { Component } from 'react';
import './Photos.css';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from 'react-router-dom';
import { CSSGrid, measureItems, makeResponsive,layout } from 'react-stonecutter';

const Grid = makeResponsive(measureItems(CSSGrid, {measureImages :  true }), {
  maxWidth: 1500
});

class Photos extends Component {
    state = {
        images: [],
        count: 30,
        start: 1,
        isMore : true
      };
    
    componentDidMount() {
      const { count, start } = this.state;
      axios.post(`/api/file/photos`,{count,start})
        .then(response => {
          this.setState({ images: response.data.photos})
        })
        .catch(err => console.error(err))
    }
    
    fetchImages = () => {
      const count = this.state.count,
            start = count + this.state.start;
      this.setState({ start: start });
 
      axios.post(`/api/file/photos`,{count,start})
        .then(response => {
          this.setState({ images: this.state.images.concat(response.data.photos),
                          isMore : response.data.isMore})
        })
        .catch(err => console.error(err))
     }
    
    render() {
        return (
            <div className = "Photos">   
                  <InfiniteScroll dataLength = {this.state.images.length} next = {this.fetchImages} hasMore = {this.state.isMore}>
                    <Grid className = "Grid" component="ul" columnWidth={400} gutterWidth = {5} gutterHeight = {5} layout = {layout.pinterest}>
                      {this.state.images.map((image, index) => (
                        <li key = {index} >
                            <Link to = {`/imagepage/${image}`}>
                              <img className = "Photo" src={require(`../img/photo/${image}`)} alt=""/>
                            </Link>
                        </li>
                      ))}
                    </Grid>
                </InfiniteScroll>
            </div>
        );
    }
  }

export default Photos;