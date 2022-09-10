function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
const form = document.querySelector('form')
var timer
const notifyElement = document.querySelector('.not-true-member')
notifyElement.addEventListener("webkitAnimationEnd", () => {
    clearTimeout(timer)
    notifyElement.classList.remove('animation-appear')
}, false)

form.addEventListener('submit', async(e) => {
    e.preventDefault()
    const inputs = form.querySelectorAll('input')
    // data lấy thông tin user nhập vào input
    const data = {}
    inputs.forEach(input => {
        if(input.getAttribute('name') !== '')
            data[input.getAttribute('name')] = input.value
        else data[input.getAttribute('name')] = null
    })
    axios({
        method: 'post',
        url: '/login',
        data
    })
    .then(result => {
        document.querySelector('button.login').disabled = false
        document.querySelector('button.login').classList.remove('fetching')
        switch(result.data.type) {
            case 1:
                if(!result.data.success) {
                    clearTimeout(timer)
                    notifyElement.classList.remove('animation-appear')
                    setTimeout(() => {
                        notifyElement.classList.add('animation-appear')
                    }, 1)
                    timer = setTimeout(() => {
                        notifyElement.classList.remove('animation-appear')
                    }, 3000)
                } else {
                    alert('Bạn cần nhập tên phòng hoặc tạo thêm phòng!')
                }
                break;
            case 2:
                if(result.data.success) {
                    alert('Tạo phòng thành công')
                    setCookie('memberIDToken', result.data.memberIDToken, 365)
                    setCookie('roomIDToken', result.data.roomIDToken, 365)
                    window.location.href = '../'
                }
                break;
            case 3:
                if(!result.data.isRoom) {
                    alert('Không tồn tại phòng này')
                } else {
                    if(result.data.isMember) {
                        setCookie('memberIDToken', result.data.memberIDToken, 365)
                        setCookie('roomIDToken', result.data.roomIDToken, 365)
                        window.location.href = '../'
                    } else {
                        if(result.data.hadRequest) {
                            alert('Bạn đã gửi yêu cầu trước đó rồi!')
                        } else {
                            document.querySelector('.send-request-to-room').click()
                            document.querySelector('.confirm-send-request').onclick = () => {
                                const noteForHost = document.querySelector('textarea[name="message-for-host"]')
                                const account = document.querySelector('input[name="account"]')
                                const password = document.querySelector('input[name="password"]')
                                const endcodeRoom = document.querySelector('input[name="endcodeRoom"]')
                                axios({
                                    method: 'post',
                                    url: '../room/send-request',
                                    data: {
                                        account: account.value,
                                        password: password.value,
                                        noteForHost: noteForHost.value,
                                        endcodeRoom: endcodeRoom.value,
                                    }
                                })
                                .then(result => {
                                    document.querySelector('.confirm-send-request').classList.remove('fetching')
                                    document.querySelector('.confirm-send-request').disabled = false
                                    if(result.data.success) {
                                        alert('Bạn đã gửi yêu cầu thành công!')
                                        document.querySelector('.cancel-send').click()
                                    }
                                })
                                .catch(err => {
                                    console.error(err)
                                })
                                document.querySelector('.confirm-send-request').classList.add('fetching')
                                document.querySelector('.confirm-send-request').disabled = true
                            }
                        }
                    }
                }
                break;
            case 4:
                alert('Bạn không thể cùng lúc tạo phòng và vào phòng')
        }
    })
    document.querySelector('button.login').disabled = true
    document.querySelector('button.login').classList.add('fetching')
})
// Tìm phòng
document.querySelector('.find-room').onclick = () => {
    const accountELement = document.querySelector('#account')
    const passwordElement = document.querySelector('#password')
    axios({
        method: 'post',
        url: '../room/get-all-room-of-user',
        data: {
            account: accountELement.value,
            password: passwordElement.value,
        }
    })
    .then(result => {
        document.querySelector('.find-room').disabled = false
        document.querySelector('.find-room').classList.remove('fetching')
        console.log(result)
        if(!result.data.success) {
            alert('Tài khoản mật khẩu không chính xác!!')
        }
        else if(result.data.allRoom.length > 0) {
            const ulTag = document.querySelector('.find-room-cover ul')
            let allRoomElement = ''
            result.data.allRoom.forEach(ele => {
                allRoomElement += `<li>
                    <span>Tên phòng: ${ele.nameRoom} - Mã Phòng: ${ele.roomID}</span>
                    <i class="fa-solid fa-circle-arrow-up"></i>
                </li>`
            })
            ulTag.innerHTML = `<span style="font-size: 18px; font-weight: 500">Mã phòng:</span>` + allRoomElement
            ulTag.querySelectorAll('li').forEach(ele => {
                ele.querySelector('i').onclick = () => {
                    const text = ele.querySelector('span').textContent
                    const id = text.trim().slice(text.length - 16, text.length)
                    document.querySelector('input[name="endcodeRoom"]').value = id
                }
            })
        } else {
            document.querySelector('.find-room-cover').append('Bạn chưa có phòng nào!!')
        }
    })
    .catch(err => {
        console.log(err)
    })
    document.querySelector('.find-room').disabled = true
    document.querySelector('.find-room').classList.add('fetching')
}
