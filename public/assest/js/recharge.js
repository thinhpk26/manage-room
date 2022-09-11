'use strict';
(async function() {
    // Render số tiền hiện tại
    axios({
        method: 'get',
        url: '../member/basic-infor'
    })
    .then((result) => {
        const {remainMoney} = result.data
        if(remainMoney >= 0 ) document.querySelector('.money-cur b').innerHTML = changeMoney(remainMoney) + 'đ'
        else document.querySelector('.money-cur span').innerHTML = 'Đang nợ: ' + `<b>${changeMoney(Math.abs(remainMoney))}đ</b>`
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
    
    // Nạp tiền
    const addMoneyElement = document.querySelector('.model-up-server[data-identity="recharge"]')
    addMoneyElement.querySelector('.model-confirm').addEventListener('click', async(e) => {
        const modalTitleElement = document.querySelector('#confirm-recharge .modal-title')
        const modalBodyElement = document.querySelector('#confirm-recharge .modal-body')
        const modalFooterElement = document.querySelector('#confirm-recharge .modal-footer')
        const accountMoney = parseFloat(addMoneyElement.querySelector('#recharge-money').value.split('.').join(''))
        if(!isNaN(accountMoney)) {
            modalTitleElement.innerHTML = 'Xác nhận'
            modalBodyElement.innerHTML = `Bạn muốn nạp ${changeMoney(accountMoney)}đ vào tài khoản!`
            modalFooterElement.innerHTML = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
            <button type="button" class="btn btn-primary confirm-change" onclick="cancelClick(this)">
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Đồng ý
            </button>`
            // Cập nhật dữ liệu
            document.querySelector('#confirm-recharge .confirm-change').addEventListener('click', async() => {
                const dataServerRes = await axios({
                    method: 'post',
                    url: '../recharge-money',
                    data: {accountMoney}
                })
                if(dataServerRes.data.success) window.location.href = '/recharge-money'
                else {
                    modalTitleElement.innerHTML = '<span class="fs-24" style="color: red;">Lỗi</span>'
                    modalBodyElement.innerHTML = dataServerRes.data.message
                    modalFooterElement.innerHTML = ''
                }
            })
        } else {
            modalTitleElement.innerHTML = '<span class="fs-24" style="color: red;">Lỗi</span>'
            modalBodyElement.innerHTML = 'Bạn chưa nhập số tiền nạp'
            modalFooterElement.innerHTML = ''
        }
    })
    
    // Rút tiền
    const withDrawMoneyElement = document.querySelector('.model-up-server[data-identity="withdraw"]')
    withDrawMoneyElement.querySelector('.model-confirm').addEventListener('click', async(e) => {
        const modalTitleElement = document.querySelector('#confirm-withdraw .modal-title')
        const modalBodyElement = document.querySelector('#confirm-withdraw .modal-body')
        const modalFooterElement = document.querySelector('#confirm-withdraw .modal-footer')
        const accountMoneyWithdraw = parseFloat(withDrawMoneyElement.querySelector('#withdraw-money').value.split('.').join(''))
        if(!isNaN(accountMoneyWithdraw)) {
            modalTitleElement.innerHTML = 'Xác nhận'
            modalBodyElement.innerHTML = `Bạn muốn rút ${accountMoneyWithdraw}đ ra khỏi tài khoản!`
            modalFooterElement.innerHTML = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
            <button type="button" class="btn btn-primary confirm-change" onclick="cancelClick(this)">
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Đồng ý
            </button>`
            // Cập nhật dữ liệu
            document.querySelector('.confirm-change').addEventListener('click', async() => {
                const dataServerRes = await axios({
                    method: 'post',
                    url: '../withdraw-money',
                    data: {accountMoneyWithdraw}
                })                     
                if(dataServerRes.data.success) window.location.href = '/recharge-money'
                else {
                    modalTitleElement.innerHTML = '<span class="fs-24" style="color: red;">Lỗi</span>'
                    modalBodyElement.innerHTML = dataServerRes.data.message
                    modalFooterElement.innerHTML = ''
                }
            }) 
        } else {
            modalTitleElement.innerHTML = '<span class="fs-24" style="color: red;">Lỗi</span>'
            modalBodyElement.innerHTML = 'Bạn chưa nhập số tiền rút'
            modalFooterElement.innerHTML = ''
        }
    })

    // Lọc nạp tiền theo ngày
    const confirmFilterElement = document.querySelector('.confirm-filter button')
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
                confirmFilterElement.querySelector('.spinner-border-sm').classList.remove('fetching')
                confirmFilterElement.disabled = false
            } else if(selectTagElement.value === 'recharge') {
                const allHistory = await AllHistory.getHistoryRecharge(exhaustedHisRecharge, offset, offset + 10).then(result => {
                    offset = result.offset
                    exhaustedHisRecharge = result.exhaustedRecharge
                    return result.inforResponse
                })
                hisRechargeAndWithdrawElement.forEach(ele => {
                    AllHistory.renderHistoryMember(allHistory, offset, ele, liTagStructure)
                })
                confirmFilterElement.querySelector('.spinner-border-sm').classList.remove('fetching')
                confirmFilterElement.disabled = false
            } else {
                const allHistory = await AllHistory.getHistoryWithdraw(exhaustedHisWithdraw, offset, offset + 10).then(result => {
                    offset = result.offset
                    exhaustedHisWithdraw = result.exhaustedWithdraw
                    return result.inforResponse
                })
                hisRechargeAndWithdrawElement.forEach(ele => {
                    AllHistory.renderHistoryMember(allHistory, offset, ele, liTagStructure)
                })
                confirmFilterElement.querySelector('.spinner-border-sm').classList.remove('fetching')
                confirmFilterElement.disabled = false
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
                confirmFilterElement.querySelector('.spinner-border-sm').classList.remove('fetching')
                confirmFilterElement.disabled = false
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
                confirmFilterElement.querySelector('.spinner-border-sm').classList.remove('fetching')
                confirmFilterElement.disabled = false
            } else {
                const allHistory = await AllHistory.getHistoryWithdrawWithTime(offset, offset + 10, exhaustedHisWithdraw, beginDay, endDay).then(result => {
                    exhaustedHisRecharge = result.exhaustedWithdraw
                    offset = result.offset
                    return result.inforResponse
                })
                hisRechargeAndWithdrawElement.forEach(ele => {
                    AllHistory.renderHistoryMember(allHistory, offset, ele, liTagStructure)
                })
                confirmFilterElement.querySelector('.spinner-border-sm').classList.remove('fetching')
                confirmFilterElement.disabled = false
            }
        } else if(beginDay !== '') {
            const errSearchElement = document.querySelector('.error-search')
            errSearchElement.innerHTML = 'Bạn nhập thiếu ngày bắt đầu!!!'
            confirmFilterElement.querySelector('.spinner-border-sm').classList.remove('fetching')
            confirmFilterElement.disabled = false
        } else {
            const errSearchElement = document.querySelector('.error-search')
            errSearchElement.innerHTML = 'Bạn nhập thiếu ngày kết thúc!!!'
            confirmFilterElement.querySelector('.spinner-border-sm').classList.remove('fetching')
            confirmFilterElement.disabled = false
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
        <li data-id="${ele.rechargeID}" data-name="recharge" data-money="${ele.accountMoneyRecharge}">
            <p class="fs-16">Thêm <b>${changeMoney(ele.accountMoneyRecharge)}đ</b> vào quỹ vào <b>${time}</b> ngày <b>${day + "/" + month + "/" + year}</b></p>
            <div class="ultilities-delete-update">
                <span class="del-history fs-16">
                    <button data-bs-toggle="modal" data-bs-target="#confirm-del-recharge-withdraw">Hủy nạp</button>
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
        <li data-id="${ele.withdrawID}" data-name="withdraw" data-money="${ele.withdrawMoney}">
            <p class="fs-16">Rút <b>${changeMoney(ele.withdrawMoney)}đ</b> vào quỹ vào <b>${time}</b> ngày <b>${day + "/" + month + "/" + year}</b></p>
            <div class="ultilities-delete-update">
                <span class="del-history fs-16">
                    <button data-bs-toggle="modal" data-bs-target="#confirm-del-recharge-withdraw">Hủy nạp</button>
                </span>
            </div>
        </li>`
    }
}