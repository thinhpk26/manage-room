'use trict';
(async function() {
    document.querySelector('#history-purchase').style.height = screen.height * 2 / 3 + 'px'
    axios({
        method: 'get',
        url: '../member/all-member',
    })
    .then(resSv => {
        // Render lựa chọn thành viên sử dụng tiền
        const addPurchaseContainerElement = document.querySelector('#add-purchase .add-purchase-container')
        const updatePurchaseContainerElement = document.querySelector('#add-purchase .update-purchase-container')
        let allMemberUseElementForAdd = ''
        let allMemberUseElementForUpdate = ''
        resSv.data.forEach((ele, index) => {
            if(index === 0) {
                allMemberUseElementForAdd += `<input type="radio" id="member-use-add${index}" name="member-use" value="${ele.memberID}"><label style="cursor: pointer" for="member-use-add${index}">Bạn</label><br>`
                allMemberUseElementForUpdate += `<input type="radio" id="member-use-update${index}" name="member-use" value="${ele.memberID}"><label style="cursor: pointer" for="member-use-update${index}">Bạn</label><br>`
            }
            else {
                allMemberUseElementForAdd += `<input type="radio" id="member-use-add${index}" name="member-use" value="${ele.memberID}"><label style="cursor: pointer" for="member-use-add${index}">${ele.name}</label><br>`
                allMemberUseElementForUpdate += `<input type="radio" id="member-use-update${index}" name="member-use" value="${ele.memberID}"><label style="cursor: pointer" for="member-use-update${index}">${ele.name}</label><br>`
            }
        })
        addPurchaseContainerElement.querySelector('.member-use > td:last-child').innerHTML = allMemberUseElementForAdd
        updatePurchaseContainerElement.querySelector('.member-use > td:last-child').innerHTML = allMemberUseElementForUpdate
        // Render các thành viên cần phải trả
        let allMemberPayElementForAdd = ''
        let allMemberPayElementForUpdate = ''
        resSv.data.forEach((ele, index) => {
            if(index === 0) {
                allMemberPayElementForAdd += `<input type="checkbox" id="member-pay-add${index}" name="member-pay" value="${ele.memberID}"><label style="cursor: pointer" for="member-pay-add${index}">Bạn</label><br>`
                allMemberPayElementForUpdate += `<input type="checkbox" id="member-pay-update${index}" name="member-pay" value="${ele.memberID}"><label style="cursor: pointer" for="member-pay-update${index}">Bạn</label><br>`
            }
            else {
                allMemberPayElementForAdd += `<input type="checkbox" id="member-pay-add${index}" name="member-pay" value="${ele.memberID}"><label style="cursor: pointer" for="member-pay-add${index}">${ele.name}</label><br>`
                allMemberPayElementForUpdate += `<input type="checkbox" id="member-pay-update${index}" name="member-pay" value="${ele.memberID}"><label style="cursor: pointer" for="member-pay-update${index}">${ele.name}</label><br>`
            }
        })
        addPurchaseContainerElement.querySelector('.member-pay > td:last-child').innerHTML = allMemberPayElementForAdd
        updatePurchaseContainerElement.querySelector('.member-pay > td:last-child').innerHTML = allMemberPayElementForUpdate
    })
    .catch(error => {
        document.querySelector('.only-for-notify-btn').click()
        appendNotify(document.querySelector('#only-for-notify'), '', 'Có một vài sự cố nhỏ, Chúng tôi sẽ sửa lại cho bạn ngay bây giờ!!')
        document.querySelector('.confirm-reload').onclick = () => {
            window.location.reload()
        }
    })
    // Xác định vật phẩm có trong client
    let IDItemCli = 0
    let offset = 0
    // Xác định đã hết lịch sử chưa
    let exhaustedPurchase = false
    let AllHistoryPurchase = []
    // Render lịch sử mua hàng
    axios({
        method: 'post',
        url: '../purchase/history-purchase',
        data: {offset, limit: offset + 10}
    })
    .then((result) => {
        offset += 10
        AllHistoryPurchase = AllHistoryPurchase.concat(result.data.inforResponse)
        // Render tóm tắt lịch giao dịch
        const historyPurchaseElement = document.querySelector('.history-purchase')
        renderSumaryHistory(historyPurchaseElement, result.data.inforResponse, offset, exhaustedPurchase)
        exhaustedPurchase = result.data.exhaustedPurchase
        // Render chi tiết lịch sử giao dịch
        const hisPurchaseLiElement = historyPurchaseElement.querySelectorAll('li')
        renderDetailHistory(hisPurchaseLiElement, AllHistoryPurchase)
        // Sửa lịch sử mua hàng
        const updatePurchaseElement = historyPurchaseElement.querySelectorAll('button.btn-update')
        updateHistoryPurchase(updatePurchaseElement, AllHistoryPurchase, IDItemCli)
        // Xóa lịch sử mua hàng
        const delPurchaseElement = historyPurchaseElement.querySelectorAll('button.btn-delete')
        deleteHistoryPurchase(delPurchaseElement)
    })
    .catch((error) => {
        document.querySelector('.only-for-notify-btn').click()
        appendNotify(document.querySelector('#only-for-notify'), '', 'Xảy ra 1 vài sự cố nhỏ, Chúng tôi sẽ sửa lại cho bạn ngay!')
        document.querySelector('.confirm-reload').onclick = () => {
            window.location.reload()
        }
    })

    const historyPurchaseCoverElement = document.querySelector('#history-purchase')
    historyPurchaseCoverElement.addEventListener('scroll', (e) => {
        if(historyPurchaseCoverElement.scrollHeight * 2/3 < historyPurchaseCoverElement.clientHeight + historyPurchaseCoverElement.scrollTop) {
            if(!exhaustedPurchase) {
                // Tránh việc fetch server nhiều lần
                exhaustedPurchase = !exhaustedPurchase
                axios({
                    method: 'post',
                    url: '../purchase/history-purchase',
                    data: {offset, limit: offset + 10}
                })
                .then((result) => {
                    if(!exhaustedPurchase) {
                        offset += 10
                        AllHistoryPurchase = AllHistoryPurchase.concat(result.data.inforResponse)
                        // Render tóm tắt lịch giao dịch
                        const historyPurchaseElement = document.querySelector('.history-purchase')
                        renderSumaryHistory(historyPurchaseElement, result.data.inforResponse, offset, exhaustedPurchase)
                        // Render chi tiết lịch sử giao dịch
                        const hisPurchaseLiElement = historyPurchaseElement.querySelectorAll('li')
                        renderDetailHistory(hisPurchaseLiElement, AllHistoryPurchase)
                        // Sửa lịch sử mua hàng
                        const updatePurchaseElement = historyPurchaseElement.querySelectorAll('button.btn-update')
                        updateHistoryPurchase(updatePurchaseElement, AllHistoryPurchase, IDItemCli)
                        // Xóa lịch sử mua hàng
                        const delPurchaseElement = historyPurchaseElement.querySelectorAll('button.btn-delete')
                        deleteHistoryPurchase(delPurchaseElement)
                    }
                    exhaustedPurchase = result.data.exhaustedPurchase
                })
                .catch((error) => {
                    document.querySelector('.only-for-notify-btn').click()
                    appendNotify(document.querySelector('#only-for-notify'), '', 'Xảy ra 1 vài sự cố nhỏ, Chúng tôi sẽ sửa lại cho bạn ngay!')
                    document.querySelector('.confirm-reload').onclick = () => {
                        window.location.reload()
                    }
                })
            }
        }
    })
    // Lưu trữ các vật phẩm đã mua
    const addPurchaseElement = document.querySelector('#add-purchase')
    let itemsMemberBought = []
    const addPurchaseContainerElement = addPurchaseElement.querySelector('.add-purchase-container')
    addAndDelItemsPurchase(addPurchaseContainerElement, itemsMemberBought, IDItemCli)
    // Thêm lịch sử mua hàng mới
    addPurchaseContainerElement.querySelector('.add-purchase').onclick = function () {
        const formData = validationForm(addPurchaseContainerElement, itemsMemberBought)
        if(formData) {
            appendConfirmChange(document.querySelector('#confirm-add-purchase'), 'Xác nhận', 'Bạn muốn thêm lịch sử mua hàng này!!', {name: 'confirm', className: 'add-purchase-btn'})
            document.querySelector('.add-purchase-btn').addEventListener('click', () => {
                axios({
                    method: 'post',
                    url: '../purchase',
                    data: formData
                })
                .then((result) => {
                    if(result.data.success) {
                        document.querySelector('.only-for-notify-btn').click()
                        appendNotify(document.querySelector('#only-for-notify'), 'Thành công!', 'Bạn vừa thêm 1 lịch sử mua hàng mới!')
                        document.querySelector('.confirm-reload').onclick = () => {
                            window.location.reload()
                        }
                    }
                })
                .catch(err => {
                    document.querySelector('.only-for-notify-btn').click()
                    appendNotify(document.querySelector('#only-for-notify'), '', 'Xảy ra 1 vài sự cố nhỏ, Chúng tôi sẽ sửa lại cho bạn ngay!')
                    document.querySelector('.confirm-reload').onclick = () => {
                        window.location.reload()
                    }
                })
            })
        }
    }
})()

function addAndDelItemsPurchase(inputElement /* Element lưu trữ các input cái mà chứa thông tin các vật phẩm */, itemsPurchase /* Lưu trữ các vật phẩm đã mua */, IDItemCli /* Xác định các vật phẩm tại cli */) {
    const moneyPayElement = inputElement.querySelector('#money-pay')
    const itemsElement = inputElement.querySelector('.items')
    const nameItemElement = inputElement.querySelector('#name-item')
    // Thêm sự kiện xóa - sử dụng cho việc update lịch sử mua hàng
    const delLiElements = itemsElement.querySelectorAll('li span')
    delLiElements.forEach(ele => {
        ele.onclick = function () {
            ele.parentElement.remove()
            const idItemInLiTag = ele.getAttribute('data-id-cli')
            // Lưu trữ mốc xóa
            let indexItemsPurchase
            // Lưu trữ số tiền bị xóa
            let moneyDel
            itemsPurchase.forEach((item, index) => {
                if(item.id.toString() === idItemInLiTag) {
                    indexItemsPurchase = index
                    moneyDel = item.moneyPay
                }
            })
            itemsPurchase.splice(indexItemsPurchase, 1)
            // Tự động sửa lại giá trị của input khi thêm vật phẩm
            const sumMoneyInput = inputElement.querySelector('input[name="account-money"]')
            sumMoneyInput.value = parseFloat(sumMoneyInput.value.split('.').join('')) - moneyDel
            if(itemsPurchase.length === 0) {
                inputElement.querySelector('.cover-items').classList.add('not-products')
            }
        }
    })
    // Thêm vật phẩm mỗi khi nhấn enter tại input số tiền
    moneyPayElement.addEventListener('keypress', (e) => {
        if(e.which === 13) {
            if(nameItemElement.value !== '' && moneyPayElement.value !== '') {
                const nameItem = nameItemElement.value
                const money = moneyPayElement.value
                // Tự động sửa lại giá trị của input khi thêm vật phẩm
                const sumMoneyInput = inputElement.querySelector('input[name="account-money"]')
                if(sumMoneyInput.value === '') sumMoneyInput.value = money
                else sumMoneyInput.value = changeMoney(parseFloat(sumMoneyInput.value.split('.').join('')) + parseFloat(money.split('.').join('')))
                const liElement = document.createElement('li')
                liElement.innerHTML = `
                    Tên: ${nameItem} - Giá: ${money}đ
                    <span data-id-cli='${IDItemCli}'><i class="fa-regular fa-circle-xmark"></i></span>
                `
                itemsElement.append(liElement)
                let itemID = liElement.querySelector('span').getAttribute('data-id')
                if(!itemID) itemID = null
                itemsPurchase.push({id: IDItemCli, itemID: itemID, nameItem: nameItem, moneyPay: parseFloat(money.split('.').join(''))})
                if(itemsPurchase.length > 0) inputElement.querySelector('.cover-items').classList.remove('not-products')
                IDItemCli++
                nameItemElement.value = ''
                moneyPayElement.value = ''
                // Thêm sự kiện xóa
                const delLiElements = itemsElement.querySelectorAll('li span')
                delLiElements.forEach(ele => {
                    ele.onclick = function () {
                        ele.parentElement.remove()
                        const idItemInLiTag = ele.getAttribute('data-id-cli')
                        // Lưu trữ mốc xóa
                        let indexItemsPurchase
                        // Lưu trữ số tiền bị xóa
                        let moneyDel
                        itemsPurchase.forEach((item, index) => {
                            if(item.id.toString() === idItemInLiTag) {
                                indexItemsPurchase = index
                                moneyDel = item.moneyPay
                            }
                        })
                        itemsPurchase.splice(indexItemsPurchase, 1)
                        // Tự động sửa lại giá trị của input khi thêm vật phẩm
                        const sumMoneyInput = inputElement.querySelector('input[name="account-money"]')
                        sumMoneyInput.value = parseFloat(sumMoneyInput.value.split('.').join('')) - moneyDel
                        if(itemsPurchase.length === 0) {
                            inputElement.querySelector('.cover-items').classList.add('not-products')
                        }
                    }
                })
            } else {
                document.querySelector('.only-for-notify-btn').click()
                appendNotify(document.querySelector('#only-for-notify'), 'Lỗi', 'Bạn điền thiếu tên hàng hoặc giá của chúng')
            }
        }
    })
}

function validationForm(formELement /* Form lưu trữ thông tin lịch sử mua hàng */, itemsPurchase /* Biến lưu trữ các vật phẩm có trong lịch sử mua hàng */) {
    let formData = {}
    // check thành viên sử dụng
    const memberUseElement = formELement.querySelectorAll('input[name="member-use"]')
    let isCheckMemberUse = false
    memberUseElement.forEach(ele => {
        if(ele.checked) {
            isCheckMemberUse = true
            formData.memberPaid = ele.value
        }
    })
    if(!isCheckMemberUse) {
        appendConfirmChange(document.querySelector('#confirm-update-purchase'), 'Lỗi', 'Bạn chưa chọn người đã mua hàng', {name: 'error'})
        appendConfirmChange(document.querySelector('#confirm-add-purchase'), 'Lỗi', 'Bạn chưa chọn người đã mua hàng', {name: 'error'})
        return 0
    }
    // Tổng số tiền thành viên
    const accountMoneyBought = parseFloat(formELement.querySelector('input[name="account-money"]').value.split('.').join(''))
    if(accountMoneyBought === '' || isNaN(accountMoneyBought)) {
        appendConfirmChange(document.querySelector('#confirm-update-purchase'), 'Lỗi', 'Bạn chưa nhập tổng số tiền trả', {name: 'error'})
        appendConfirmChange(document.querySelector('#confirm-add-purchase'), 'Lỗi', 'Bạn chưa nhập tổng số tiền trả', {name: 'error'})
        return 0
    } else {
        formData.sumMoney = accountMoneyBought
    }
    // check các thành viên phải trả tiền
    const membersPayElement = formELement.querySelectorAll('input[name="member-pay"]')
    const membersPay = []
    membersPayElement.forEach(ele => {
        if(ele.checked) {
            membersPay.push(ele.value)
        }
    })
    if(membersPay.length === 0) {
        appendConfirmChange(document.querySelector('#confirm-update-purchase'), 'Lỗi', 'Bạn phải chọn ít nhất 1 thành viên!', {name: 'error'})
        appendConfirmChange(document.querySelector('#confirm-add-purchase'), 'Lỗi', 'Bạn phải chọn ít nhất 1 thành viên!', {name: 'error'})
        return 0
    } else {
        formData.memberUse = membersPay
    }
    // các đồ đã mua
    formData.purchaseItem = itemsPurchase
    // Ghi chú
    const note = formELement.querySelector('textarea').value
    formData.note = note
    return formData
}

function renderSumaryHistory(renderedElement /* Khối phần tử được render */, renderedData /* Dữ liệu được render */, offset /* Số lượng phần tử được bỏ qua */, exhaustedPurchase) {
    if(offset === 10) {
        if(renderedData.length > 0) {
            renderedData.forEach(ele => {
                const datetime = new Date(ele.purchaseDate)
                const time = datetime.toTimeString().slice(0, 9) // Lấy thời gian
                const month = datetime.getUTCMonth() + 1; //months from 1-12
                const day = datetime.getUTCDate();
                const year = datetime.getUTCFullYear();
                const liTag = document.createElement('li');
                liTag.id = ele.orderID
                liTag.className = 'history-purchase-child down detail'
                liTag.setAttribute('render-detail', '0')
                liTag.setAttribute('data-id', ele.orderID)
                liTag.innerHTML = `
                <div class="sumary-order">
                    <p>${ele.nameMemberUse} đã sử dụng tổng số tiền <b>${changeMoney(ele.sumMoney)}đ</b> vào <b>${time}</b> ngày <b>${day + "/" + month + "/" + year}</b></p>
                    <i class="fa-solid fa-angle-up"></i>
                    <i class="fa-solid fa-chevron-down"></i>
                </div>
                <div class="update-or-del">
                <button class="btn btn-update">Sửa</button>
                <button type="button" class="btn btn-delete" data-bs-toggle="modal" data-bs-target="#confirm-delete-purchase">Xóa</button>
                </div>`
                renderedElement.appendChild(liTag)
            })
        } else renderedElement.innerHTML = `<span style='margin-top: 50px; text-align: center; color: #ccc; font-weight: 400;'>Chưa có lịch sử mua hàng nào được thêm</span>`
    } else {
        renderedData.forEach(ele => {
            const datetime = new Date(ele.purchaseDate)
            const time = datetime.toTimeString().slice(0, 9) // Lấy thời gian
            const month = datetime.getUTCMonth() + 1; //months from 1-12
            const day = datetime.getUTCDate();
            const year = datetime.getUTCFullYear();
            const liTag = document.createElement('li');
            liTag.id = ele.orderID
            liTag.className = 'history-purchase-child down detail'
            liTag.setAttribute('render-detail', '0')
            liTag.setAttribute('data-id', ele.orderID)
            liTag.innerHTML = `
            <div class="sumary-order">
                <p>${ele.nameMemberUse} đã sử dụng tổng số tiền <b>${changeMoney(ele.sumMoney)}đ</b> vào <b>${time}</b> ngày <b>${day + "/" + month + "/" + year}</b></p>
                <i class="fa-solid fa-angle-up"></i>
                <i class="fa-solid fa-chevron-down"></i>
            </div>
            <div class="update-or-del">
            <button class="btn btn-update">Sửa</button>
            <button type="button" class="btn btn-delete" data-bs-toggle="modal" data-bs-target="#confirm-delete-purchase">Xóa</button>
            </div>`
            renderedElement.appendChild(liTag)
        })
    }
}

function renderDetailHistory(renderedElement /* Khối phần tử được render */, renderedData /* Dữ liệu được render */) {
    renderedElement.forEach(ele => {
        ele.querySelector('.sumary-order').onclick = (e) => {
            const orderID = ele.id
            // Xác định element này đã được render chi tiết hay chưa
            const isHaveRendering = ele.getAttribute('render-detail') === '0' ? false : true
            if(!isHaveRendering) {
                renderedData.forEach(eleIn => {
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
                        <p><b>Tổng số tiền</b>: ${changeMoney(eleIn.sumMoney)}đ</p>
                        <p><b>Các thành viên phải trả tiền</b>: ${eleIn.memberPaid.reduce((pre, cur) => {
                            return pre + ', ' + cur.name
                        }, '').slice(2)}</p>
                        <p><b>Số tiền mỗi thành viên phải trả</b>: ${changeMoney(Math.floor(eleIn.moneyEachMemberPay))}đ</p>
                        <p><b>Ngày mua</b>: ${time + ' ' + day + "/" + month + "/" + year}</p>
                        <p><b>Các đồ đã mua</b>: ${eleIn.itemPurchase.length === 0 ? 'Chưa thêm đồ nào' : eleIn.itemPurchase.reduce((pre, cur) => {
                            return pre + ', ' + 'Tên đồ:' + cur.nameItem + '-' + 'Giá:' + changeMoney(Math.floor(cur.moneyPay)) + 'đ'
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
                ele.classList.add('up')
                ele.classList.add('detail')
                ele.classList.remove('down')
                ele.classList.remove('sumary')
            } else {
                ele.classList.remove('up')
                ele.classList.remove('detail')
                ele.classList.add('down')
                ele.classList.add('sumary')
            }
        }
    })
}

async function updateHistoryPurchase(updatePurchaseElement /* Các nút sửa lịch sử mua hàng */, result /* Tổng hợp các lịch sử mua hàng */, IDItemCli /* Xác định các vật phẩm ở client */) {
    updatePurchaseElement.forEach(ele => {
        ele.onclick = function() {
            document.querySelector('.only-for-notify-btn').click()
            appendNotify(document.querySelector('#only-for-notify'), '', 'Bạn hãy nhập thông tin muốn sửa vào bảng bên dưới')
            const addPurchaseElement = document.querySelector('#add-purchase')
            addPurchaseElement.scrollTop = 0
            addPurchaseElement.classList.remove('add')
            addPurchaseElement.classList.add('update')
            // Render các mục cần sửa
            const updatePurchaseContainerElement = addPurchaseElement.querySelector('.update-purchase-container')
            if(result.length > 0) updatePurchaseContainerElement.querySelector('.cover-items').classList.remove('not-products')
            const IDPurchase = getParent(ele, 'history-purchase-child').getAttribute('data-id')
            const historyPurchaseData = result.find(ele => ele.orderID === IDPurchase)
            updatePurchaseContainerElement.querySelectorAll('input[name="member-use"]').forEach(ele => {
                if(ele.value === historyPurchaseData.memberPurchaseID) ele.checked = true
            })
            updatePurchaseContainerElement.querySelector('input[name="account-money"]').value = historyPurchaseData.sumMoney
            updatePurchaseContainerElement.querySelectorAll('input[name="member-pay"]').forEach(ele => {
                for(let i=0; i<historyPurchaseData.memberPaid.length; i++) {
                    if(ele.value === historyPurchaseData.memberPaid[i].memberID) {
                        ele.checked = true
                    } 
                } 
            })
            // Lưu trữ lịch sử mua hàng dành cho việc update
            const itemsPurchaseForUpdate = [...historyPurchaseData.itemPurchase]
            let liTagsHtml = ''
            itemsPurchaseForUpdate.forEach((ele, index) => {
                itemsPurchaseForUpdate[index].id = IDItemCli
                liTagsHtml += `<li>
                    Tên: ${ele.nameItem} - Giá: ${ele.moneyPay}đ
                    <span data-id-cli='${IDItemCli}'><i class="fa-regular fa-circle-xmark"></i></span>
                </li>
                `
                IDItemCli++
            })
            if(liTagsHtml !== '') {
                updatePurchaseContainerElement.querySelector('.items').innerHTML = liTagsHtml
            }
            if(historyPurchaseData.note) updatePurchaseContainerElement.querySelector('textarea').value = historyPurchaseData.note
            addAndDelItemsPurchase(updatePurchaseContainerElement, itemsPurchaseForUpdate, IDItemCli)
            // Sự kiện up server
            updatePurchaseContainerElement.querySelector('button.update-purchase').onclick = function() {
                const formData = validationForm(updatePurchaseContainerElement, itemsPurchaseForUpdate)
                if(formData) {
                    formData.orderID = IDPurchase
                    appendConfirmChange(document.querySelector('#confirm-update-purchase'), 'Xác nhận', 'Bạn muốn sửa lịch sử mua hàng này!!!', {name: 'confirm', className: 'update-purchase-btn'})
                    document.querySelector('.update-purchase-btn').onclick = function() {
                        axios({
                            method: 'put',
                            url: '../purchase',
                            data: formData
                        })
                        .then((result) => {
                            if(result.data.success) {
                                document.querySelector('.only-for-notify-btn').click()
                                appendNotify(document.querySelector('#only-for-notify'), 'Thành công', 'Bạn vừa sửa thành công 1 lịch sử mua hàng')
                                document.querySelector('.confirm-reload').onclick = () => {
                                    window.location.reload()
                                }
                            } else {
                                document.querySelector('.only-for-notify-btn').click()
                                appendNotify(document.querySelector('#only-for-notify'), '', 'Chỉ có người thêm mới được quyền sửa')
                            }
                        })
                        .catch(err => {
                            document.querySelector('.only-for-notify-btn').click()
                            appendNotify(document.querySelector('#only-for-notify'), '', 'Xảy ra 1 vài sự cố nhỏ, Chúng tôi sẽ sửa lại cho bạn ngay!')
                            document.querySelector('.confirm-reload').onclick = () => {
                                window.location.reload()
                            }
                        })
                    }
                }
            }
            // Ẩn hiện border quanh mỗi lịch sử mua hàng
            updatePurchaseElement.forEach(ele => {
                getParent(ele, 'history-purchase-child').classList.remove('select')
            })
            getParent(ele, 'history-purchase-child').classList.add('select')
            // Trở lại form thêm lịch sử mua hàng
            addPurchaseElement.querySelector('.back-to-add-purchase').addEventListener('click', () => {
                addPurchaseElement.scrollTop = 0
                addPurchaseElement.classList.remove('update')
                addPurchaseElement.classList.add('add')
                updatePurchaseElement.forEach(ele => {
                    getParent(ele, 'history-purchase-child').classList.remove('select')
                })
            })
        }
    })
}

// Xóa lịch sử mua hàng
async function deleteHistoryPurchase(delPurchaseElement /* Các nút xóa lịch sử mua hàng */) {
    delPurchaseElement.forEach(ele => {
        ele.onclick = () => {
            appendConfirmChange(document.querySelector('#confirm-delete-purchase'), 'Xác nhận', 'Bạn thật sự muốn xóa lịch sử mua hàng này!!', {name: 'confirm', className: 'delete-purchase-btn'})
            document.querySelector('.delete-purchase-btn').onclick = function () {
                const orderID = getParent(ele, 'history-purchase-child').getAttribute('data-id')
                axios({
                    method: 'delete',
                    url: '../purchase',
                    data: {orderID: orderID}
                })
                .then(result => {
                    if(result.data.success) {
                        document.querySelector('.only-for-notify-btn').click()
                        appendNotify(document.querySelector('#only-for-notify'), 'Thành công', 'Bạn vừa xóa một lịch sử mua hàng')
                        document.querySelector('.confirm-reload').onclick = () => {
                            window.location.reload()
                        }
                    }
                })
                .catch(err => {
                    document.querySelector('.only-for-notify-btn').click()
                    appendNotify(document.querySelector('#only-for-notify'), '', 'Xảy ra 1 vài sự cố nhỏ, Chúng tôi sẽ sửa lại cho bạn ngay!')
                    document.querySelector('.confirm-reload').onclick = () => {
                        window.location.reload()
                    }
                })
            }
        }
    })
}

function appendConfirmChange(modal /* Khuôn mẫu muốn hiện */, title /* Tiêu đề của box */, content/* Nội dung của box */, type /* Bao gồm tên loại, thêm className nếu loại là confirm */) {
    const modalTitleElement = modal.querySelector('.modal-title')
    const modalBodyElement = modal.querySelector('.modal-body')
    const modalFooterElement = modal.querySelector('.modal-footer')
    if(type.name === 'confirm') {
        modalTitleElement.innerHTML = title
        modalBodyElement.innerHTML = content
        modalFooterElement.innerHTML = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
        <button type="button" class="btn btn-primary ${type.className}" onclick="cancelClick(this)">
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Đồng ý
        </button>`
    } else {
        modalTitleElement.innerHTML = `<span class="fs-24" style="color: red;">${title}</span>`
        modalBodyElement.innerHTML = content
        modalFooterElement.innerHTML = ''
    }
}

function appendNotify(modal /* Khuôn mẫu muốn hiện */, title /* Tiêu đề của box */, content/* Nội dung của box */) {
    const modalTitleElement = modal.querySelector('.modal-header')
    const modalBodyElement = modal.querySelector('.modal-body')
    const modalFooterElement = modal.querySelector('.modal-footer')
    modalTitleElement.innerHTML = title
    modalBodyElement.innerHTML = content
    modalFooterElement.innerHTML = `
    <button type="button" class="btn btn-primary confirm-reload" data-bs-dismiss="modal">Đồng ý</button>`
}