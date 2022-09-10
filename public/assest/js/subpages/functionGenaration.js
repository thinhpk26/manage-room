// Dóng mở navbar - dùng cho điện thoại
const openNav = document.querySelector('#bars-for-mobile > div i')
openNav.onclick = () => {
    document.querySelector('#bars-for-mobile').classList.remove('close')
}
const closeNav = document.querySelector('#nav-for-mobile > div i')
closeNav.onclick = () => {
    document.querySelector('#bars-for-mobile').classList.add('close')
}
function delete_cookie(name) {
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
// Xóa ID khi log out
const logOutElement = document.querySelector('a[href="/login"]')
logOutElement.onclick = () => {
    delete_cookie('memberIDToken')
}
// Mở model đưa dữ liệu lên server
function openModal(identity) {
    document.querySelectorAll('.model-up-server').forEach(ele => {
        if(ele.getAttribute('data-identity') === identity) {
            setTimeout(() => {
                ele.querySelector('input').focus()
                ele.querySelector('input').select()
            })
            const isOpen = ele.getAttribute('data-open')
            if(isOpen === '1') {
                ele.setAttribute('data-open', '0')
            } else ele.setAttribute('data-open', '1')
        }
    })
}
// Đóng modal đưa dữ liệu lên server
function closeModelUpServer() {
    document.querySelectorAll('.model-up-server').forEach(ele => {
        ele.setAttribute('data-open', '0')
    })
}
// Hiệu ứng ko cho phép click
function cancelClick(ele) {
    ele.querySelector('.spinner-border-sm').classList.add('fetching')
    ele.disabled = true
}
// Lấy thẻ cha
function getParent(ele, className) {
    let parent = ele.parentElement
    while(parent) {
        if(parent.className.includes(className)) {
            break
        }
        parent = parent.parentElement
    }
    return parent
}







