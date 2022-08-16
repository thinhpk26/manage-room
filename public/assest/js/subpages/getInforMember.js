'use strict';

(async() => {
    const nowDate = new Date(Date.now())
    const month = nowDate.getUTCMonth() + 1; //months from 1-12
    const day = nowDate.getUTCDate();
    const year = nowDate.getUTCFullYear();
    const nowDateElement = document.querySelector('.date-time h2')
    nowDateElement.innerHTML = `${day + "/" + month + "/" + year}`
    const inforBasicMember = await axios({
        method: 'get',
        url: './member/basic-infor'
    })
    const {name, ingMember, nameRoom, roomID} = inforBasicMember.data
    const nameRoomELement = document.querySelector('nav #name-room')
    console.log(nameRoom, roomID)
    nameRoomELement.setAttribute('data-room-id', roomID)
    nameRoomELement.querySelector('h1').innerHTML = nameRoom
    // Dành cho mobile
    const navForMoblie = document.querySelector('#bars-for-mobile')
    navForMoblie.setAttribute('data-room-id', roomID)
    navForMoblie.querySelector('#nav-for-mobile > div span').innerHTML = nameRoom
    const nameElement = document.querySelector('#intro-member span')
    const avartarElement = document.querySelector('#intro-member .avatar')
    nameElement.innerHTML = name
    if(ingMember) avartarElement.src = ingMember
})()