'use strict';
(async function() {
    // Render số tiền hiện tại
    axios({
        method: 'get',
        url: '../member/basic-infor'
    })
    .then((result) => {
        const {remainMoney} = result.data
        if(remainMoney >= 0 ) document.querySelector('.money-cur b').innerHTML = remainMoney + 'K'
        else document.querySelector('.money-cur span').innerHTML = 'Đang nợ: ' + `<b>${Math.abs(remainMoney)}K</b>`
    })
    .catch((err) => {
        console.log(err)
    })
    // Số lượng recharge đã hiện ra
    let offset = 0
    // Đã hết lịch sử nạp trong database hay chưa
    let exhaustedHisRecharge = false
    // Đã hết lịch sử rút trong database hay chưa
    let exhaustedHisWithdraw = false
    // Render ra cả trên pc và mobile
    const hisRechargeAndWithdrawElement = document.querySelectorAll('.history-recharge-withdraw')
    // Render ui khi người dùng mở trang
    // Lấy dữ liệu lịch sử từ server
    const allHistory = await AllHistory.getAllHistory(offset, offset + 10, exhaustedHisRecharge, exhaustedHisWithdraw).then(result => {
        exhaustedHisRecharge = result.hisRecharge.exhaustedRecharge
        exhaustedHisWithdraw = result.hisWithdraw.exhaustedWithdraw
        if(result.hisRecharge.offset > result.hisWithdraw.offset) {
            offset = result.hisRecharge.offset
        } else {
            offset = result.hisWithdraw.offset
        }
        return result.hisRecharge.inforResponse.concat(result.hisWithdraw.inforResponse)
    })
    hisRechargeAndWithdrawElement.forEach(ele => {
        AllHistory.renderHistoryMember(allHistory, offset, ele, liTagStructure)
    })
    // Render tiếp khi cuộn
    hisRechargeAndWithdrawElement.forEach(ele => {
        ele.addEventListener('scroll', async (e) => {
            if(!(exhaustedHisWithdraw && exhaustedHisRecharge)) {
                if(ele.scrollHeight * 2/3 < ele.clientHeight + ele.scrollTop) {
                    const selectTagElement = document.getElementById('select-your-choose')
                    const beginDay = document.getElementById('day-begin').value
                    const endDay = document.getElementById('day-finish').value
                    if(beginDay === '' && endDay === '') {
                        const errSearchElement = document.querySelector('.error-search')
                        errSearchElement.innerHTML = ''
                        if(selectTagElement.value === 'all') {
                            const allHistory = await AllHistory.getAllHistory(offset, offset + 10, exhaustedHisRecharge, exhaustedHisWithdraw).then(result => {
                                exhaustedHisRecharge = result.hisRecharge.exhaustedRecharge
                                exhaustedHisWithdraw = result.hisWithdraw.exhaustedWithdraw
                                if(result.hisRecharge.offset > result.hisWithdraw.offset) {
                                    offset = result.hisRecharge.offset
                                } else {
                                    offset = result.hisWithdraw.offset
                                }
                                return result.hisRecharge.inforResponse.concat(result.hisWithdraw.inforResponse)
                            })
                            hisRechargeAndWithdrawElement.forEach(ele => {
                                AllHistory.renderHistoryMember(allHistory, offset, ele, liTagStructure)
                            })
                        } else if(selectTagElement.value === 'recharge') {
                            const allHistory = await AllHistory.getHistoryRecharge(exhaustedHisRecharge, offset, offset + 10).then(result => {
                                offset = result.offset
                                exhaustedHisRecharge = result.exhaustedRecharge
                                return result.inforResponse
                            })
                            hisRechargeAndWithdrawElement.forEach(ele => {
                                AllHistory.renderHistoryMember(allHistory, offset, ele, liTagStructure)
                            })
                        } else {
                            const allHistory = await AllHistory.getHistoryWithdraw(exhaustedHisWithdraw, offset, offset + 10).then(result => {
                                offset = result.offset
                                exhaustedHisWithdraw = result.exhaustedWithdraw
                                return result.inforResponse
                            })
                            hisRechargeAndWithdrawElement.forEach(ele => {
                                AllHistory.renderHistoryMember(allHistory, offset, ele, liTagStructure)
                            })
                        }
                    } else if(beginDay !== '' && endDay !== '') {
                        const errSearchElement = document.querySelector('.error-search')
                        errSearchElement.innerHTML = ''
                        if(selectTagElement.value === 'all') {
                            const allHistory = await AllHistory.getAllHistoryWithTime(offset, offset + 10, exhaustedHisRecharge, exhaustedHisWithdraw, beginDay, endDay).then(result => {
                                exhaustedHisRecharge = result.hisRecharge.exhaustedRecharge
                                exhaustedHisWithdraw = result.hisWithdraw.exhaustedWithdraw
                                if(result.hisRecharge.offset > result.hisWithdraw.offset) {
                                    offset = result.hisRecharge.offset
                                } else {
                                    offset = result.hisWithdraw.offset
                                }
                                return result.hisRecharge.inforResponse.concat(result.hisWithdraw.inforResponse)
                            })
                            hisRechargeAndWithdrawElement.forEach(ele => {
                                AllHistory.renderHistoryMember(allHistory, offset, ele, liTagStructure)
                            })
                        }
                        else if(selectTagElement.value === 'recharge') {
                            const allHistory = await AllHistory.getHistoryRechargeWithTime(offset, offset + 10, exhaustedHisRecharge, beginDay, endDay).then(result => {
                                exhaustedHisRecharge = result.exhaustedRecharge
                                offset = result.offset
                                return result.inforResponse
                            })
                            hisRechargeAndWithdrawElement.forEach(ele => {
                                AllHistory.renderHistoryMember(allHistory, offset, ele, liTagStructure)
                            })
                        } else {
                            const allHistory = await AllHistory.getHistoryWithdrawWithTime(offset, offset + 10, exhaustedHisWithdraw, beginDay, endDay).then(result => {
                                exhaustedHisRecharge = result.exhaustedWithdraw
                                offset = result.offset
                                return result.inforResponse
                            })
                            hisRechargeAndWithdrawElement.forEach(ele => {
                                AllHistory.renderHistoryMember(allHistory, offset, ele, liTagStructure)
                            })
                        }
                    } else if(beginDay !== '') {
                        const errSearchElement = document.querySelector('.error-search')
                        errSearchElement.innerHTML = 'Bạn nhập thiếu ngày bắt đầu!!!'
                    } else {
                        const errSearchElement = document.querySelector('.error-search')
                        errSearchElement.innerHTML = 'Bạn nhập thiếu ngày kết thúc!!!'
                    }
                }
            }
        })
    })
    // Sự kiện ẩn hiện rút tiền và nạp tiền
    const ultiElement = document.querySelectorAll('#utilities-recharge section > span')
    ultiElement.forEach(ele => {
        ele.addEventListener('click', (e) => {
            if(ele.parentElement.className.includes('appear-uti')) ele.parentElement.classList.remove('appear-uti')
            else {
                const classNameEle = ele.parentElement.className
                ele.parentElement.classList.add('appear-uti')
                ultiElement.forEach(ele => {
                    if(!ele.parentElement.className.includes(classNameEle)) {
                        ele.parentElement.classList.remove('appear-uti')
                    }
                })
            }
        })
    })
    document.addEventListener('click', (e) => {
        const addMoneyElement = document.querySelector('.add-money')
        const withDrawMoneyElement = document.querySelector('.withdraw-money')
        const addSpanElement = document.querySelector('.utilities-add > span')
        const withdrawSpanElement = document.querySelector('.utilities-withdraw-money > span')
        if(!(addSpanElement.contains(e.target) || withdrawSpanElement.contains(e.target))) {
            if(!addMoneyElement.contains(e.target)) {
                addMoneyElement.parentElement.classList.remove('appear-uti')
            }
            if(!withDrawMoneyElement.contains(e.target)) {
                withDrawMoneyElement.parentElement.classList.remove('appear-uti')
            }
        }
    })
    
    const addMoneyElement = document.querySelector('.add-money')
    const withDrawMoneyElement = document.querySelector('.withdraw-money')
    
    // Nạp tiền
    addMoneyElement.querySelector('.confirm-add-money').addEventListener('click', async(e) => {
        const modalTitleElement = document.querySelector('.modal-title')
        const modalBodyElement = document.querySelector('.modal-body')
        const accountMoney = parseFloat(addMoneyElement.querySelector('#money-recharge').value)
        if(!isNaN(accountMoney)) {
            const footerModelElement = document.querySelector('.modal-footer')
            footerModelElement.innerHTML = `
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
            <button type="button" class="btn btn-primary confirm-change">Đồng ý</button>`
            modalTitleElement.innerHTML = 'Xác Nhận'
            modalBodyElement.innerHTML = `Bạn muốn nạp ${accountMoney}K vào tài khoản!`
            const confirmElement = document.querySelector('.confirm-change')
            // Cập nhật dữ liệu
            confirmElement.addEventListener('click', async() => {
                const dataServerRes = await axios({
                    method: 'post',
                    url: '../recharge-money',
                    data: {accountMoney}
                })
                if(dataServerRes.data.success) window.location.href = '/recharge-money'
                else addMoneyElement.querySelector('span').innerText = dataServerRes.data.message
            })
        } else {
            const footerModelElement = document.querySelector('.modal-footer')
            footerModelElement.innerHTML = `<button type="button" class="btn btn-primary value-err">Đồng ý</button>`
            modalTitleElement.innerHTML = 'Lỗi -_-'
            modalBodyElement.innerHTML = `Bạn nhập sai giá trị! Vui lòng nhập lại`
        }
    })
    
    // Rút tiền
    withDrawMoneyElement.querySelector('.confirm-withdraw-money').addEventListener('click', async(e) => {
        const modalTitleElement = document.querySelector('.modal-title')
        const modalBodyElement = document.querySelector('.modal-body')
        const accountMoneyWithdraw = parseFloat(withDrawMoneyElement.querySelector('#withdraw-money').value)
        if(!isNaN(accountMoneyWithdraw)) {
            const footerModelElement = document.querySelector('.modal-footer')
            footerModelElement.innerHTML = `
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
            <button type="button" class="btn btn-primary confirm-change">Đồng ý</button>`
            modalTitleElement.innerHTML = 'Xác Nhận'
            modalBodyElement.innerHTML = `Bạn muốn rút ${accountMoneyWithdraw}K vào tài khoản!`
            // Cập nhật dữ liệu
            const confirmElement = document.querySelector('.confirm-change')
            confirmElement.addEventListener('click', async() => {
                const dataServerRes = await axios({
                    method: 'post',
                    url: '../withdraw-money',
                    data: {accountMoneyWithdraw}
                })                     
                if(dataServerRes.data.success) window.location.href = '/recharge-money'
                else withDrawMoneyElement.querySelector('span').innerText = dataServerRes.data.message  
            }) 
        } else {
            const footerModelElement = document.querySelector('.modal-footer')
            footerModelElement.innerHTML = `<button type="button" class="btn btn-primary value-err">Đồng ý</button>`
            modalTitleElement.innerHTML = 'Lỗi -_-'
            modalBodyElement.innerHTML = `Bạn nhập sai giá trị! Vui lòng nhập lại`
        }
    })
    // Lọc nạp tiền theo ngày
    const confirmFilterElement = document.querySelector('.confirm-filter span')
    confirmFilterElement.addEventListener('click', async () => {
        hisRechargeAndWithdrawElement.scrollTop = 0
        const selectTagElement = document.getElementById('select-your-choose')
        const beginDay = document.getElementById('day-begin').value
        const endDay = document.getElementById('day-finish').value
        // Thay đổi quá trình lấy dữ liệu
        offset = 0
        exhaustedHisRecharge = false
        exhaustedHisWithdraw = false
        if(beginDay === '' && endDay === '') {
            const errSearchElement = document.querySelector('.error-search')
            errSearchElement.innerHTML = ''
            if(selectTagElement.value === 'all') {
                const allHistory = await AllHistory.getAllHistory(offset, offset + 10, exhaustedHisRecharge, exhaustedHisWithdraw).then(result => {
                    exhaustedHisRecharge = result.hisRecharge.exhaustedRecharge
                    exhaustedHisWithdraw = result.hisWithdraw.exhaustedWithdraw
                    if(result.hisRecharge.offset > result.hisWithdraw.offset) {
                        offset = result.hisRecharge.offset
                    } else {
                        offset = result.hisWithdraw.offset
                    }
                    return result.hisRecharge.inforResponse.concat(result.hisWithdraw.inforResponse)
                })
                hisRechargeAndWithdrawElement.forEach(ele => {
                    AllHistory.renderHistoryMember(allHistory, offset, ele, liTagStructure)
                })
            } else if(selectTagElement.value === 'recharge') {
                const allHistory = await AllHistory.getHistoryRecharge(exhaustedHisRecharge, offset, offset + 10).then(result => {
                    offset = result.offset
                    exhaustedHisRecharge = result.exhaustedRecharge
                    return result.inforResponse
                })
                hisRechargeAndWithdrawElement.forEach(ele => {
                    AllHistory.renderHistoryMember(allHistory, offset, ele, liTagStructure)
                })
            } else {
                const allHistory = await AllHistory.getHistoryWithdraw(exhaustedHisWithdraw, offset, offset + 10).then(result => {
                    offset = result.offset
                    exhaustedHisWithdraw = result.exhaustedWithdraw
                    return result.inforResponse
                })
                hisRechargeAndWithdrawElement.forEach(ele => {
                    AllHistory.renderHistoryMember(allHistory, offset, ele, liTagStructure)
                })
            }
        } else if(beginDay !== '' && endDay !== '') {
            const errSearchElement = document.querySelector('.error-search')
            errSearchElement.innerHTML = ''
            if(selectTagElement.value === 'all') {
                const allHistory = await AllHistory.getAllHistoryWithTime(offset, offset + 10, exhaustedHisRecharge, exhaustedHisWithdraw, beginDay, endDay).then(result => {
                    exhaustedHisRecharge = result.hisRecharge.exhaustedRecharge
                    exhaustedHisWithdraw = result.hisWithdraw.exhaustedWithdraw
                    if(result.hisRecharge.offset > result.hisWithdraw.offset) {
                        offset = result.hisRecharge.offset
                    } else {
                        offset = result.hisWithdraw.offset
                    }
                    return result.hisRecharge.inforResponse.concat(result.hisWithdraw.inforResponse)
                })
                hisRechargeAndWithdrawElement.forEach(ele => {
                    AllHistory.renderHistoryMember(allHistory, offset, ele, liTagStructure)
                })
            }
            else if(selectTagElement.value === 'recharge') {
                const allHistory = await AllHistory.getHistoryRechargeWithTime(offset, offset + 10, exhaustedHisRecharge, beginDay, endDay).then(result => {
                    exhaustedHisRecharge = result.exhaustedRecharge
                    offset = result.offset
                    return result.inforResponse
                })
                hisRechargeAndWithdrawElement.forEach(ele => {
                    AllHistory.renderHistoryMember(allHistory, offset, ele, liTagStructure)
                })
            } else {
                const allHistory = await AllHistory.getHistoryWithdrawWithTime(offset, offset + 10, exhaustedHisWithdraw, beginDay, endDay).then(result => {
                    exhaustedHisRecharge = result.exhaustedWithdraw
                    offset = result.offset
                    return result.inforResponse
                })
                hisRechargeAndWithdrawElement.forEach(ele => {
                    AllHistory.renderHistoryMember(allHistory, offset, ele, liTagStructure)
                })
            }
        } else if(beginDay !== '') {
            const errSearchElement = document.querySelector('.error-search')
            errSearchElement.innerHTML = 'Bạn nhập thiếu ngày bắt đầu!!!'
        } else {
            const errSearchElement = document.querySelector('.error-search')
            errSearchElement.innerHTML = 'Bạn nhập thiếu ngày kết thúc!!!'
        }
    })
    // reset lữ liệu
    const selectTagElement = document.getElementById('select-your-choose')
    selectTagElement.addEventListener('change', () => {
        offset = 0
        exhaustedHisRecharge = false
        exhaustedHisWithdraw = false
    })
})()
// Cấu trúc của thẻ li
function liTagStructure(ele) {
    if(ele.hasOwnProperty('rechargeID')) {
        const datetime = new Date(ele.rechargeDay)
        const time = datetime.toTimeString().slice(0, 9) // Lấy thời gian
        const month = datetime.getUTCMonth() + 1; //months from 1-12
        const day = datetime.getUTCDate();
        const year = datetime.getUTCFullYear();
        return `
        <li data-id="${ele.rechargeID}" data-name="recharge">
            <p>Thêm <b>${ele.accountMoneyRecharge}K</b> vào quỹ vào <b>${time}</b> ngày <b>${day + "/" + month + "/" + year}</b></p>
            <div class="ultilities-delete-update">
                <span>Sửa</span>
                <span class="del-history">
                    <button data-bs-toggle="modal" data-bs-target="#staticBackdrop">Xóa</button>
                </span>
            </div>
        </li>`
    } else {
        const datetime = new Date(ele.withdrawDay)
        const time = datetime.toTimeString().slice(0, 9) // Lấy thời gian
        const month = datetime.getUTCMonth() + 1; //months from 1-12
        const day = datetime.getUTCDate();
        const year = datetime.getUTCFullYear();
        return `
        <li data-id="${ele.withdrawID}" data-name="withdraw">
            <p>Rút <b>${ele.withdrawMoney}K</b> vào quỹ vào <b>${time}</b> ngày <b>${day + "/" + month + "/" + year}</b></p>
            <div class="ultilities-delete-update">
                <span>Sửa</span>
                <span class="del-history">
                    <button data-bs-toggle="modal" data-bs-target="#staticBackdrop">Xóa</button>
                </span>
            </div>
        </li>`
    }
}