const btnVerify = document.querySelector('.btn-verify-number');
const verifyInput = document.getElementById('verify-number');
btnVerify.onclick = async (e) => {
    e.preventDefault();
    const { status, token, phoneCustomer } = await verify();
    if (status == 'success') {
        window.localStorage.setItem('accessToken', token);
        window.localStorage.setItem('phoneCustomer', phoneCustomer);
        window.location.href = '/';
    }
    else {
        alert('Mã xác nhận không đúng, anh vui lòng thử lại ạ')
    }
}


async function verify() {
    return (await instance.post('/regis/confirm-verify', {
        data: {
            verifyNumber: verifyInput.value,
        }
    })).data;
}