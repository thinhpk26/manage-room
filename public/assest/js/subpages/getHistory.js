const AllHistory = {
    // Lấy tất cả lịch sử 
    async getAllHistory(offset, limit, exhaustedHisRecharge, exhaustedHisWithdraw, memberID = undefined) {
        const hisRecharge = await this.getHistoryRecharge(exhaustedHisRecharge, offset, limit, memberID)
        const hisWithdraw = await this.getHistoryWithdraw(exhaustedHisWithdraw, offset, limit, memberID)
        return {
            hisRecharge,
            hisWithdraw,
        }
    },
    // Lấy tất cả lịch sử nạp
    async getHistoryRecharge(exhaustedHisRecharge, offset, limit, memberID = undefined) {
        if(!exhaustedHisRecharge) {
            const resultSv = await axios({
                method: 'post',
                url: '../recharge-money/history-recharge',
                data: {memberIDHistory: memberID, offset, limit}
            })
            return {
                offset: offset + 10,
                exhaustedRecharge: resultSv.data.exhaustedRecharge,
                inforResponse: resultSv.data.inforResponse
            }
        } else return {
            offset,
            exhaustedRecharge: true,
            inforResponse: []
        }
    },
    // lấy tất cả lịch sử rút
    async getHistoryWithdraw(exhaustedHisWithdraw, offset, limit, memberID = undefined) {
        if(!exhaustedHisWithdraw) {
            const resultSv = await axios({
                method: 'post',
                url: '../withdraw-money/history-withdraw',
                data: {memberIDHistory: memberID, offset, limit}
            })
            return {
                offset: offset + 10,
                exhaustedWithdraw: resultSv.data.exhaustedWithdraw,
                inforResponse: resultSv.data.inforResponse
            }
        } else return {
            offset,
            exhaustedWithdraw: true,
            inforResponse: []
        }
    },
    // Lọc tất cả lịch sử theo thời gian
    async getAllHistoryWithTime(offset, limit, exhaustedHisRecharge, exhaustedHisWithdraw, beginDay, endDay, memberID = undefined) {
        const hisRecharge = await this.getHistoryRechargeWithTime(offset, limit, exhaustedHisRecharge, beginDay, endDay, memberID)
        const hisWithdraw = await this.getHistoryWithdrawWithTime(offset, limit, exhaustedHisWithdraw, beginDay, endDay, memberID)
        return {
            hisRecharge,
            hisWithdraw
        }
    },
    // Lọc lịch sử nạp theo thời gian
    async getHistoryRechargeWithTime(offset, limit, exhaustedHisRecharge, beginDay, endDay, memberID = undefined) {
        if(!exhaustedHisRecharge) {
            const resultSv = await axios({
                method: 'post',
                url: '../recharge-money/filter-history-recharge',
                data: {memberIDHistory: memberID, offset, limit, beginDay, endDay}
            })
            return {
                offset: offset + 10,
                exhaustedRecharge: resultSv.data.exhaustedRecharge,
                inforResponse: resultSv.data.inforResponse
            }
        } else return {
            offset,
            exhaustedRecharge: true,
            inforResponse: []
        }
    },
    // Lọc lịch sử rút theo thời gian
    async getHistoryWithdrawWithTime(offset, limit, exhaustedHisWithdraw, beginDay, endDay, memberID = undefined) {
        if(!exhaustedHisWithdraw) {
            const resultSv = await axios({
                method: 'post',
                url: '../withdraw-money/filter-history-withdraw',
                data: {memberIDHistory: memberID, offset, limit, beginDay, endDay}
            })
            return {
                offset: offset + 10,
                exhaustedWithdraw: resultSv.data.exhaustedWithdraw,
                inforResponse: resultSv.data.inforResponse
            }
        } else return {
            offset,
            exhaustedWithdraw: true,
            inforResponse: []
        }
    },
    // Tổng hợp sự kiện
    renderHistoryMember(allHistory, offset, renderedElement, liTagStructure) {
        // Sắp xếp theo thứ tự thời gian giảm dần
        allHistory.sort((a, b) => {
            let timeA, timeB
            if(a.hasOwnProperty('rechargeDay')) timeA = Date.parse(a.rechargeDay)
            else timeA = Date.parse(a.withdrawDay)
            if(b.hasOwnProperty('rechargeDay')) timeB = Date.parse(b.rechargeDay)
            else timeB = Date.parse(b.withdrawDay)
            return timeB - timeA
        })
        // render lịch sử
        this.renderHTML(offset, renderedElement, allHistory, liTagStructure)
    },
    // Render
    renderHTML(offset, renderedElement, allHistory, liTagStructure) {
        let allHistoryRechargeElement = ''
        allHistory.forEach(ele => {
            allHistoryRechargeElement += liTagStructure(ele)
        })
        const divElement = document.createElement('div')
        divElement.innerHTML = allHistoryRechargeElement
        if(offset === 10) {
            renderedElement.innerHTML = ''
            if(allHistoryRechargeElement !== '') {
                renderedElement.style.textAlign = 'left'
                renderedElement.append(divElement)
            } else {
                renderedElement.innerHTML = `<span class='fs-18'>Chưa có số tiền nạp rút nào</span>`
                renderedElement.style.textAlign = 'center'
            }
        } else {
            if(allHistoryRechargeElement !== '') {
                renderedElement.style.textAlign = 'left'
                renderedElement.append(divElement)
            }
        }
        const allHisElement = document.querySelectorAll('.history-recharge-withdraw .del-history')
        if(allHisElement.length > 0) {
            allHisElement.forEach(ele => {
                const modalDel = document.querySelector('#confirm-del-recharge-withdraw')
                ele.onclick = (e) => {
                    const liElement = ele.parentElement.parentElement
                    const ID = liElement.getAttribute('data-id')
                    // Hành động nạp hoặc rút
                    const action = liElement.getAttribute('data-name')
                    const accountMoney = liElement.getAttribute('data-money')
                    const modalTitleElement = modalDel.querySelector('.modal-title')
                    const modalBodyElement = modalDel.querySelector('.modal-body')
                    const footerModelElement = modalDel.querySelector('.modal-footer')
                    footerModelElement.innerHTML = `
                    <button type="button" class="btn btn-primary confirm-change" onclick="cancelClick(this)">
                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Đồng ý
                    </button>`
                    modalTitleElement.innerHTML = 'Xác Nhận'
                    if(action == 'recharge') modalBodyElement.innerHTML = `Bạn thật sự muốn hủy số tiền nạp là ${accountMoney}đ!`
                    else modalBodyElement.innerHTML = `Bạn thật sự muốn hủy số tiền rút là ${accountMoney}đ!`
                    const confirmElement = document.querySelector('.confirm-change')
                    confirmElement.addEventListener('click', async() => {
                        if(action === 'recharge') {
                            const dataServerRes = await axios({
                                method: 'delete',
                                url: '../recharge-money',
                                data: {rechargeID: parseInt(ID)}
                            })
                            if(dataServerRes.data.success) window.location.href = '/recharge-money'
                        } else {
                            const dataServerRes = await axios({
                                method: 'delete',
                                url: '../withdraw-money',
                                data: {withdrawID: parseInt(ID)}
                            })
                            if(dataServerRes.data.success) window.location.href = '/recharge-money'
                        }
                    })
                }
            })
        }
    }
}