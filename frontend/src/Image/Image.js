import React, {Component} from 'react';
// import PropTypes from 'prop-types';
import './Image.css';
import {Icon} from 'semantic-ui-react';
import Mark from './Mark';
import Declaration from './Declaration';
import { withRouter } from 'react-router-dom';
import ReactImageProcess from 'react-image-process';
import { Link } from 'react-router-dom';

const im = ["https://postfiles.pstatic.net/MjAxOTA3MzBfNyAg/MDAxNTY0NDkxMzU1MjYw.6PsoCMM-IhbyMp28iN-PGLiPRgFhUk85GP-iLWcQLsIg.qG9gNv0c480J1n8PkTKyD8SqKvkheTeFjVtuphz3CaEg.JPEG.she2325/7.jpg?type=w966",
"https://postfiles.pstatic.net/MjAxOTA3MzBfODgg/MDAxNTY0NDkxMzU0OTY3.1VS0WEhoUmxz31Yv_Fqn8hTz0b_PI67lgDJsn3u3igcg.IeT-JpGIgHGKxUR-exblUdRKTSHZCJhaHNFQMcqxzEMg.JPEG.she2325/8.jpg?type=w966",
"https://postfiles.pstatic.net/MjAxOTA3MzBfMTEg/MDAxNTY0NDkxMzU0ODY3.6eVSLBjwuAl2I_PZJl-rETOeIlCPLoH6Zd3BsRXu1LMg.WbPXfoyS3ACPaWJ73skzmsjnD1eHClaVgbpxAEw2cJ4g.JPEG.she2325/9.jpg?type=w966",
"https://postfiles.pstatic.net/MjAxOTA3MzBfMjA2/MDAxNTY0NDkxMzU1NDQ2.vY704r4pmlsPx_ijWiAWMCbNUBw101-pRDzUxh7vxX8g.K9VsOmd0BkLHn73-GrF2nLzh4n1KzZiH2eoPfKHiWOAg.JPEG.she2325/11.jpg?type=w966",
"https://postfiles.pstatic.net/MjAxOTA4MDVfMjcy/MDAxNTY1MDExNDA0NDQ0.6HOnJFq9OjAMYWAZcLNX1a8okDNHPRLm0s0Y6djzHUEg.fOX-DQbLGo_rUjmP9kR2vNp_ZKd6S8UnaWdeqRqnPK4g.JPEG.she2325/jailam-rashad-1297005-unsplash.jpg?type=w966"];

class Image extends Component {
    
    state = {
        imageWidthHalf: "",
        imageHeightHalf:"",
        waterMarkWidth: "",
        waterMarkHeight: "",
        imageScreenWidth: 0,
        imageScreenHeight: 0
    }

    componentDidMount(){
            //원본 이미지 너비가 높이보다 크면
            if(this.img.naturalWidth > this.img.naturalHeight){
                this.setState({
                    imageWidthHalf: this.img.naturalWidth/2.8,
                    imageHeightHalf: this.img.naturalHeight/4.6,
                    imageScreenWidth: 6000,
                    imageScreenHeight: 4000
                }) 
            } 
    
            //너비가 높이보다 작으면
            else {
                this.setState({
                    imageWidthHalf: this.img.naturalWidth/3.1,
                    imageHeightHalf: this.img.naturalHeight/2.8,
                    imageScreenWidth: 1500,
                    imageScreenHeight: 3000
                }) 
            }
    
            //이미지 너비와 높이에 따른 워터마크 크기
            this.img.naturalWidth < 4000 && this.img.naturalHeight < 4000 ?
            this.setState({
                waterMarkWidth: 900,
                waterMarkHeight: 900
            })  :
            this.setState({
                waterMarkWidth: 1800,
                waterMarkHeight: 1800
            })
                
            console.dir(this.img)
            console.log(this.img.naturalWidth)
            console.log(this.img.naturalHeight)
    }   
    
    img;

    render(){
        const {id, like, isLike, view, size, match} = this.props
        const {imageHeightHalf, imageWidthHalf, waterMarkWidth, waterMarkHeight, imageScreenWidth, imageScreenHeight} = this.state

        return( 
        <div className ="Imagei">
        <div className = "Image-Column">
           
            <ReactImageProcess
                mode="compress"
                quality={0.0001}
            >
                <ReactImageProcess
                    mode="waterMark"
                    waterMarkType="image"
                    waterMark={require(`../img/Logo.svg`)}    //워터마크 이미지 경로
                    width={waterMarkWidth}      //워터마크 너비
                    height={waterMarkHeight}    //워터마크 높이
                    opacity={0.4}
                    coordinate={[imageWidthHalf, imageHeightHalf]}  //워터마크 위치
                >   
                   <img className = "MainImage" ref = {(c) => {this.img = c}} src={require(`../img/photo/${match.params.id}`)} width={imageScreenWidth} height={imageScreenHeight} alt = {id}/>
                </ReactImageProcess> 
                
            </ReactImageProcess>
            

            
            
        </div>    
        <ImageUseInformation like = {like} isLike = {isLike} view = {view} size = {size} />
        <p className = "Relatied-Title Image-Column"> Relatied Image</p>
        <RelationImage id = {id}/>
        </div>
        )
    }
}

class ImageUseInformation extends Component {
    
    //Mark가 들어간건 즐겨찾기
    //Dec가 들어간건 신고창
    //Like가 들어간건 좋아요

    state = {
        isMarkPopUpOpen: false,
        isMarkClick: false,
        isDecPopUpOpen: false,
        isLikeClick: false,
        like: this.props.like
    }

    openMarkPopUp = () => {
        this.setState({
            isMarkPopUpOpen: true
        })
    }

    closeMarkPopUp = () => {
        this.setState({
            isMarkPopUpOpen: false
        })
    }

    openDecPopUp = () => {
        this.setState({
            isDecPopUpOpen: true
        })
    }

    closeDecPopUp = () => {
        this.setState({
            isDecPopUpOpen: false
        })
    }
    
    clickMark = () =>{
        this.setState({
            isMarkClick: true
        })
    }

    reclickMark = () => {
        this.setState({
            isMarkClick: false,
            isMarkPopUpOpen: false
        })
    }

    clickLike = () =>{
        this.setState({
            isLikeClick: true,
            like: this.state.like + 1   //한 번 누르면 증가
        })
    }

    reclickLike = () => {
        this.setState({
            isLikeClick: false,
            like: this.state.like - 1   //한 번 누르면 감소
        })
    }

    onClickDeclaration = () => {
        this.state.isDecPopUpOpen ? this.closeDecPopUp() : this.openDecPopUp()
    }

    onClickMark = () => {
       
        this.state.isMarkPopUpOpen ? this.closeMarkPopUp() : this.openMarkPopUp()
        this.state.isMarkClick ? this.reclickMark() : this.clickMark()
        
    }

    onClickLike = () => {
        this.state.isLikeClick ? this.reclickLike() : this.clickLike()
    }

    render(){
        
        let markname = this.state.isMarkClick ? "star" : "star outline"

        let likename = this.state.isLikeClick ? "heart" : "heart outline"

        return(
            <div className = "Image-Column">
            <p> {this.props.size} </p>
            <div className = "Image-UseInforfmation">
                <div className = "Image-UseInforfmation-Item">
                    <Icon className = "Declaration" name = "warning circle" onClick={this.onClickDeclaration}/>
                    <Declaration isOpen={this.state.isDecPopUpOpen} close={this.closeDecPopUp} />
                </div>
                <div className = "Image-UseInforfmation-Item">
                    {
                        ((localStorage.usertoken === undefined) && (sessionStorage.usertoken === undefined)) 
                        
                        ? <Link to = "/user/login" alt="test"><Icon className = "Mark" name = {markname} onClick = {this.onClickMark}/></Link>
                        : 
                        <Icon className = "Mark" name = {markname} onClick = {this.onClickMark}/> 
                    }
                    <Mark isOpen={this.state.isMarkPopUpOpen} close={this.closeMarkPopUp} />
                    
                </div>
                <div className = "Image-UseInforfmation-Item">
                    <Icon className = "Like" name = {likename} onClick={this.onClickLike}/>
                    {this.state.like}
                </div>
                <div className = "Image-UseInforfmation-Item">
                    <Icon className = "view " name = "eye"/>
                    {this.props.view}
                </div>
            </div>
            </div>
        )
    }
}


class RelationImage extends Component{
    state = {
        image : [{
            id : "0",
            tags : ["풍경", "하늘", "푸른"]
        },{
            id : "1",
            tags: ["풍경", "푸른", "태그"]
        },{
            id : "2",
            tags : ["야자수", "푸", "밝은"]
        },{
            id : "3",
            tags : ["풍경", "태", "밝은"]
        },{
            id : "4",
            tags : ["풍경", "태그", "밝은"]
        }]
    }

    searchImage(){
        const relation = [];
        this.state.image.some((image) => {
            let n;
            if(1 !== image.id){
                n = 0;
                this.state.image[this.props.id].tags.forEach((tag) => {
                    if(image.tags.indexOf(tag) !== -1)
                        n++;
                })
            }
            if(n >= 1){
                relation.push(image);
            }// 일단은 이렇게!!!!!!! 백엔드에 따라 달라질 것, 동일 카테고리 내에서만 찾는 게 나을듯 
            if (relation.length === 3) return true; //break
            else return false; // 계속!
        })
        return relation;
    }


    render_Image(){
        
       const relation = this.searchImage().map((image) => {
            return (
                <div className = "Image-Relation" style = {{ backgroundImage : `url(${im[image.id]})`}}/>
            )
       })
       return relation;
    }

    render(){
        
        return( 
            <div className = "Image-Column">
                {this.render_Image()}
            </div>
        );
    }
}



export default withRouter(Image);