// ================= ELEMENT =================
const registerBox = document.getElementById("registerBox");
const loginBox = document.getElementById("loginBox");
const website = document.getElementById("website");

const regUser = document.getElementById("regUser");
const regPass = document.getElementById("regPass");
const loginUser = document.getElementById("loginUser");
const loginPass = document.getElementById("loginPass");

const btnRegister = document.getElementById("btnRegister");
const btnLogin = document.getElementById("btnLogin");
const toLogin = document.getElementById("toLogin");
const darkBtn = document.getElementById("darkBtn");
const btnCheckout = document.getElementById("btnCheckout");

const cartList = document.getElementById("cartList");
const cartCount = document.getElementById("cartCount");
const totalEl = document.getElementById("total");
const reportBox = document.getElementById("report");

const payment = document.getElementById("payment");
const danaBox = document.getElementById("danaBox");
const danaTotal = document.getElementById("danaTotal");
const logoutBtn = document.getElementById("logoutBtn");


// ================= DATA =================
let users = JSON.parse(localStorage.getItem("users")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let reports = JSON.parse(localStorage.getItem("reports")) || [];


// ================= AKUN DEFAULT =================
if (users.length === 0) {
    users.push({
        u: "admin",
        p: "admin123"
    });
    localStorage.setItem("users", JSON.stringify(users));
}


// ================= AUTO LOGIN =================
if (localStorage.getItem("login") === "true") {
    registerBox.classList.add("hidden");
    loginBox.classList.add("hidden");
    website.classList.remove("hidden");
    updateCart();
    loadRatings();
    loadReport();
}

// ================= SWITCH KE LOGIN =================
toLogin.onclick = () => {
    registerBox.classList.add("hidden");
    loginBox.classList.remove("hidden");
};

// ================= REGISTER =================
btnRegister.onclick = () => {
    if (!regUser.value || !regPass.value) {
        alert("Lengkapi data");
        return;
    }

    if (users.find(u => u.u === regUser.value)) {
        alert("Username sudah digunakan");
        return;
    }

    users.push({
        u: regUser.value,
        p: regPass.value
    });

    localStorage.setItem("users", JSON.stringify(users));
    alert("Daftar berhasil, silakan login");

    registerBox.classList.add("hidden");
    loginBox.classList.remove("hidden");
};

// ================= LOGIN =================
btnLogin.onclick = () => {
    const user = users.find(
        u => u.u === loginUser.value && u.p === loginPass.value
    );

    if (!user) {
        alert("Username atau password salah");
        return;
    }

    alert("Login berhasil");

    localStorage.setItem("login", "true");

    loginBox.classList.add("hidden");
    registerBox.classList.add("hidden");
    website.classList.remove("hidden");

    updateCart();
    loadRatings();
    loadReport();

    window.location.hash = "#website";
};

// ================= CART =================
function addToCart(n, p) {
    let item = cart.find(x => x.n === n);
    item ? item.q++ : cart.push({ n, p, q: 1 });
    saveCart();
}

function updateCart() {
    cartList.innerHTML = "";
    let total = 0;

    cart.forEach(x => {
        total += x.p * x.q;
        cartList.innerHTML += `<div>${x.n} x${x.q}</div>`;
    });

    cartCount.innerText = cart.length;
    totalEl.innerText = total;
    danaTotal.innerText = total;
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
}

// ================= PAYMENT =================
payment.onchange = () => {
    danaBox.classList.toggle("hidden", payment.value !== "DANA");
};

// ================= CHECKOUT =================
btnCheckout.onclick = () => {
    if (cart.length === 0) {
        alert("Keranjang masih kosong");
        return;
    }

    if (payment.value === "") {
        alert("Pilih metode pembayaran");
        return;
    }

    reports.push({
        tgl: new Date().toLocaleString(),
        metode: payment.value,
        total: totalEl.innerText
    });

    localStorage.setItem("reports", JSON.stringify(reports));

    cart = [];
    saveCart();
    loadReport();

    alert("Pesanan berhasil diproses");
};

// ================= LAPORAN =================
function loadReport() {
    reportBox.innerHTML = "";
    reports.forEach(r => {
        reportBox.innerHTML += `
            <div>${r.tgl} | ${r.metode} | Rp ${r.total}</div>
        `;
    });
}

// ================= RATING =================
function loadRatings() {
    document.querySelectorAll(".rating").forEach(div => {
        const produk = div.dataset.produk;
        let nilai = localStorage.getItem("rate_" + produk) || 0;

        div.innerHTML = "";
        for (let i = 1; i <= 5; i++) {
            let star = document.createElement("span");
            star.innerHTML = "★";
            if (i <= nilai) star.classList.add("active");

            star.onclick = () => {
                localStorage.setItem("rate_" + produk, i);
                loadRatings();
            };

            div.appendChild(star);
        }
    });
}

// ================= DARK MODE =================
darkBtn.onclick = () => {
    document.body.classList.toggle("dark");
};
// ================= LOGOUT =================
logoutBtn.onclick = () => {
    localStorage.removeItem("login");

    website.classList.add("hidden");
    loginBox.classList.remove("hidden");

    loginUser.value = "";
    loginPass.value = "";

    alert("Berhasil logout");
};