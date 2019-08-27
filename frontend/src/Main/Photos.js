import React, { Component } from 'react';
import './Photos.css';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import Photo from './Photo';

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
                <InfiniteScroll
                    dataLength = {this.state.images.length}
                    next = {this.fetchImages}
                    hasMore = {this.state.isMore}
                    loader = {<h4>Loading..</h4>}
                    >
                      
                    {this.state.images.map((image, index) => (
                       <Photo key={image.id} image={image} />
                     ))}
                </InfiniteScroll>
            </div>
        );
    }
  }

export default Photos;

