const AllHistory = {
    // Lấy tất cả lịch sử 
    async getAllHistory(offset, exhaustedHisRecharge, exhaustedHisWithdraw, memberID = undefined) {
        const hisRecharge = await this.getHistoryRecharge(memberID, exhaustedHisRecharge, offset)
        const hisWithdraw = await this.getHistoryWithdraw(memberID, exhaustedHisWithdraw, offset)
        return {
            hisRecharge,
            hisWithdraw,
        }
    },
    // Lấy tất cả lịch sử nạp
    async getHistoryRecharge(memberID, exhaustedHisRecharge, offset) {
        if(!exhaustedHisRecharge) {
            const resultSv = await axios({
                method: 'post',
                url: '../recharge-money/history-recharge',
                data: {memberIDHistory: memberID, offset}
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
    async getHistoryWithdraw(memberID, exhaustedHisWithdraw, offset) {
        if(!exhaustedHisWithdraw) {
            const resultSv = await axios({
                method: 'post',
                url: '../withdraw-money/history-withdraw',
                data: {memberIDHistory: memberID, offset}
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
    async getAllHistoryWithTime(offset, exhaustedHisRecharge, exhaustedHisWithdraw, beginDay, endDay, memberID = undefined) {
        const hisRecharge = await this.getHistoryRechargeWithTime(offset, exhaustedHisRecharge, beginDay, endDay, memberID)
        const hisWithdraw = await this.getHistoryWithdrawWithTime(offset, exhaustedHisWithdraw, beginDay, endDay, memberID)
        return {
            hisRecharge,
            hisWithdraw
        }
    },
    // Lọc lịch sử nạp theo thời gian
    async getHistoryRechargeWithTime(offset, exhaustedHisRecharge, beginDay, endDay, memberID = undefined) {
        if(!exhaustedHisRecharge) {
            const resultSv = await axios({
                method: 'post',
                url: '../recharge-money/filter-history-recharge',
                data: {memberIDHistory: memberID, offset, beginDay, endDay}
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
    async getHistoryWithdrawWithTime(offset, exhaustedHisWithdraw, beginDay, endDay, memberID = undefined) {
        if(!exhaustedHisWithdraw) {
            const resultSv = await axios({
                method: 'post',
                url: '../withdraw-money/filter-history-withdraw',
                data: {memberIDHistory: memberID, offset, beginDay, endDay}
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
                renderedElement.append(divElement)
            } else {
                renderedElement.innerHTML = `<h5 style='text-align: center; margin-top: 50px;'>Chưa có số tiền nạp rút nào</h5>`
            }
        } else {
            if(allHistoryRechargeElement !== '') {
                renderedElement.append(divElement)
            }
        }
        const allHisElement = document.querySelectorAll('.del-history')
        if(allHisElement.length > 0) {
            allHisElement.forEach(ele => {
                ele.addEventListener('click', () => {
                    const liElement = ele.parentElement.parentElement
                    const ID = liElement.getAttribute('data-id')
                    const table = liElement.getAttribute('data-name')
                    const modalTitleElement = document.querySelector('.modal-title')
                    const modalBodyElement = document.querySelector('.modal-body')
                    const footerModelElement = document.querySelector('.modal-footer')
                    footerModelElement.innerHTML = `
                    <button type="button" class="btn btn-primary confirm-change">Đồng ý</button>`
                    modalTitleElement.innerHTML = 'Xác Nhận'
                    modalBodyElement.innerHTML = `Bạn thật sự muốn xóa !`
                    const confirmElement = document.querySelector('.confirm-change')
                    confirmElement.addEventListener('click', async() => {
                        if(table === 'recharge') {
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
                })
            })
        }
    }
}