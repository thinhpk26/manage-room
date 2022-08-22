'use strict';
(async () => {
    axios({
        method: 'get',
        url: '../room/request-room'
    })
    .then(result => {
        if(result.data.length > 0) {
            result.data.forEach(data => {
                const liTag = document.createElement('li')
                liTag.setAttribute('data-memberID', data.memberID)
                console.log(typeof data.note)
                liTag.innerHTML = `<span>${data.name} đã gửi yêu cầu vào room <br> Lời nhắn: ${data.note === ''|| !data.note ? '(Không có)' : data.note} </span>
                <div>
                     <button class="confirm">Xác nhận</button>
                     <button class="cancel">Hủy</button>
                </div> `
                document.querySelector('.request-into-room ul').appendChild(liTag)
            })
            const AllRequestElement = document.querySelectorAll('.request-into-room li')
            AllRequestElement.forEach((ele, index) => {
                // Đồng ý yêu cầu vào
                ele.querySelector('.confirm').onclick = () => {
                    axios({
                        method: 'put',
                        url: '../room/confirm-request',
                        data: {memberID: ele.getAttribute('data-memberID')}
                    })
                    .then(result => {
                        if(result.data.success) {
                            alert('Đã xác nhận yêu cầu thành công!')
                            window.location.reload()
                        }
                    })
                    .catch(err => {
                        console.error(err)
                    })
                }
                // Hủy yêu cầu vào
                ele.querySelector('.cancel').onclick = () => {
                    axios({
                        method: 'delete',
                        url: '../room/cancel-request',
                        data: {memberID: ele.getAttribute('data-memberID')}
                    })
                    .then(result => {
                        if(result.data.success) {
                            alert('Đã hủy yêu cầu thành công!')
                            window.location.reload()
                        }
                    })
                    .catch(err => {
                        console.error(err)
                    })
                }
            })
        } else {
            document.querySelector('.request-into-room ul').innerHTML = `<span class='fs-16'>Không có yêu cầu vào</span>`
            document.querySelector('.request-into-room ul').style.textAlign = 'center'
        }
    })
    .catch(err => {
        alert('Có lỗi gì đó! Chúng tôi sẽ sửa cho ban ngay.')
        window.location.reload()
    }) 
})()