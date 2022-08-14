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
        console.log(input.id)
        data[input.id] = input.value
    })
    const responseServer = await axios({
        method: 'post',
        url: '/login',
        data
    })
    const resData = responseServer.data.success
    if(resData) {
        setCookie('memberIDToken', responseServer.data.memberIDToken, 365)
        window.location.href = './'
    } else {
        clearTimeout(timer)
        notifyElement.classList.remove('animation-appear')
        setTimeout(() => {
            notifyElement.classList.add('animation-appear')
        }, 1)
        timer = setTimeout(() => {
            notifyElement.classList.remove('animation-appear')
        }, 3000)
    }
})