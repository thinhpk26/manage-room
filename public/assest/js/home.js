'use strict';
;(async () => {
    // Render tổng tiền phòng
    axios({
        method: 'get',
        url: '../room/basic-infor'
    })
    .then((result) => {
        const {accountMoneyRemain} = result.data
        if(accountMoneyRemain >= 0) document.querySelector('.remain-money-room b').innerHTML = accountMoneyRemain + 'K'
        else document.querySelector('.remain-money-room h4').innerHTML = 'Phòng của bạn đang bị nợ tiền: ' + `<b>${Math.abs(accountMoneyRemain)}K</b>`
    })
    .catch((error) => {
        console.error(error)
    })

    // Render số tiền còn lại của thành viên đang đăng nhập
    axios({
        method: 'get',
        url: '../member/basic-infor'
    })
    .then((result) => {
        const {remainMoney} = result.data
        if(remainMoney >= 0 ) document.querySelector('.remain-money-member b').innerHTML = remainMoney + 'K'
        else document.querySelector('.remain-money-member h4').innerHTML = 'Đang nợ: ' + `<b>${Math.abs(remainMoney)}K</b>`
    })
    .catch((error) => {
        console.error(error)
    })

    // Render lịch sử mua hàng
    axios({
        method: 'post',
        url: '../purchase/history-purchase',
        data: {offset: 0, limit: 10}
    })
    .then((result) => {
        const historyPurchaseElement = document.querySelector('.history-purchase')
        let allHistoryPurchaseElement = ''
        result.data.forEach(ele => {
            const datetime = new Date(ele.purchaseDate)
            const time = datetime.toTimeString().slice(0, 9) // Lấy thời gian
            const month = datetime.getUTCMonth() + 1; //months from 1-12
            const day = datetime.getUTCDate();
            const year = datetime.getUTCFullYear();
            allHistoryPurchaseElement += `
            <li id=${ele.orderID} class='down detail' render-detail='0'>
                <div class="sumary-order">
                    <p>${ele.nameMemberUse} đã sử dụng tổng số tiền <b>${ele.sumMoney}K</b> vào <b>${time}</b> ngày <b>${day + "/" + month + "/" + year}</b></p>
                    <i class="fa-solid fa-angle-up"></i>
                    <i class="fa-solid fa-chevron-down"></i>
                </div>
            </li>
            `
        })
        if(allHistoryPurchaseElement !== '') {
            historyPurchaseElement.innerHTML = allHistoryPurchaseElement
        } else {
            historyPurchaseElement.innerHTML = `<div style='height: 100%, width: 100%;'><h5 style='text-align: center; margin-top: 50px; color: var(--color-text-dark); font-weight: 400;'>Chưa có lịch sử mua hàng nào được thêm!</h5></div>`
        }
        const hisPurchaseLiElement = historyPurchaseElement.querySelectorAll('li')
        hisPurchaseLiElement.forEach(ele => {
            ele.querySelector('.sumary-order').addEventListener('click', (e) => {
                const orderID = ele.id
                const isHaveRendering = ele.getAttribute('render-detail') === '0' ? false : true
                if(!isHaveRendering) {
                    result.data.forEach(eleIn => {
                        if(orderID === eleIn.orderID) {
                            const datetime = new Date(eleIn.purchaseDate)
                            const time = datetime.toTimeString().slice(0, 9) // Lấy thời gian
                            const month = datetime.getUTCMonth() + 1; //months from 1-12
                            const day = datetime.getUTCDate();
                            const year = datetime.getUTCFullYear();
                            const detailOrder = document.createElement('div')
                            detailOrder.className = 'detail-order'
                            detailOrder.innerHTML = 
                            `<p><b>Thành viên mua</b>: ${eleIn.nameMemberUse}</p>
                            <p><b>Tổng số tiền</b>: ${eleIn.sumMoney}K</p>
                            <p><b>Các thành viên phải trả tiền</b>: ${eleIn.memberPaid.reduce((pre, cur) => {
                                return pre + ', ' + cur.name
                            }, '').slice(2)}</p>
                            <p><b>Số tiền mỗi thành viên phải trả</b>: ${eleIn.moneyEachMemberPay}K</p>
                            <p><b>Ngày mua</b>: ${time + ' ' + day + "/" + month + "/" + year}</p>
                            <p><b>Các đồ đã mua</b>: ${eleIn.itemPurchase.length === 0 ? 'Chưa thêm đồ nào' : eleIn.itemPurchase.reduce((pre, cur) => {
                                return pre + ', ' + cur.nameItem + '-' + cur.moneyPay + 'K'
                            }, '').slice(2)}</p>
                            <p><b>Chú thích</b>: ${eleIn.note === null ? 'Không có chú thích' : eleIn.note}</p>
                            `
                            ele.appendChild(detailOrder)
                        }
                    })
                    ele.setAttribute('render-detail', '1')
                }
                const isDetail = ele.getAttribute('class')
                if(isDetail.includes('down')) {
                    ele.className = 'up detail'
                } else {
                    ele.className = 'down sumary'
                }
            })
        })
    })
    .catch((error) => {
        console.error(error)
    })

    // render các thành viên
    // Node to render
    const hisRechargeAndWithdrawElement = document.querySelector('.history-recharge-withdraw')
    await axios({
        method: 'get',
        url: '../member/all-member'
    })
    .then((result) => {
        // Tổng hợp các thẻ option
        const memberElement = document.querySelector('#member')
        let optionElements = ''
        result.data.forEach((ele, index) => {
            if(index === 0) optionElements += `
            <option value="${ele.memberID}">Bạn</option>`
            else optionElements += `
            <option value="${ele.memberID}">${ele.name}</option>`
        })
        memberElement.innerHTML = optionElements
        memberElement.addEventListener('change', async(e) => {
            //Sửa lại số tiền còn lại
            const remainMoneyResultSv = await axios({
                method: 'post',
                url: '../member/remainMoney',
                data: {memberIDOther: memberElement.value}
            })
            const remainMoney = remainMoneyResultSv.data.remainMoney
            if(remainMoney >= 0 ) document.querySelector('.remain-money-member b').innerHTML = remainMoney + 'K'
            else document.querySelector('.remain-money-member h4').innerHTML = 'Đang nợ: ' + `<b>${Math.abs(remainMoney)}K</b>`
            offset = 0
            exhaustedHisRecharge = 0
            exhaustedHisWithdraw = 0
            // MemberID 
            const memberCurID = memberElement.value
            const allHistory = await AllHistory.getAllHistory(offset, exhaustedHisRecharge, exhaustedHisWithdraw, memberCurID).then(result => {
                exhaustedHisRecharge = result.hisRecharge.exhaustedRecharge
                exhaustedHisWithdraw = result.hisWithdraw.exhaustedWithdraw
                if(result.hisRecharge.offset > result.hisWithdraw.offset) {
                    offset = result.hisRecharge.offset
                } else {
                    offset = result.hisWithdraw.offset
                }
                return result.hisRecharge.inforResponse.concat(result.hisWithdraw.inforResponse)
            })
            AllHistory.renderHistoryMember(allHistory, offset, hisRechargeAndWithdrawElement, liTagStructure)
        })
    })
    .catch((error) => {
        console.error(error)
    })
    // render dữ liệu thành viên đang đăng nhập
    // Lấy thêm dữ liệu trong server
    let offset = 0
    // Xét xem đã hết dữ liệu render trên server chưa
    let exhaustedHisRecharge = 0
    let exhaustedHisWithdraw = 0
    const memberCurID = document.querySelector('#member').value
    // Lấy dữ liệu lịch sử từ server
    const allHistory = await AllHistory.getAllHistory(offset, exhaustedHisRecharge, exhaustedHisWithdraw, memberCurID).then(result => {
        exhaustedHisRecharge = result.hisRecharge.exhaustedRecharge
        exhaustedHisWithdraw = result.hisWithdraw.exhaustedWithdraw
        if(result.hisRecharge.offset > result.hisWithdraw.offset) {
            offset = result.hisRecharge.offset
        } else {
            offset = result.hisWithdraw.offset
        }
        return result.hisRecharge.inforResponse.concat(result.hisWithdraw.inforResponse)
    })
    AllHistory.renderHistoryMember(allHistory, offset, hisRechargeAndWithdrawElement, liTagStructure)
})()

// Cấu trúc của thẻ li
function liTagStructure(ele/* Dữ liệu của từng lịch sử nạp tiền */) {
    if(ele.hasOwnProperty('rechargeID')) {
        const datetime = new Date(ele.rechargeDay)
        const time = datetime.toTimeString().slice(0, 9) // Lấy thời gian
        const month = datetime.getUTCMonth() + 1; //months from 1-12
        const day = datetime.getUTCDate();
        const year = datetime.getUTCFullYear();
        return `
        <li>
            <p>Thêm <b>${ele.accountMoneyRecharge}K</b> vào quỹ vào <b>${time}</b> ngày <b>${day + "/" + month + "/" + year}</b></p>
        </li>`
    } else {
        const datetime = new Date(ele.withdrawDay)
        const time = datetime.toTimeString().slice(0, 9) // Lấy thời gian
        const month = datetime.getUTCMonth() + 1; //months from 1-12
        const day = datetime.getUTCDate();
        const year = datetime.getUTCFullYear();
        return `
        <li>
            <p>Rút <b>${ele.withdrawMoney}K</b> vào quỹ vào <b>${time}</b> ngày <b>${day + "/" + month + "/" + year}</b></p>
        </li>`
    }
}