'use strict';

(async () => {
    const form = document.querySelector('form')
    const errorElement = document.querySelector('span')
    const accountElement = document.querySelector('input[name="account"]')
    const passwordElement = document.querySelector('input[name="password"]')
    const retypePasswordElement = document.querySelector('input[name="retype-password"]')
    const nameElement = document.querySelector('input[name="name"]')
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        if(accountElement.value === '') {
            errorElement.innerHTML = 'Bạn chưa nhập tên tài khoản'
            return
        }
        if(accountElement.value.length < 6 || accountElement.value.length > 50) {
            errorElement.innerHTML = 'Tên tài khoản phải dài hơn 6 kí tự và nhỏ hơn 50 kí tự'
            return
        }
        if(passwordElement.value.length < 8 || passwordElement.value.length > 50) {
            errorElement.innerHTML = 'Mật khẩu phải dài hơn 8 kí tự và nhỏ hơn 50 kí tự'
            return
        }
        if(!(passwordElement.value === retypePasswordElement.value)) {
            errorElement.innerHTML = 'Mật khẩu bạn nhập lại không đúng!'
            return
        }
        if(nameElement.value.length < 6 || nameElement.value.length > 50) {
            errorElement.innerHTML = 'Tên phải dài hơn 6 kí tự và nhỏ hơn 50 kí tự'
            return
        }
        axios({
            method: 'post',
            url: '../member/create-user',
            data: {
                account: accountElement.value,
                password: passwordElement.value,
                name: nameElement.value
            }
        })
        .then(result => {
            document.querySelector('.sign-up').classList.remove('fetching')
            document.querySelector('.sign-up').disabled = false
            if(result.data.success) {
                window.location.href = './login'
            } else {
                errorElement.innerHTML = 'Tài khoản tồn tại!!!'
            }
        })
        .catch(err => {
            console.log(err)
        })
        document.querySelector('.sign-up').classList.add('fetching')
        document.querySelector('.sign-up').disabled = true
    })
})()