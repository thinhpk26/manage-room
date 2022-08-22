const lightOrDarkElement = document.querySelector('#light-or-dark > div')
let isLight = localStorage.getItem('isLight')
if(isLight === '0' || isLight === undefined) {
    isLight = 0
} else {
    isLight = 1
}
addLightOrDark(lightOrDarkElement, isLight)
lightOrDarkElement.addEventListener('click', () => {
    isLight = isLight ? 0 : 1
    addLightOrDark(lightOrDarkElement, isLight)
    localStorage.setItem('isLight', isLight.toString())
})
function addLightOrDark(ele, isLight) {
    if(isLight) {
        ele.classList.add('light')
        ele.classList.remove('dark')
        document.documentElement.style.setProperty('--border-color', '#6a6a6a6e');
        document.documentElement.style.setProperty('--color-bg-dark', '#f3f3fa');
        document.documentElement.style.setProperty('--color-text-dark', '#403f46');
        document.documentElement.style.setProperty('--bg-blur', 'rgba(0, 0, 0, 0.05)');
        document.documentElement.style.setProperty('--bg-blur-strong', 'rgba(0, 0, 0, 0.1)');
    } else {
        ele.classList.remove('light')
        ele.classList.add('dark')
        document.documentElement.style.setProperty('--border-color', '#cccccc6e');
        document.documentElement.style.setProperty('--color-bg-dark', '#282a36');
        document.documentElement.style.setProperty('--color-text-dark', '#dedede');
        document.documentElement.style.setProperty('--bg-blur', 'rgba(255, 255, 225, 0.05)');
        document.documentElement.style.setProperty('--bg-blur-strong', 'rgba(255, 255, 225, 0.1)');
    }
}

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