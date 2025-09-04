document.addEventListener('DOMContentLoaded', function() {

    // --- Logika Menu Mobile ---
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    if (menuToggle && mainNav) {
        const mobileNav = mainNav.cloneNode(true);
        mobileNav.id = 'mobile-nav';
        document.body.appendChild(mobileNav);
        menuToggle.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    // --- Logika Halaman Detail Produk ---
    const orderButton = document.getElementById('order-button');
    if (orderButton) {
        // Update harga saat varian dipilih
        document.querySelectorAll('input[name="variant_id"]').forEach(radio => {
            radio.addEventListener('change', function() {
                const price = parseFloat(this.dataset.price);
                document.getElementById('product-price').textContent = 'Rp' + new Intl.NumberFormat('id-ID').format(price);
            });
        });

        // Kontrol kuantitas
        const qtyPlus = document.getElementById('qty-plus');
        const qtyMinus = document.getElementById('qty-minus');
        const quantityInput = document.getElementById('quantity');
        if (qtyPlus && qtyMinus && quantityInput) {
            qtyPlus.addEventListener('click', () => { quantityInput.value = parseInt(quantityInput.value) + 1; });
            qtyMinus.addEventListener('click', () => {
                if (parseInt(quantityInput.value) > 1) { quantityInput.value = parseInt(quantityInput.value) - 1; }
            });
        }

        // Tombol "Pesan Sekarang"
        orderButton.addEventListener('click', function() {
            const selectedVariant = document.querySelector('input[name="variant_id"]:checked');
            const cartItem = {
                name: document.getElementById('product-name').textContent,
                variant: selectedVariant.value,
                price: parseFloat(selectedVariant.dataset.price),
                quantity: parseInt(document.getElementById('quantity').value)
            };
            // Simpan ke localStorage dan pindah ke halaman checkout
            localStorage.setItem('cart', JSON.stringify(cartItem));
            window.location.href = '/checkout.html';
        });
    }

    // --- Logika Halaman Checkout ---
    if (document.body.querySelector('.checkout-container')) {
        const cart = JSON.parse(localStorage.getItem('cart'));
        const itemContainer = document.getElementById('item-card-container');
        const paymentContainer = document.getElementById('payment-summary-container');
        const orderButton = document.getElementById('whatsapp-order-button');
        
        if (cart && itemContainer && paymentContainer) {
            const totalPrice = cart.price * cart.quantity;

            // Tampilkan detail item
            itemContainer.innerHTML = `
                <div class="item-card">
                    <div class="item-details">
                        <h4>${cart.name}</h4>
                        <p>Varian: ${cart.variant}</p>
                        <p class="price">Rp${new Intl.NumberFormat('id-ID').format(cart.price)} x ${cart.quantity}</p>
                    </div>
                    <div class="item-total">
                        <p>Rp${new Intl.NumberFormat('id-ID').format(totalPrice)}</p>
                    </div>
                </div>`;
            
            // Tampilkan rincian pembayaran
            paymentContainer.innerHTML = `
                <div class="summary-row total">
                    <span>Total</span>
                    <span>Rp${new Intl.NumberFormat('id-ID').format(totalPrice)}</span>
                </div>`;

            // Fungsionalitas Tombol Order WhatsApp
            orderButton.addEventListener('click', function() {
                const namaLengkap = document.getElementById('nama_lengkap').value;
                const nomorWhatsapp = document.getElementById('nomor_whatsapp').value;
                // 1. Baca nilai dari kolom alamat
                const alamatLengkap = document.getElementById('alamat_pengiriman').value;

                // 2. Tambahkan validasi untuk alamat
                if (!namaLengkap || !nomorWhatsapp || !alamatLengkap) {
                    alert('Nama Lengkap, Nomor WhatsApp, dan Alamat Pengiriman wajib diisi.');
                    return;
                }

                const tujuanWhatsapp = "6283841111463";
                let pesan = `Halo HStore, saya mau pesan:\n\n`;
                pesan += `*Produk:* ${cart.name}\n`;
                pesan += `*Varian:* ${cart.variant}\n`;
                pesan += `*Jumlah:* ${cart.quantity} pcs\n`;
                pesan += `*Total Harga:* Rp${new Intl.NumberFormat('id-ID').format(totalPrice)}\n\n`;
                pesan += `Berikut data saya:\n`;
                pesan += `*Nama:* ${namaLengkap}\n`;
                pesan += `*No. WhatsApp:* ${nomorWhatsapp}\n`;
                // 3. Masukkan alamat ke dalam pesan WhatsApp
                pesan += `*Alamat Pengiriman:* ${alamatLengkap}\n\n`;
                pesan += `Mohon informasinya untuk langkah selanjutnya. Terima kasih.`;
                
                const waUrl = `https://wa.me/${tujuanWhatsapp}?text=${encodeURIComponent(pesan)}`;
                
                localStorage.removeItem('cart');
                window.location.href = waUrl;
            });

        } else {
            itemContainer.innerHTML = '<p>Keranjang Anda kosong. Silakan pilih produk terlebih dahulu.</p>';
            orderButton.disabled = true;
        }
    }

    // --- Logika Slideshow ---
    let slideIndex = 1;
    function showSlides(n) {
        let slides = document.getElementsByClassName("product-slide");
        if (slides.length === 0) return;
        if (n > slides.length) { slideIndex = 1 }
        if (n < 1) { slideIndex = slides.length }
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        slides[slideIndex - 1].style.display = "block";
    }
    const prevButton = document.querySelector(".slideshow-container .prev");
    const nextButton = document.querySelector(".slideshow-container .next");
    if (prevButton) {
        showSlides(slideIndex);
        prevButton.addEventListener('click', () => showSlides(slideIndex -= 1));
        nextButton.addEventListener('click', () => showSlides(slideIndex += 1));
        setInterval(() => showSlides(slideIndex += 1), 5000);
    }
    
});
const style = document.createElement('style');
style.textContent = "#mobile-nav{display:flex;flex-direction:column;gap:20px;position:fixed;top:70px;right:0;width:80%;max-width:300px;height:calc(100vh - 70px);background-color:var(--white-color);padding:30px;transform:translateX(100%);transition:transform .3s ease-in-out;box-shadow:-2px 0 5px rgba(0,0,0,.1)}#mobile-nav.active{transform:translateX(0)}#mobile-nav a{text-decoration:none;color:var(--text-color);font-weight:600;font-size:1.2em}.menu-toggle.active span:nth-child(1){transform:rotate(45deg) translate(5px,5px)}.menu-toggle.active span:nth-child(2){opacity:0}.menu-toggle.active span:nth-child(3){transform:rotate(-45deg) translate(7px,-7px)}";
document.head.appendChild(style);
