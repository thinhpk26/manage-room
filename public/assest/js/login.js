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
    const note = document.querySelector('textarea')
    if(data.note === '')
        data.note = null
    else data.noteMember = note.value
    axios({
        method: 'post',
        url: '/login',
        data
    })
    .then(result => {
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
                        alert('Chúng tôi sẽ đưa bạn vào phòng này ngay!')
                        setCookie('memberIDToken', result.data.memberIDToken, 365)
                        setCookie('roomIDToken', result.data.roomIDToken, 365)
                        window.location.href = '../'
                    } else {
                        if(result.data.hadRequest) {
                            alert('Bạn đã gửi yêu cầu trước đó rồi!')
                        } else {
                            alert('Bạn đã gửi yêu cầu thành công!')
                        }
                    }
                }
                break;
            case 4:
                alert('Bạn không thể cùng lúc tạo phòng và vào phòng')
        }
    })
})