# CLIENT_machine

## Mô tả dự án

Đây là ứng dụng giao diện người dùng (client) cho hệ thống máy bán hàng tự động (Vending Machine). Ứng dụng được xây dựng bằng HTML, CSS và JavaScript thuần, cho phép người dùng chọn sản phẩm, thêm vào giỏ hàng và thanh toán qua QR code hoặc tiền mặt.

## Tính năng chính

- **Hiển thị sản phẩm**: Tải và hiển thị danh sách sản phẩm từ server backend
- **Giỏ hàng**: Quản lý sản phẩm đã chọn với số lượng và tổng tiền
- **Thanh toán QR**: Tạo mã QR để thanh toán qua PayOS
- **Thanh toán tiền mặt**: Hỗ trợ thanh toán bằng tiền mặt với hiển thị tiến trình
- **Real-time**: Sử dụng WebSocket để theo dõi trạng thái thanh toán
- **Session management**: Kiểm tra và quản lý phiên sử dụng máy
- **Responsive UI**: Giao diện thân thiện, hỗ trợ đa thiết bị

## Cấu trúc thư mục

```
CLIENT_machine/
├── index.html          # File HTML chính
├── style.css           # Stylesheet cho giao diện
├── js/
│   ├── app.js          # Entry point, khởi tạo ứng dụng
│   ├── api.js          # Xử lý các API calls
│   ├── cart.js         # Quản lý trạng thái giỏ hàng
│   ├── config.js       # Cấu hình ứng dụng và endpoints
│   ├── env.example.js  # File mẫu cho biến môi trường
│   ├── env.js          # Biến môi trường (bị gitignore)
│   ├── payment.js      # Logic thanh toán
│   ├── ui.js           # Render UI và các thành phần giao diện
│   └── websocket.js    # Kết nối WebSocket cho real-time
└── README.md           # Tài liệu này
```

## Công nghệ sử dụng

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Real-time**: Socket.IO client
- **Fonts**: Google Fonts (Inter)
- **Icons**: Emoji và Unicode symbols

## Cài đặt và chạy

### Yêu cầu hệ thống

- Trình duyệt web hiện đại (Chrome, Firefox, Safari, Edge)
- Kết nối internet để tải fonts và Socket.IO

### Cấu hình

1. Sao chép file cấu hình môi trường:
   ```bash
   cp js/env.example.js js/env.js
   ```

2. Chỉnh sửa `js/env.js` với thông tin chính xác:
   - `VITE_API_BASE_URL`: URL của backend API
   - `VITE_MACHINE_KEY`: Khóa định danh máy
   - `VITE_MACHINE_ID`: ID của máy

### Chạy ứng dụng

Mở file `index.html` trong trình duyệt web. Ứng dụng sẽ tự động kết nối với backend và tải dữ liệu.

## API Endpoints

Ứng dụng giao tiếp với backend qua các endpoints sau:

- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/slots?machine_id={id}` - Lấy thông tin khe chứa
- `GET /api/machines/{id}` - Trạng thái máy
- `POST /api/iot/frontend-heartbeat` - Heartbeat cho session
- `POST /api/iot/create-order` - Tạo đơn hàng
- `GET /api/orders/{id}/status` - Trạng thái đơn hàng
- `POST /api/payment/create` - Tạo thanh toán

## Cấu trúc dữ liệu

### Sản phẩm (Product)
```javascript
{
  id: number,
  name: string,
  price: number,
  image: string,
  description: string
}
```

### Giỏ hàng (Cart Item)
```javascript
{
  product: Product,
  quantity: number
}
```

## Phát triển

### Thêm tính năng mới

1. Thêm logic vào các file JS tương ứng trong thư mục `js/`
2. Cập nhật UI trong `ui.js` nếu cần
3. Thêm styles trong `style.css`

### Debug

- Mở Developer Tools trong trình duyệt (F12)
- Kiểm tra Console để xem log lỗi
- Kiểm tra Network tab để xem API calls

## Lưu ý bảo mật

- File `js/env.js` chứa thông tin nhạy cảm và đã được thêm vào `.gitignore`
- Không commit file `env.js` lên repository
- Sử dụng HTTPS trong production

## Hỗ trợ

Nếu gặp vấn đề, kiểm tra:
1. Cấu hình trong `env.js` có đúng không
2. Backend server có đang chạy không
3. Kết nối mạng có ổn định không

## Giấy phép

Dự án này được phát triển nội bộ cho hệ thống máy bán hàng tự động.