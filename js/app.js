/**
 * app.js — Entry point: khởi tạo ứng dụng, load sản phẩm, đăng ký event listeners
 * Phụ thuộc: tất cả module trên (config, api, ui, cart, payment, iot, websocket)
 *
 * Chú ý: `cart` state được quản lý bởi cart.js. Truy cập qua getCart().
 */

// Danh sách sản phẩm được tải từ server
let products = [];

// ===========================
// Session Management
// ===========================
const SESSION_ID = 'session-' + Math.random().toString(36).substring(2, 15) + '-' + Date.now();
let heartbeatInterval;

async function startHeartbeat() {
    try {
        const res = await apiSendHeartbeat(SESSION_ID);
        if (res && res.rejected) {
            showInUseOverlay();
        } else {
            hideInUseOverlay();
        }
    } catch (err) {
        console.error('Lỗi khi gửi heartbeat:', err);
    }
}

function showInUseOverlay() {
    const overlay = document.getElementById('in-use-overlay');
    if (overlay && overlay.style.display !== 'flex') {
        overlay.style.display = 'flex';
    }
}

function hideInUseOverlay() {
    const overlay = document.getElementById('in-use-overlay');
    if (overlay && overlay.style.display !== 'none') {
        overlay.style.display = 'none';
    }
}

// ===========================
// Load Products
// ===========================

/**
 * Tải danh sách sản phẩm từ server và render.
 * Hàm này cũng được gọi lại sau khi thanh toán thành công.
 */
async function loadProducts() {
    try {
        // 1. Kiểm tra trạng thái máy
        const statusData = await apiFetchMachineStatus();
        if (statusData.success) {
            const status = statusData.data.status;
            if (status !== 'active' && status !== 'online') {
                renderMachineUnavailable(status);
                return;
            }
        }

        // 2. Fetch slots và products song song
        const [slotsResult, productsResult] = await Promise.all([
            apiFetchSlots(),
            apiFetchProducts(),
        ]);

        if (slotsResult.success && productsResult.success) {
            // Map product_id → product (chỉ các sản phẩm active)
            const productMap = {};
            for (const p of productsResult.data) {
                if (p.active) productMap[p.product_id] = p;
            }

            // Chỉ hiển thị sản phẩm được gán vào slot
            products = [];
            for (const slot of slotsResult.data) {
                if (slot.product_id && productMap[slot.product_id]) {
                    const info = productMap[slot.product_id];
                    products.push({
                        product_id: info.product_id,
                        product_name: info.product_name,
                        price: info.price,
                        image: info.image,
                        active: info.active,
                        stock: slot.stock,
                        slot_code: slot.slot_code,
                        slot_id: slot.slot_id,
                    });
                }
            }

            renderProducts(products);
        } else {
            showToast('Không thể tải danh sách sản phẩm');
            renderProducts([]);
        }
    } catch (err) {
        console.error('Error loading products:', err);
        showToast('Lỗi kết nối server. Vui lòng kiểm tra backend.');
        renderProducts([]);
    }
}

// ===========================
// Global wrappers (gọi từ HTML onclick)
// ===========================

/**
 * Wrapper cho onclick="addToCart(id)" trong product card (HTML inline).
 * Hàm addToCart thực sự nằm trong cart.js và nhận thêm mảng products.
 */
function addToCart(productId, slotCode) {
    // Gọi sang cart.js, truyền danh sách products hiện tại để kiểm tra stock
    window._cartAddToCart(productId, slotCode, products);
}

// ===========================
// Event Listeners
// ===========================

document.getElementById('qr-close')?.addEventListener('click', hideQRModal);
document.getElementById('cancel-payment-btn')?.addEventListener('click', handleCancelPayment);
document.getElementById('success-close-btn')?.addEventListener('click', hideSuccessModal);

// Đóng modal khi click overlay
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', () => {
        hideQRModal();
        hideCashModal();
        hideSuccessModal();
    });
});

// Mobile: toggle cart section
const cartSection = document.querySelector('.cart-section');
const sectionTitle = cartSection?.querySelector('.section-title');
if (sectionTitle && window.innerWidth <= 900) {
    sectionTitle.addEventListener('click', () => cartSection.classList.toggle('expanded'));
}

// ===========================
// DOMContentLoaded — Khởi tạo
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    // Đồng hồ
    updateClock();
    setInterval(updateClock, 1000);

    // Bắt đầu heartbeat
    startHeartbeat();
    heartbeatInterval = setInterval(startHeartbeat, 3000);

    // Tải sản phẩm
    loadProducts();

    // Render giỏ hàng trống
    renderCart(getCart());
});
