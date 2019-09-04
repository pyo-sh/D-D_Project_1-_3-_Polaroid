import axios from 'axios';
import jwt_decode from 'jwt-decode';

export const addFollow = async ({userID, targetID}) => {
  return await axios
  .get('api/Follow/addFollow',{
    followID: userID,
    followerID: targetID
  })
  .then(res => {
    console.log("팔로잉 추가하는 것");
    return res;
  })
  .catch(err => {
    console.log(err);
  })
}

export const deleteFollow = async ({userID, targetID}) => {
  return await axios
  .get('api/Follow/deleteFollow',{
    followID: userID,
    followerID: targetID
  })
  .then(res => {
    console.log("팔로잉 취소하는 것");
    return res;
  })
  .catch(err => {
    console.log(err);
  })
}

export const getFollowingInfo = async userID => {
    return await axios
    .get(`/api/Follow/getFollow`, {
        followerID: userID
    })
    .then(res => {
        console.log("팔로잉의 res는");
        console.log(res);
        return res;
    })
    .catch(err => {
        console.log(err);
    })
}

export const getFollowerInfo = async userID => {
  return await axios
  .get(`/api/Follow/getMyFollow`, {
    followID: userID
  })
  .then(res => {
      console.log("팔로워의 res는")
      console.log(res);
      return res.data.follower;
  })
  .catch(err => {
      console.log(err);
  })
}

export const isFollowInfo = async ({userID, targetID}) =>{
    return await axios
    .get('/api/Follow/getOneFollow', {
      followID: userID,
      followerID: targetID
    })
    .then(res => {
      console.log("팔로잉중인지 아닌지의 boolean은")
      console.log(res);
      return res.data.follower;
    })
}

export const getMyID = () => {
  let token = '';
  localStorage.usertoken ? token = localStorage.getItem('usertoken') : token = sessionStorage.getItem('usertoken');
  const decode = jwt_decode(token);
  const ID = decode.ID;
  return ID;
}